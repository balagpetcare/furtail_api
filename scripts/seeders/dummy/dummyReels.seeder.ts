import { faker } from "@faker-js/faker";
import prisma from "../../../src/infrastructure/db/prismaClient";
import { REEL_SAMPLE_URLS, SAMPLE_THUMBNAILS } from "./dummySeeder.config";

export async function seedDummyReels(count: number, dryRun: boolean, batchSize: number) {
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
    "Reel life with my pet is never boring! 😂",
    "Wait for the end... you won't believe what they did!",
    "Just pet things. Who else can relate? 🐾",
    "POV: You wake up to this face every day.",
    "Doing the latest pet challenge! How did we do?",
  ];

  for (let b = 0; b < count; b += batchSize) {
    const batchEnd = Math.min(b + batchSize, count);
    const promises = [];

    for (let i = b + 1; i <= batchEnd; i++) {
      promises.push((async () => {
        const author = dummyUsers[(i - 1) % dummyUsers.length];
        const caption = captions[(i - 1) % captions.length] + ` (Reel #${i})`;

        // Check if reel post already exists
        const existing = await prisma.post.findFirst({
          where: {
            authorId: author.id,
            caption,
            type: "REEL"
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
          // Create Post of type REEL
          const post = await prisma.post.create({
            data: {
              authorId: author.id,
              type: "REEL",
              caption,
              privacy: "PUBLIC"
            }
          });

          // Create Media of type video
          const reelUrl = REEL_SAMPLE_URLS[(i - 1) % REEL_SAMPLE_URLS.length];
          const thumbnailUrl = SAMPLE_THUMBNAILS[(i - 1) % SAMPLE_THUMBNAILS.length];

          const media = await prisma.media.create({
            data: {
              url: reelUrl,
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
          console.error(`Failed to create dummy reel #${i}:`, err);
          results.failed++;
        }
      })());
    }
    await Promise.all(promises);
  }

  return results;
}
