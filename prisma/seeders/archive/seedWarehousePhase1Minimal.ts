import type { PrismaClient } from "@prisma/client";

/**
 * Optional: one warehouse + zone + rack + bin for the first org (dev/demo).
 * Enable with SEED_WAREHOUSE_PHASE1=true
 */
export default async function seedWarehousePhase1Minimal(prisma: PrismaClient) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;
  const org = await prisma.organization.findFirst({ orderBy: { id: "asc" }, select: { id: true } });
  if (!org) return;

  const existingWh = await prisma.warehouse.findFirst({
    where: { orgId: org.id, code: "WH-PHASE1-SEED" },
    select: { id: true },
  });
  if (existingWh) return;

  const branch = await prisma.branch.findFirst({
    where: { orgId: org.id },
    orderBy: { id: "asc" },
    select: { id: true },
  });
  if (!branch) return;

  const wh = await prisma.warehouse.create({
    data: {
      orgId: org.id,
      branchId: branch.id,
      name: "Phase1 Seed Warehouse",
      code: "WH-PHASE1-SEED",
      type: "CENTRAL",
    },
  });

  const zone = await db.warehouseZone.create({
    data: {
      warehouseId: wh.id,
      code: "Z-SEED",
      name: "Seed Zone",
    },
  });

  const rack = await db.warehouseRack.create({
    data: {
      zoneId: zone.id,
      code: "R-SEED",
      name: "Seed Rack",
    },
  });

  await db.warehouseBin.create({
    data: {
      rackId: rack.id,
      code: "B-SEED",
      name: "Seed Bin",
    },
  });
}
