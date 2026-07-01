/**
 * seedQaAccounts — local/dev only
 *
 * Creates two QA test accounts used for manual adoption flow testing:
 *   adoption.owner@test.local     — can create/manage adoption listings (isOwner=true)
 *   adoption.applicant@test.local — can browse, like, comment, save, and apply
 *
 * Safe to re-run: uses upsert-style logic (skip if email already exists).
 * NEVER runs in production (guarded by NODE_ENV check in seed.ts).
 */

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const QA_PASSWORD = "qa-test-1234";

const QA_ACCOUNTS = [
  {
    email: "adoption.owner@test.local",
    displayName: "QA Adoption Owner",
    isOwner: true,
  },
  {
    email: "adoption.applicant@test.local",
    displayName: "QA Adoption Applicant",
    isOwner: false,
  },
];

async function generateUsername(prisma: PrismaClient, base: string): Promise<string> {
  const slug = base.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  let candidate = slug;
  let i = 0;
  while (await prisma.userProfile.findUnique({ where: { username: candidate } })) {
    candidate = `${slug}_${++i}`;
  }
  return candidate;
}

export default async function seedQaAccounts(prisma: PrismaClient) {
  const passwordHash = await bcrypt.hash(QA_PASSWORD, 10);

  for (const account of QA_ACCOUNTS) {
    const existing = await prisma.userAuth.findFirst({
      where: { email: account.email },
    });

    if (existing) {
      console.log(`[seedQa] ${account.email} already exists — skipping`);
      continue;
    }

    const username = await generateUsername(prisma, account.displayName);

    const user = await prisma.user.create({
      data: {
        auth: {
          create: {
            email: account.email,
            passwordHash,
          },
        },
        profile: {
          create: {
            displayName: account.displayName,
            username,
          },
        },
        wallet: {
          create: {
            balance: 0.0,
            points: 0,
            tier: "Bronze",
            currency: "BDT",
          },
        },
      },
    });

    if (account.isOwner) {
      await prisma.ownerProfile.create({
        data: {
          userId: user.id,
          name: account.displayName,
        },
      });
    }

    console.log(`[seedQa] Created ${account.email} (id=${user.id}, owner=${account.isOwner})`);
  }

  console.log(`\n[seedQa] QA credentials (dev only):`);
  console.log(`  adoption.owner@test.local      / ${QA_PASSWORD}  (owner)`);
  console.log(`  adoption.applicant@test.local  / ${QA_PASSWORD}  (applicant)`);
}
