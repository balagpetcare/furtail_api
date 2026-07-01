/**
 * Master Catalog seed from canonical CSV.
 * MasterClinicalCatalogCategory / MasterClinicalCatalogItem models were removed from the Prisma schema.
 * This seeder is kept as a no-op until the models are restored.
 */
import { PrismaClient } from "@prisma/client";

export default async function seedMasterCatalog(_prisma: PrismaClient) {
  // eslint-disable-next-line no-console
  console.log("⏭️  seedMasterCatalog: MasterClinicalCatalog models removed from schema — skipping.");
}
