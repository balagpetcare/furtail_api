import { faker } from "@faker-js/faker";
import prisma from "../../../src/infrastructure/db/prismaClient";
import { POST_IMAGE_URLS } from "./dummySeeder.config";

export async function seedDummyPosts(count: number, dryRun: boolean, batchSize: number) {
  faker.seed(12345);
  const results = { created: 0, skipped: 0, updated: 0, failed: 0 };

  // Get all dummy users
  const dummyUsers = await prisma.user.findMany({
    where: {
      profile: {
        username: { startsWith: "dummy_user_" }
      }
    },
    select: { id: true, pets: { select: { id: true, name: true } } }
  });

  if (dummyUsers.length === 0) {
    throw new Error("No dummy users found. Please seed users first.");
  }

  const petCaptions = [
    "Look at {petName} being so lazy today! 🐾",
    "Spent the morning training {petName}. Getting better every day!",
    "Is anyone else obsessed with their pet? {petName} is simply the best.",
    "Nap time for {petName}. Too much playing!",
    "Treat time! {petName} will do any trick for a cookie.",
    "Best friend forever: {petName} ❤️",
  ];

  const generalCaptions = [
    "Just a beautiful day out in the park. 🌸",
    "Thinking about adoption? Always choose to adopt, don't shop!",
    "Taking care of animals is not just a hobby, it is a lifestyle.",
    "Checking out the new Furtail features. Love this app!",
    "Had a great chat with fellow pet owners today.",
  ];

  for (let b = 0; b < count; b += batchSize) {
    const batchEnd = Math.min(b + batchSize, count);
    const promises = [];

    for (let i = b + 1; i <= batchEnd; i++) {
      promises.push((async () => {
        const author = dummyUsers[(i - 1) % dummyUsers.length];

        // Determine if text or image post
        const isImage = i % 10 !== 0; // 90% image, 10% text
        const postType = isImage ? "IMAGE" : "TEXT";

        // Pet mentions
        let petId: number | null = null;
        let caption = "";

        if (author.pets.length > 0 && i % 2 === 0) {
          const pet = author.pets[(i - 1) % author.pets.length];
          petId = pet.id;
          const tpl = petCaptions[(i - 1) % petCaptions.length];
          caption = tpl.replace("{petName}", pet.name);
        } else {
          caption = generalCaptions[(i - 1) % generalCaptions.length];
        }

        const uniqueDedupeCaption = `${caption} (Post #${i})`;

        const existing = await prisma.post.findFirst({
          where: {
            authorId: author.id,
            caption: uniqueDedupeCaption
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
          // Create Post
          const post = await prisma.post.create({
            data: {
              authorId: author.id,
              petId,
              type: postType as any,
              caption: uniqueDedupeCaption,
              privacy: "PUBLIC"
            }
          });

          if (isImage) {
            // Create Media
            const postImageUrl = POST_IMAGE_URLS[(i - 1) % POST_IMAGE_URLS.length];
            const media = await prisma.media.create({
              data: {
                url: postImageUrl,
                type: "image",
                ownerUserId: author.id,
                status: "READY"
              }
            });

            // Link Media via PostMedia
            await prisma.postMedia.create({
              data: {
                postId: post.id,
                mediaId: media.id,
                order: 0
              }
            });
          }

          results.created++;
        } catch (err) {
          console.error(`Failed to create dummy post #${i}:`, err);
          results.failed++;
        }
      })());
    }
    await Promise.all(promises);
  }

  return results;
}
