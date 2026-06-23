import { PrismaClient } from "@prisma/client";

/**
 * BranchType model was removed from the Prisma schema.
 * This seeder is kept as a no-op to avoid breaking seed.ts import order.
 * The branch_types table (if it still exists in DB) can be dropped via a manual migration.
 */
export default async function seedBranchTypes(_prisma: PrismaClient): Promise<void> {
  // eslint-disable-next-line no-console
  console.log("⏭️  seedBranchTypes: BranchType removed from schema — skipping.");
}
