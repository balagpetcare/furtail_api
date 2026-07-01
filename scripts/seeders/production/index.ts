/**
 * Production seed entry point for the Furtail social pet platform.
 *
 * Runs only required master/config data — never creates users, pets,
 * posts, shops, clinics, products, orders, or any demo/test records.
 * All seeders are idempotent (upsert-based); safe to run multiple times.
 *
 * Usage:
 *   npm run seed:prod          — full production seed
 *   npm run seed:core          — same as seed:prod (alias)
 *   npm run seed:locations     — location data only
 */
import "dotenv/config";
import prisma from "../../../src/infrastructure/db/prismaClient";
import seedBaseBdLocations from "../../../prisma/seeders/seedBaseBdLocations";
import { runDhakaCitySeed } from "../../../prisma/seeders";
import seedCountries from "../../../prisma/seeders/seedCountries";
import { runGlobalLocationSeed } from "../../../prisma/seeders/location";
import seedCountryPolicies from "../../../prisma/seeders/seedCountryPolicies";
import seedRolesPermissions from "../../../prisma/seeders/seedRolesPermissions";
import seedGlobalCountryRoles from "../../../prisma/seeders/seedGlobalCountryRoles";
import seedSuperAdminWhitelist from "../../../prisma/seeders/seedSuperAdminWhitelist";
import seedOrganizationTypes from "../../../prisma/seeders/seedOrganizationTypes";
import seedFundraisingPayoutCatalog from "../../../prisma/seeders/seedFundraisingPayoutCatalog";
import seedAnimalTaxonomy from "../../../prisma/seeders/seedAnimalTaxonomy";
import seedVaccineTypes from "../../../prisma/seeders/seedVaccineTypes";

async function main() {
  console.log("🚀 Furtail production seed starting...");

  // ── 1) Location: BD hierarchy (divisions → districts → upazilas → areas) ──
  console.log("📍 [1/10] BD base locations...");
  await seedBaseBdLocations(prisma);

  // ── 2) Location: Dhaka city corporations / zones / areas ──────────────────
  console.log("📍 [2/10] Dhaka city areas...");
  await runDhakaCitySeed(prisma);

  // ── 3) Location: global countries, states, cities, sub-districts ──────────
  console.log("🌍 [3/10] Global location tables...");
  await seedCountries(prisma);
  await runGlobalLocationSeed(prisma);
  await seedCountryPolicies(prisma);

  // ── 4) RBAC: system roles + permissions ───────────────────────────────────
  console.log("🔐 [4/10] Roles & permissions...");
  await seedRolesPermissions(prisma);

  // ── 5) RBAC: global / country-level roles (SUPER_ADMIN, COUNTRY_ADMIN…) ──
  console.log("🔐 [5/10] Global / country roles...");
  await seedGlobalCountryRoles(prisma);

  // ── 6) Admin bootstrap: super-admin whitelist from env ────────────────────
  console.log("👤 [6/10] Super-admin whitelist...");
  await seedSuperAdminWhitelist(prisma);

  // ── 7) Organization types master ──────────────────────────────────────────
  console.log("🏢 [7/10] Organization types...");
  await seedOrganizationTypes(prisma);

  // ── 8) Fundraising payout method catalog (bKash, Nagad, Rocket, Bank) ─────
  console.log("💸 [8/10] Fundraising payout catalog...");
  await seedFundraisingPayoutCatalog(prisma);

  // ── 9) Pet master data: taxonomy (categories → types → breeds, sizes,
  //       colors, coat patterns) ─────────────────────────────────────────────
  console.log("🐾 [9/10] Animal taxonomy (types, breeds, sizes, colors)...");
  await seedAnimalTaxonomy(prisma);

  // ── 10) Pet master data: vaccine types for vaccination reminders ──────────
  console.log("💉 [10/10] Vaccine types...");
  await seedVaccineTypes(prisma);

  console.log("✅ Production seed complete. No dummy/demo data was created.");
}

main()
  .catch((e) => {
    console.error("❌ Production seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
