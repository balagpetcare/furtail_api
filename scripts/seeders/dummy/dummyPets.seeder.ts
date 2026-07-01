import { faker } from "@faker-js/faker";
import prisma from "../../../src/infrastructure/db/prismaClient";
import { PET_IMAGE_URLS } from "./dummySeeder.config";

export async function seedDummyPets(count: number, dryRun: boolean, batchSize: number) {
  faker.seed(12345);
  const results = { created: 0, skipped: 0, updated: 0, failed: 0 };

  // Get all dummy users
  const dummyUsers = await prisma.user.findMany({
    where: {
      profile: {
        username: { startsWith: "dummy_user_" }
      }
    },
    select: { id: true, profile: { select: { username: true } } }
  });

  if (dummyUsers.length === 0) {
    throw new Error("No dummy users found. Please seed users first.");
  }

  // Get available breeds and animal types
  const animalTypes = await prisma.animalType.findMany();
  const breeds = await prisma.breed.findMany();

  // Helper map to group breeds by animalType
  const breedsByType: Record<number, any[]> = {};
  for (const b of breeds) {
    if (!breedsByType[b.animalTypeId]) {
      breedsByType[b.animalTypeId] = [];
    }
    breedsByType[b.animalTypeId].push(b);
  }

  for (let b = 0; b < count; b += batchSize) {
    const batchEnd = Math.min(b + batchSize, count);
    const promises = [];

    for (let i = b + 1; i <= batchEnd; i++) {
      promises.push((async () => {
        const pad = String(i).padStart(4, "0");
        const name = faker.helpers.arrayElement([
          "Max", "Bella", "Charlie", "Luna", "Lucy", "Cooper", "Bailey", "Daisy", 
          "Rocky", "Lola", "Buddy", "Sadie", "Milo", "Coco", "Toby", "Sophie"
        ]) + `_${pad}`;
        
        const slug = `dummy_pet_${pad}`;
        const bio = `Hi, I am ${name}! I love treats and playing all day.`;

        // Re-use or skip if already exists
        const existing = await prisma.pet.findFirst({
          where: { slug }
        });

        if (existing) {
          results.skipped++;
          return;
        }

        if (dryRun) {
          results.created++;
          return;
        }

        // Connect to dummy user
        const user = dummyUsers[(i - 1) % dummyUsers.length];

        // Select deterministic type/breed (1: Dog, 2: Cat, 3: Bird, 4: Rabbit)
        const typeId = faker.helpers.arrayElement([1, 2, 3, 4]);
        const animalType = animalTypes.find(t => t.id === typeId) || animalTypes[0];
        const typeBreeds = breedsByType[animalType.id] || [];
        const breed = typeBreeds.length > 0 ? faker.helpers.arrayElement(typeBreeds) : null;

        // Get corresponding pet image list
        const petTypeKey = animalType.code === "dog" ? "dog" :
                           animalType.code === "cat" ? "cat" :
                           animalType.code === "bird" ? "bird" :
                           animalType.code === "rabbit" ? "rabbit" : "other";
        const imageList = PET_IMAGE_URLS[petTypeKey] || PET_IMAGE_URLS.other;
        const petImageUrl = imageList[(i - 1) % imageList.length];

        try {
          // Create profile picture media
          const profilePic = await prisma.media.create({
            data: {
              url: petImageUrl,
              type: "image",
              ownerUserId: user.id,
              status: "READY"
            }
          });

          // Create pet
          await prisma.pet.create({
            data: {
              userId: user.id,
              animalTypeId: animalType.id,
              breedId: breed ? breed.id : null,
              profilePicId: profilePic.id,
              name,
              sex: faker.helpers.arrayElement(["MALE", "FEMALE", "UNKNOWN"]) as any,
              dateOfBirth: faker.date.birthdate({ min: 1, max: 10, mode: "age" }),
              status: "ACTIVE",
              slug,
              bio,
              isPublicProfileEnabled: true,
              visibility: "PUBLIC",
              notes: "dummy_data_seeder"
            }
          });

          results.created++;
        } catch (err) {
          console.error(`Failed to create dummy pet ${name}:`, err);
          results.failed++;
        }
      })());
    }
    
    await Promise.all(promises);
  }

  return results;
}
