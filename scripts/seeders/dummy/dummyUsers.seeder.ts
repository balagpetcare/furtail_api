import { faker } from "@faker-js/faker";
import prisma from "../../../src/infrastructure/db/prismaClient";
import bcrypt from "bcrypt";
import { USER_AVATAR_IMAGE_URLS, USER_COVER_IMAGE_URLS } from "./dummySeeder.config";

export async function seedDummyUsers(count: number, dryRun: boolean, batchSize: number) {
  faker.seed(12345);
  const results = { created: 0, skipped: 0, updated: 0, failed: 0 };
  const passwordHash = await bcrypt.hash("Password123", 10);

  for (let b = 0; b < count; b += batchSize) {
    const batchEnd = Math.min(b + batchSize, count);
    const promises = [];

    for (let i = b + 1; i <= batchEnd; i++) {
      promises.push((async () => {
        const pad = String(i).padStart(4, "0");
        const email = `dummy.user.${pad}@furtail.test`;
        const username = `dummy_user_${pad}`;
        const phone = `019${pad.padStart(8, "0")}`; // Valid fake BD number
        const displayName = faker.person.fullName();
        const bio = faker.person.bio();

        // Check if user already exists
        const existing = await prisma.user.findFirst({
          where: {
            auth: {
              OR: [
                { email },
                { phone }
              ]
            }
          },
          include: {
            auth: true,
            profile: true
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
          // Create User
          const user = await prisma.user.create({
            data: {
              status: "ACTIVE"
            }
          });

          // Create UserAuth
          await prisma.userAuth.create({
            data: {
              userId: user.id,
              provider: "LOCAL",
              email,
              phone,
              passwordHash,
            }
          });

          // Select deterministic avatar and cover
          const avatarUrl = USER_AVATAR_IMAGE_URLS[(i - 1) % USER_AVATAR_IMAGE_URLS.length];
          const coverUrl = USER_COVER_IMAGE_URLS[(i - 1) % USER_COVER_IMAGE_URLS.length];

          // Create avatar and cover Media records
          const avatarMedia = await prisma.media.create({
            data: {
              url: avatarUrl,
              type: "image",
              ownerUserId: user.id,
              status: "READY"
            }
          });

          const coverMedia = await prisma.media.create({
            data: {
              url: coverUrl,
              type: "image",
              ownerUserId: user.id,
              status: "READY"
            }
          });

          // Create UserProfile
          await prisma.userProfile.create({
            data: {
              userId: user.id,
              displayName,
              username,
              bio,
              visibility: "PUBLIC",
              avatarMediaId: avatarMedia.id,
              coverMediaId: coverMedia.id,
              gender: faker.helpers.arrayElement(["MALE", "FEMALE"]) as any,
              dateOfBirth: faker.date.birthdate({ min: 18, max: 50, mode: "age" })
            }
          });

          results.created++;
        } catch (err) {
          console.error(`Failed to create dummy user ${username}:`, err);
          results.failed++;
        }
      })());
    }
    
    await Promise.all(promises);
  }

  return results;
}
