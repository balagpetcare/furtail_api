import "dotenv/config";
import prisma from "../src/infrastructure/db/prismaClient";
import seedBaseBdLocations from "./seeders/seedBaseBdLocations";
import { runDhakaCitySeed } from "./seeders";
import seedCountries from "./seeders/seedCountries";
import { runGlobalLocationSeed } from "./seeders/location";
import seedCountryPolicies from "./seeders/seedCountryPolicies";
import seedRolesPermissions from "./seeders/seedRolesPermissions";
import seedGlobalCountryRoles from "./seeders/seedGlobalCountryRoles";
import seedSuperAdminWhitelist from "./seeders/seedSuperAdminWhitelist";
import seedOrganizationTypes from "./seeders/seedOrganizationTypes";
import seedFundraisingPayoutCatalog from "./seeders/seedFundraisingPayoutCatalog";
import seedAnimalTaxonomy from "./seeders/seedAnimalTaxonomy";
import seedVaccineTypes from "./seeders/seedVaccineTypes";
import seedFeelingActivities from "./seeders/seedFeelingActivities";
import seedQaAccounts from "./seeders/seedQaAccounts";
import seedQaFundraisingCampaign from "./seeders/seedQaFundraisingCampaign";

async function main() {
  // ── 1) Location: BD hierarchy (divisions → districts → upazilas → areas) ──
  await seedBaseBdLocations(prisma);

  // ── 2) Location: Dhaka city corporations / zones / areas ──────────────────
  await runDhakaCitySeed(prisma);

  // ── 3) Location: global countries, states, cities, sub-districts ──────────
  await seedCountries(prisma);
  await runGlobalLocationSeed(prisma);
  await seedCountryPolicies(prisma);

  // ── 4) RBAC: system roles + permissions ───────────────────────────────────
  await seedRolesPermissions(prisma);

  // ── 5) RBAC: global / country-level roles (SUPER_ADMIN, COUNTRY_ADMIN…) ──
  await seedGlobalCountryRoles(prisma);

  // ── 6) Admin bootstrap: super-admin whitelist from env ────────────────────
  await seedSuperAdminWhitelist(prisma);

  // ── 7) Organization types master (VET_CLINIC, PET_SHOP, FOSTER_CARE…) ─────
  await seedOrganizationTypes(prisma);

  // ── 8) Fundraising: payout method catalog (bKash, Nagad, Rocket, Bank) ────
  await seedFundraisingPayoutCatalog(prisma);

  // ── 9) Pet master data: taxonomy (categories → types → breeds, sizes,
  //       colors, coat patterns) ─────────────────────────────────────────────
  await seedAnimalTaxonomy(prisma);

  // ── 10) Pet master data: vaccine types for vaccination reminders ──────────
  await seedVaccineTypes(prisma);

  // ── 11) QA test accounts (dev/local only) ─────────────────────────────────
  if (process.env.NODE_ENV !== "production") {
    await seedQaAccounts(prisma);
    await seedQaFundraisingCampaign(prisma);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
      // ── 12) Feeling & Activity items ──────────────────────────────────────
  await seedFeelingActivities(prisma);

  await prisma.$disconnect();
  });
