import { faker } from "@faker-js/faker";
import prisma from "../../../src/infrastructure/db/prismaClient";
import { VIDEO_SAMPLE_URLS, SAMPLE_THUMBNAILS } from "./dummySeeder.config";

export async function seedDummyVideos(count: number, dryRun: boolean, batchSize: number) {
  faker.seed(12345);
  const results = { created: 0, skipped: 0, updated: 0, failed: 0 };

  // Get all dummy users
  const dummyUsers = await prisma.user.findMany({
    where: {
      profile: {
        username: { startsWith: "dummy_user_" }
      }
    },
    select: { id: true }
  });

  if (dummyUsers.length === 0) {
    throw new Error("No dummy users found. Please seed users first.");
  }

  const captions = [
    "Check out this cool video of my pet doing tricks! 🎬",
    "A quick update on our morning routine.",
    "Look at this funny moment! Couldn't resist sharing.",
    "Pet training vlog #1. Let me know your thoughts!",
    "Just a cute video to brighten your day. 🐾",
  ];

  for (let b = 0; b < count; b += batchSize) {
    const batchEnd = Math.min(b + batchSize, count);
    const promises = [];

    for (let i = b + 1; i <= batchEnd; i++) {
      promises.push((async () => {
        const author = dummyUsers[(i - 1) % dummyUsers.length];
        const caption = captions[(i - 1) % captions.length] + ` (Video #${i})`;

        // Check if video post already exists for this author
        const existing = await prisma.post.findFirst({
          where: {
            authorId: author.id,
            caption,
            type: "VIDEO"
          }
        });

        if (existing) {
          results.skipped++;
          return;
        }

        if (dryRun) {
          results.created++;
          return;
        }

        try {
          // Create Post of type VIDEO
          const post = await prisma.post.create({
            data: {
              authorId: author.id,
              type: "VIDEO",
              caption,
              privacy: "PUBLIC"
            }
          });

          // Create Media of type video
          const videoUrl = VIDEO_SAMPLE_URLS[(i - 1) % VIDEO_SAMPLE_URLS.length];
          const thumbnailUrl = SAMPLE_THUMBNAILS[(i - 1) % SAMPLE_THUMBNAILS.length];

          const media = await prisma.media.create({
            data: {
              url: videoUrl,
              type: "video",
              thumbnailUrl,
              ownerUserId: author.id,
              status: "READY"
            }
          });

          // Link via PostMedia
          await prisma.postMedia.create({
            data: {
              postId: post.id,
              mediaId: media.id,
              order: 0
            }
          });

          results.created++;
        } catch (err) {
          console.error(`Failed to create dummy video #${i}:`, err);
          results.failed++;
        }
      })());
    }
    await Promise.all(promises);
  }

  return results;
}
