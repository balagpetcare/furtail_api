import { PrismaClient } from '@prisma/client';
import seedDhakaNorthCityBdAreas from './seedDhakaNorthCityBdAreas';
import seedDhakaSouthCityBdAreas from './seedDhakaSouthCityBdAreas';
import { seedDhakaMetroUpazilasAndAreas } from './seedDhakaMetroUpazilasAndAreas';

export async function runDhakaCitySeed(prisma: PrismaClient) {
  await seedDhakaNorthCityBdAreas(prisma);
  await seedDhakaSouthCityBdAreas(prisma);
  await seedDhakaMetroUpazilasAndAreas(prisma);
}
