/**
 * Seeds the `countries` table with every ISO 3166-1 entry.
 * Idempotent: upserts on the unique `code` column.
 * Data source: ./data/world-countries.ts
 * BD/IN/LK/MY/SG child location seeders (states, cities, sub-districts)
 * are unaffected — they look up parent rows by code, not by array index.
 */

import { PrismaClient } from "@prisma/client";
import { WORLD_COUNTRIES } from "./data/world-countries";

export default async function seedGlobalCountries(prisma: PrismaClient): Promise<void> {
  for (const c of WORLD_COUNTRIES) {
    await prisma.country.upsert({
      where: { code: c.code },
      update: {
        name:            c.name,
        currencyCode:    c.currencyCode,
        timezoneDefault: c.timezoneDefault,
        phoneCode:       c.phoneCode,
        latitude:        c.latitude,
        longitude:       c.longitude,
        isActive:        true,
      },
      create: {
        code:            c.code,
        name:            c.name,
        currencyCode:    c.currencyCode,
        timezoneDefault: c.timezoneDefault,
        phoneCode:       c.phoneCode,
        latitude:        c.latitude,
        longitude:       c.longitude,
        isActive:        true,
      },
    });
  }
  console.log(`✅ Global location countries seeded: ${WORLD_COUNTRIES.length}`);
}
