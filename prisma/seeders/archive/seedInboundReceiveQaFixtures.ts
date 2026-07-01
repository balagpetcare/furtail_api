import type { PrismaClient } from "@prisma/client";

/**
 * Optional diagnostics when SEED_INBOUND_RECEIVE_QA=true.
 * Does not write inventory rows (ledger-safe). See docs/INBOUND_RECEIVE_QA_FIXTURES.md.
 */
export default async function seedInboundReceiveQaFixtures(prisma: PrismaClient): Promise<void> {
  if (process.env.SEED_INBOUND_RECEIVE_QA !== "true") {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;
  const [orgCount, transitTransfers, transitDispatches, packedDispatches] = await Promise.all([
    prisma.organization.count(),
    db.stockTransfer.count({ where: { status: { in: ["SENT", "IN_TRANSIT"] } } }),
    db.stockDispatch.count({ where: { status: "IN_TRANSIT" } }),
    db.stockDispatch.count({ where: { status: "PACKED" } }),
  ]);

  console.log(
    `[seedInboundReceiveQaFixtures] orgs=${orgCount} transfers(SENT|IN_TRANSIT)=${transitTransfers} dispatches(IN_TRANSIT)=${transitDispatches} dispatches(PACKED)=${packedDispatches}`
  );
  console.log(
    "[seedInboundReceiveQaFixtures] To create rows: owner PATCH /stock-requests/:id/fulfill or dispatch send. See docs/INBOUND_RECEIVE_QA_FIXTURES.md"
  );
}
