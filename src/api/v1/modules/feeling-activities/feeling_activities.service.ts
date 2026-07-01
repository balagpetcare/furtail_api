const { prisma } = require("../../../../config/prisma");

/**
 * List feeling/activity items with optional filters.
 * Returns only active items by default.
 */
async function list(filters) {
  const where/*: Prisma.FeelingActivityWhereInput*/ = { isActive: true } as Record<string, any>;

  if (filters.type) {
    where.type = filters.type;
  }
  if (filters.category) {
    where.category = filters.category;
  }
  if (filters.petSpecific !== undefined) {
    where.isPetSpecific = filters.petSpecific;
  }
  if (filters.q) {
    where.labelEn = {
      contains: filters.q,
      mode: "insensitive",
    };
  }

  const items = await prisma.feelingActivity.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { labelEn: "asc" }],
  });

  return items;
}

module.exports = { list };
export {};
