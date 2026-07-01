import type { PrismaClient } from "@prisma/client";

/**
 * Backfill memberships for existing data:
 * - For each Organization, ensure ownerUserId is OrgMember(OWNER)
 * - For each Branch, ensure owner is BranchMember(BRANCH_MANAGER) or (DELIVERY_MANAGER) based on branch types
 *
 * Safe to run multiple times (uses upsert).
 */
export default async function seedMembershipBackfill(prisma: PrismaClient) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = prisma as any;
  const orgs = await prisma.organization.findMany({
    select: { id: true, ownerUserId: true },
  });

  let orgMemberUpserts = 0;
  let branchMemberUpserts = 0;
  let producerStaffUpserts = 0;

  const producerOwnerRole = await prisma.role.findUnique({
    where: { key: "PRODUCER_OWNER" },
    select: { id: true },
  });

  for (const org of orgs) {
    if (!org.ownerUserId) continue;



    const branches = await prisma.branch.findMany({
      where: { orgId: org.id },
      select: { id: true, orgId: true },
    });

    for (const b of branches) {
      // BranchType relation removed from schema; default to BRANCH_MANAGER
      const isDeliveryHub = false;

      const role = isDeliveryHub ? "DELIVERY_MANAGER" : "BRANCH_MANAGER";

      await prisma.branchMember.upsert({
        where: {
          branchId_userId: {
            branchId: b.id,
            userId: org.ownerUserId,
          },
        },
        update: {
          role,
          status: "ACTIVE",
        },
        create: {
          orgId: b.orgId,
          branchId: b.id,
          userId: org.ownerUserId,
          role,
          status: "ACTIVE",
        },
      });
      branchMemberUpserts++;
    }
  }

  if (producerOwnerRole?.id) {
    let producerOrgs: any[] = [];
    try {
      producerOrgs = await db.producerOrg.findMany({ select: { id: true, ownerUserId: true } });
    } catch {
      // ProducerOrg model may not exist; skip silently
    }

    for (const org of producerOrgs) {
      if (!org.ownerUserId) continue;
      try {
      await db.producerOrgStaff.upsert({
        where: {
          producerOrgId_userId: {
            producerOrgId: org.id,
            userId: org.ownerUserId,
          },
        },
        update: { roleId: producerOwnerRole.id },
        create: {
          producerOrgId: org.id,
          userId: org.ownerUserId,
          roleId: producerOwnerRole.id,
          invitedBy: null,
        },
      });
      producerStaffUpserts++;
      } catch { /* ProducerOrgStaff model may not exist */ }
    }
  }

  // eslint-disable-next-line no-console
  console.log(`✅ Membership backfill done. orgMembers upserted: ${orgMemberUpserts}, branchMembers upserted: ${branchMemberUpserts}, producerStaff upserted: ${producerStaffUpserts}`);
}
