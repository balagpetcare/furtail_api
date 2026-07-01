import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const QA_OWNER_EMAIL = "fundraising.owner@test.local";
const QA_DONOR_EMAIL = "fundraising.donor@test.local";
const QA_CAMPAIGN_TITLE = "[QA DEV] Local Fundraising Test Campaign";

async function ensureQaUser(
  prisma: PrismaClient,
  email: string,
  displayName: string,
) {
  const existing = await prisma.userAuth.findFirst({
    where: { email },
    select: { userId: true },
  });
  if (existing) return existing.userId;

  const passwordHash = await bcrypt.hash("qa-test-1234", 10);
  const usernameBase = displayName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  let username = usernameBase;
  let suffix = 0;
  while (await prisma.userProfile.findUnique({ where: { username } })) {
    suffix += 1;
    username = `${usernameBase}_${suffix}`;
  }

  const user = await prisma.user.create({
    data: {
      status: "ACTIVE",
      auth: {
        create: {
          email,
          passwordHash,
        },
      },
      profile: {
        create: {
          displayName,
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

  console.log(`[seedQaFundraising] Created QA user ${email} (id=${user.id})`);
  return user.id;
}

export default async function seedQaFundraisingCampaign(prisma: PrismaClient) {
  const existing = await prisma.fundraisingCampaign.findFirst({
    where: {
      title: QA_CAMPAIGN_TITLE,
      deletedAt: null,
    },
    select: { id: true },
  });
  if (existing) {
    console.log(`[seedQaFundraising] ${QA_CAMPAIGN_TITLE} already exists - skipping`);
    return;
  }

  const ownerUserId = await ensureQaUser(prisma, QA_OWNER_EMAIL, "QA Fundraising Owner");
  const donorUserId = await ensureQaUser(prisma, QA_DONOR_EMAIL, "QA Fundraising Donor");

  const now = new Date();
  const deadline = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 21);

  const account = await prisma.fundraisingAccount.upsert({
    where: { userId: ownerUserId },
    update: {
      status: "VERIFIED",
      accountType: "INDIVIDUAL",
      presentAddress: "QA Dev Only, Dhaka",
      permanentAddress: "QA Dev Only, Dhaka",
      occupation: "QA Testing",
      area: "QA Lab",
      rescueSinceYear: 2025,
      dateOfBirth: new Date("1995-01-01T00:00:00.000Z"),
      nationalIdNumber: "QA-DEV-FUNDRAISING",
      countryCode: "BD",
      countryName: "Bangladesh",
      stateName: "Dhaka Division",
      cityName: "Dhaka",
      addressLine: "QA Dev Only",
      formattedAddress: "QA Dev Only, Dhaka, Bangladesh",
      submittedAt: now,
    },
    create: {
      userId: ownerUserId,
      status: "VERIFIED",
      accountType: "INDIVIDUAL",
      presentAddress: "QA Dev Only, Dhaka",
      permanentAddress: "QA Dev Only, Dhaka",
      occupation: "QA Testing",
      area: "QA Lab",
      rescueSinceYear: 2025,
      dateOfBirth: new Date("1995-01-01T00:00:00.000Z"),
      nationalIdNumber: "QA-DEV-FUNDRAISING",
      countryCode: "BD",
      countryName: "Bangladesh",
      stateName: "Dhaka Division",
      cityName: "Dhaka",
      addressLine: "QA Dev Only",
      formattedAddress: "QA Dev Only, Dhaka, Bangladesh",
      submittedAt: now,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    const post = await tx.post.create({
      data: {
        authorId: ownerUserId,
        type: "IMAGE",
        category: "FUNDRAISING",
        caption: "[QA DEV] This campaign exists only for local emulator verification.",
      },
    });

    const media = await tx.media.create({
      data: {
        url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
        type: "image",
        ownerUserId: ownerUserId,
        status: "READY",
      },
    });

    await tx.postMedia.create({
      data: {
        postId: post.id,
        mediaId: media.id,
        order: 0,
      },
    });

    const campaign = await tx.fundraisingCampaign.create({
      data: {
        postId: post.id,
        accountId: account.id,
        title: QA_CAMPAIGN_TITLE,
        targetAmount: 5000,
        deadline,
        category: "Rescue",
        locationText: "Dhaka, Bangladesh",
        countryCode: "BD",
        stats: {
          create: {
            raisedAmount: 250,
            donorsCount: 1,
            lastDonationAt: now,
          },
        },
      },
      include: {
        stats: true,
      },
    });

    await tx.donation.create({
      data: {
        campaignId: campaign.id,
        donorId: donorUserId,
        amount: 250,
        status: "SUCCESS",
        policyVersion: "qa-dev-local",
      },
    });

    return campaign;
  });

  console.log(
    `[seedQaFundraising] Created QA campaign ${result.id} for account ${account.id} (${QA_CAMPAIGN_TITLE})`
  );
  console.log(
    "[seedQaFundraising] Marked as dev-only test data for local emulator verification."
  );
}
