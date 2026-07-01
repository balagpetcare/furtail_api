import "../src/common/jobs/workerEnv.bootstrap";
import prisma from "../src/infrastructure/db/prismaClient";
import { addVideoProcessingJob } from "../src/common/queue/queues";
import { disconnectRedis } from "../src/infrastructure/redis/redis.client";

async function main(): Promise<void> {
  const limit = Math.max(1, Math.min(Number(process.env.LIMIT || 100), 500));
  const folder = process.env.VIDEO_REQUEUE_FOLDER || "media";
  const rows = await prisma.media.findMany({
    where: {
      type: { in: ["VIDEO", "REEL"] },
      deletedAt: null,
      originalKey: { not: null },
      OR: [{ status: "PENDING" }, { status: "PROCESSING" }, { status: "FAILED" }],
    },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  let requeued = 0;
  for (const media of rows) {
    const jobId = await addVideoProcessingJob({
      mediaId: media.id,
      rawKey: media.originalKey || media.key || "",
      folder,
      ownerUserId: media.ownerUserId,
    });
    if (!jobId) {
      console.warn(`[requeue-unprocessed-videos] queue unavailable mediaId=${media.id}`);
      continue;
    }
    await prisma.media.update({
      where: { id: media.id },
      data: { status: "PENDING", processingError: null },
    });
    requeued++;
    console.log(`[requeue-unprocessed-videos] mediaId=${media.id} userId=${media.ownerUserId} queueJobId=${jobId}`);
  }

  console.log(`[requeue-unprocessed-videos] scanned=${rows.length} requeued=${requeued}`);
}

main()
  .catch((err) => {
    console.error("[requeue-unprocessed-videos] failed", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectRedis().catch(() => {});
    await prisma.$disconnect().catch(() => {});
  });