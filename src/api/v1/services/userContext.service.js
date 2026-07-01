/**
 * User Context Service (Consolidated/Mocked for schema.prisma changes)
 * Multi-context: list contexts for user dynamically from Organization and BranchMember.
 */

const prisma = require("../../../infrastructure/db/prismaClient").default ?? require("../../../infrastructure/db/prismaClient");

/**
 * List all contexts for a user (owner, branch, role).
 * @param {number} userId
 * @returns {Promise<Array>} contexts with branch/org names
 */
async function listContexts(userId) {
  const contexts = [];

  // 1) Owner context
  const ownedOrgs = await prisma.organization.findMany({
    where: { ownerUserId: Number(userId) },
    select: {
      id: true,
      name: true,
      owner: {
        select: {
          id: true,
          profile: { select: { displayName: true } }
        }
      }
    }
  });

  for (const org of ownedOrgs) {
    contexts.push({
      id: org.id, // Mock context ID using org ID
      userId: Number(userId),
      ownerUserId: Number(userId),
      branchId: null,
      teamId: null,
      roles: ["OWNER"],
      scopes: ["ALL"],
      defaultDashboard: "owner",
      isDefault: false,
      owner: org.owner ? { id: org.owner.id, displayName: org.owner.profile?.displayName } : null,
      branch: null,
      team: null,
    });
  }

  // 2) Branch staff contexts
  const branchMembers = await prisma.branchMember.findMany({
    where: { userId: Number(userId), status: "ACTIVE" },
    include: {
      branch: { select: { id: true, name: true } },
      org: {
        select: {
          id: true,
          name: true,
          owner: {
            select: {
              id: true,
              profile: { select: { displayName: true } }
            }
          }
        }
      }
    }
  });

  for (const bm of branchMembers) {
    contexts.push({
      id: bm.id,
      userId: Number(userId),
      ownerUserId: bm.org?.owner?.id || null,
      branchId: bm.branchId,
      teamId: null,
      roles: [bm.role],
      scopes: [],
      defaultDashboard: bm.role === "DOCTOR" ? "doctor" : "staff",
      isDefault: false,
      owner: bm.org?.owner ? { id: bm.org.owner.id, displayName: bm.org.owner.profile?.displayName } : null,
      branch: bm.branch ? { id: bm.branch.id, name: bm.branch.name } : null,
      team: null,
    });
  }

  // If there are contexts, make the first one default for fallback compatibility
  if (contexts.length > 0) {
    contexts[0].isDefault = true;
  }

  return contexts;
}

/**
 * Get the default (or first) context for user. Returns null if none.
 */
async function getDefaultContext(userId) {
  const all = await listContexts(userId);
  return all.find((c) => c.isDefault) || all[0] || null;
}

/**
 * Set one context as the default for the user. (Mocked)
 */
async function setDefaultContext(userId, contextId) {
  const all = await listContexts(userId);
  return all.find((c) => c.id === contextId) || null;
}

/**
 * Create a user context. (Mocked/noop since UserContext table is deleted)
 */
async function createContext(data) {
  return { id: 1, ...data };
}

module.exports = {
  listContexts,
  setDefaultContext,
  createContext,
  getDefaultContext,
};
