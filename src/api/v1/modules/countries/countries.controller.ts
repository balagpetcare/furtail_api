/**
 * Public countries controller.
 *
 * GET /api/v1/public/countries           — Active countries, sorted
 * GET /api/v1/public/countries/default   — Single default country
 *
 * The DB field `code` stores ISO 3166-1 alpha-2; we expose it as `iso2`
 * in the API response to match the frontend contract.
 *
 * Admin CRUD can be added later at /api/v1/admin/countries.
 */

const prisma = require("../../../../infrastructure/db/prismaClient");

/** Fields exposed in the public API response. */
const selectFields = {
  id: true,
  name: true,
  code: true, // mapped to iso2 below
  iso3: true,
  phoneCode: true,
  currencyCode: true,
  currencySymbol: true,
  flagEmoji: true,
  flagAssetUrl: true,
  isSupported: true,
  isDefault: true,
  paymentEnabled: true,
  contentEnabled: true,
  supportEnabled: true,
} as const;

/** Map Prisma row to public API shape (code → iso2). */
function toResponse(row: Record<string, any>) {
  const { code, ...rest } = row;
  return { iso2: code, ...rest };
}

/**
 * GET /public/countries
 * Returns all active countries sorted by:
 * 1. isDefault DESC
 * 2. isSupported DESC
 * 3. sortOrder ASC
 * 4. name ASC
 */
exports.listActive = async (req: any, res: any) => {
  try {
    const rows = await prisma.country.findMany({
      where: { isActive: true },
      select: selectFields,
      orderBy: [
        { isDefault: "desc" },
        { isSupported: "desc" },
        { sortOrder: "asc" },
        { name: "asc" },
      ],
    });

    const data = rows.map(toResponse);
    return res.json({ success: true, data });
  } catch (e: any) {
    console.error("countries.listActive error:", e);
    return res
      .status(500)
      .json({ success: false, message: e?.message || "Server error" });
  }
};

/**
 * GET /public/countries/default
 * Returns the single default active country.
 */
exports.getDefault = async (req: any, res: any) => {
  try {
    const row = await prisma.country.findFirst({
      where: { isActive: true, isDefault: true },
      select: selectFields,
    });

    if (!row) {
      return res
        .status(404)
        .json({ success: false, message: "No default country configured" });
    }

    return res.json({ success: true, data: toResponse(row) });
  } catch (e: any) {
    console.error("countries.getDefault error:", e);
    return res
      .status(500)
      .json({ success: false, message: e?.message || "Server error" });
  }
};

export {};
