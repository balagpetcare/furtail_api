const prisma = require("../../../../infrastructure/db/prismaClient");
const { createNotification } = require("../../services/notification.service");
const { writeAudit } = require("../../../../middlewares/auditWriter");

type AdoptionPetStatus = string;

function toInt(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : null;
}

function createHttpError(statusCode: number, message: string) {
  const error = new Error(message) as Error & { statusCode?: number };
  error.statusCode = statusCode;
  return error;
}

function isAdminLike(user: any): boolean {
  const role = String(user?.role || user?.userType || "").toUpperCase();
  const perms = new Set(
    Array.isArray(user?.permissions)
      ? user.permissions.map((entry: unknown) => String(entry))
      : Array.isArray(user?.perms)
      ? user.perms.map((entry: unknown) => String(entry))
      : []
  );

  return (
    Boolean(user?.isWhitelistedAdmin) ||
    role === "ADMIN" ||
    role === "SUPER_ADMIN" ||
    perms.has("global.admin") ||
    perms.has("country.admin")
  );
}

function parseStatusFilter(raw: string | undefined): AdoptionPetStatus[] | undefined {
  if (!raw) return undefined;
  const items = raw
    .split(",")
    .map((entry) => String(entry || "").trim().toUpperCase())
    .filter(Boolean) as AdoptionPetStatus[];
  return items.length ? items : undefined;
}

function buildLocationFilters(input: any) {
  const stateId = toInt(input.stateId);
  const cityId = toInt(input.cityId);
  const subDistrictId = toInt(input.subDistrictId);
  const divisionId = toInt(input.divisionId ?? input.bdDivisionId);
  const districtId = toInt(input.districtId ?? input.bdDistrictId);
  const upazilaId = toInt(input.upazilaId ?? input.bdUpazilaId);
  const areaId = toInt(input.areaId ?? input.bdAreaId);

  return {
    ...(stateId ? { stateId } : {}),
    ...(cityId ? { cityId } : {}),
    ...(subDistrictId ? { subDistrictId } : {}),
    ...(divisionId ? { bdDivisionId: divisionId } : {}),
    ...(districtId ? { bdDistrictId: districtId } : {}),
    ...(upazilaId ? { bdUpazilaId: upazilaId } : {}),
    ...(areaId ? { bdAreaId: areaId } : {}),
  };
}

function buildListWhere(filters: any, mode: "public" | "owner", ownerId?: number) {
  const search = String(filters.search || "").trim();
  const species = filters.species ? String(filters.species).trim().toUpperCase() : null;
  const countryId = toInt(filters.countryId);

  const where: any = {
    deletedAt: null,
    ...(mode === "public" ? { status: "PUBLISHED" } : {}),
    ...(mode === "owner" && ownerId ? { ownerId } : {}),
    ...(species ? { species: species as any } : {}),
    ...(countryId ? { countryId } : {}),
    ...buildLocationFilters(filters),
  };

  if (mode === "owner") {
    const statuses = parseStatusFilter(filters.status);
    if (statuses?.length) {
      where.status = { in: statuses };
    }
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { breed: { contains: search, mode: "insensitive" } },
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { story: { contains: search, mode: "insensitive" } },
    ];
  }

  return where;
}

function listingInclude(viewerId?: number | null) {
  return {
    media: {
      orderBy: { order: "asc" as const },
      include: {
        media: {
          select: {
            id: true,
            url: true,
            type: true,
            thumbnailUrl: true,
          },
        },
      },
    },
    owner: {
      select: {
        id: true,
        profile: {
          select: {
            displayName: true,
            username: true,
            avatarMedia: {
              select: { url: true },
            },
          },
        },
      },
    },
    shelterProfile: {
      select: {
        id: true,
        displayName: true,
        verificationStatus: true,
        websiteUrl: true,
      },
    },
    criteria: true,
    favorites: viewerId
      ? {
          where: { userId: viewerId },
          select: { id: true },
        }
      : false,
    _count: {
      select: {
        applications: true,
        favorites: true,
      },
    },
    country: {
      select: {
        id: true,
        code: true,
        name: true,
      },
    },
  };
}

function toPagination(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

function redactApplications(listing: any) {
  if (!listing) return listing;
  const clone = { ...listing };
  delete clone.applications;
  return clone;
}

function canViewNonPublicListing(user: any, listing: { ownerId: number }) {
  if (!user?.id) return false;
  return Number(user.id) === Number(listing.ownerId) || isAdminLike(user);
}

async function ensureMediaOwnership(userId: number, mediaIds: number[]) {
  if (!mediaIds.length) return;
  const count = await prisma.media.count({
    where: {
      id: { in: mediaIds },
      ownerUserId: userId,
      deletedAt: null,
    },
  });

  if (count !== mediaIds.length) {
    throw createHttpError(400, "One or more media items are invalid for this user");
  }
}

async function ensureShelterOwnership(userId: number, shelterProfileId?: number | null) {
  if (!shelterProfileId) return;
  const profile = await prisma.shelterProfile.findFirst({
    where: {
      id: shelterProfileId,
      ownerUserId: userId,
      deletedAt: null,
    },
    select: { id: true },
  });
  if (!profile) {
    throw createHttpError(400, "Shelter profile not found for this user");
  }
}

function normalizePetStatus(submitNow?: boolean): AdoptionPetStatus {
  return submitNow ? "PUBLISHED" : "DRAFT";
}

function hasOwn(body: any, key: string) {
  return Object.prototype.hasOwnProperty.call(body || {}, key);
}

function buildPetData(body: any, partial = false) {
  const data: any = {};

  if (!partial || hasOwn(body, "shelterProfileId")) data.shelterProfileId = toInt(body.shelterProfileId) ?? undefined;
  if (!partial || hasOwn(body, "countryId")) data.countryId = Number(body.countryId);
  if (!partial || hasOwn(body, "stateId")) data.stateId = toInt(body.stateId) ?? undefined;
  if (!partial || hasOwn(body, "cityId")) data.cityId = toInt(body.cityId) ?? undefined;
  if (!partial || hasOwn(body, "subDistrictId")) data.subDistrictId = toInt(body.subDistrictId) ?? undefined;
  if (!partial || hasOwn(body, "bdDivisionId")) data.bdDivisionId = toInt(body.bdDivisionId) ?? undefined;
  if (!partial || hasOwn(body, "bdDistrictId")) data.bdDistrictId = toInt(body.bdDistrictId) ?? undefined;
  if (!partial || hasOwn(body, "bdUpazilaId")) data.bdUpazilaId = toInt(body.bdUpazilaId) ?? undefined;
  if (!partial || hasOwn(body, "bdAreaId")) data.bdAreaId = toInt(body.bdAreaId) ?? undefined;
  if (!partial || hasOwn(body, "ownerType")) data.ownerType = body.ownerType;
  if (!partial || hasOwn(body, "species")) data.species = body.species;
  if (!partial || hasOwn(body, "name")) data.name = body.name;
  if (!partial || hasOwn(body, "breed")) data.breed = body.breed ?? undefined;
  if (!partial || hasOwn(body, "ageText")) data.ageText = body.ageText ?? undefined;
  if (!partial || hasOwn(body, "gender")) data.gender = body.gender ?? "UNKNOWN";
  if (!partial || hasOwn(body, "sizeText")) data.sizeText = body.sizeText ?? undefined;
  if (!partial || hasOwn(body, "colorText")) data.colorText = body.colorText ?? undefined;
  if (!partial || hasOwn(body, "title")) data.title = body.title ?? undefined;
  if (!partial || hasOwn(body, "description")) data.description = body.description ?? undefined;
  if (!partial || hasOwn(body, "story")) data.story = body.story ?? undefined;
  if (!partial || hasOwn(body, "healthInfo")) data.healthInfo = body.healthInfo ?? undefined;
  if (!partial || hasOwn(body, "personalityTagsJson")) data.personalityTagsJson = body.personalityTagsJson ?? undefined;
  if (!partial || hasOwn(body, "compatibilityTagsJson")) data.compatibilityTagsJson = body.compatibilityTagsJson ?? undefined;
  if (!partial || hasOwn(body, "adopterConditionsJson")) data.adopterConditionsJson = body.adopterConditionsJson ?? undefined;
  if (!partial || hasOwn(body, "serviceAreaType")) data.serviceAreaType = body.serviceAreaType ?? "SAME_CITY";
  if (!partial || hasOwn(body, "serviceAreaNotes")) data.serviceAreaNotes = body.serviceAreaNotes ?? undefined;
  if (!partial || hasOwn(body, "customServiceAreasJson")) data.customServiceAreasJson = body.customServiceAreasJson ?? undefined;
  if (!partial || hasOwn(body, "serviceRadiusKm")) data.serviceRadiusKm = toInt(body.serviceRadiusKm) ?? undefined;
  if (!partial || hasOwn(body, "allowInternationalAdoption")) {
    data.allowInternationalAdoption = hasOwn(body, "allowInternationalAdoption")
      ? Boolean(body.allowInternationalAdoption)
      : false;
  }
  if (!partial || hasOwn(body, "vaccinated")) data.vaccinated = typeof body.vaccinated === "boolean" ? body.vaccinated : undefined;
  if (!partial || hasOwn(body, "dewormed")) data.dewormed = typeof body.dewormed === "boolean" ? body.dewormed : undefined;
  if (!partial || hasOwn(body, "neutered")) data.neutered = typeof body.neutered === "boolean" ? body.neutered : undefined;
  if (!partial || hasOwn(body, "microchipped")) data.microchipped = typeof body.microchipped === "boolean" ? body.microchipped : undefined;
  if (!partial || hasOwn(body, "specialNeeds")) {
    data.specialNeeds = hasOwn(body, "specialNeeds") ? Boolean(body.specialNeeds) : false;
  }
  if (!partial || hasOwn(body, "adoptionFeeText")) data.adoptionFeeText = body.adoptionFeeText ?? undefined;
  if (!partial || hasOwn(body, "contactPhoneVisible")) {
    data.contactPhoneVisible = hasOwn(body, "contactPhoneVisible") ? Boolean(body.contactPhoneVisible) : false;
  }
  if (!partial || hasOwn(body, "expiresAt")) data.expiresAt = body.expiresAt ? new Date(body.expiresAt) : undefined;

  return data;
}

export async function listPublicAdoptions(params: any) {
  const page = Math.max(Number(params.page) || 1, 1);
  const limit = Math.min(Math.max(Number(params.limit) || 20, 1), 100);
  const where = buildListWhere(params, "public");
  const [items, total] = await Promise.all([
    prisma.adoptionPet.findMany({
      where,
      include: listingInclude(params.viewerId ?? null),
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.adoptionPet.count({ where }),
  ]);

  return {
    items,
    meta: toPagination(page, limit, total),
  };
}

export async function getAdoptionById(params: { id: number; user?: any }) {
  const listing = await prisma.adoptionPet.findUnique({
    where: { id: params.id },
    include: {
      ...listingInclude(params.user?.id ?? null),
      applications: params.user?.id
        ? {
            where: { applicantId: Number(params.user.id) },
            select: {
              id: true,
              status: true,
              submittedAt: true,
            },
          }
        : false,
      statusHistory: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!listing || listing.deletedAt) {
    throw createHttpError(404, "Adoption listing not found");
  }

  if (listing.status !== "PUBLISHED" && !canViewNonPublicListing(params.user, listing)) {
    throw createHttpError(404, "Adoption listing not found");
  }

  return listing;
}

export async function createAdoptionListing(params: { userId: number; body: any }) {
  const mediaIds = Array.isArray(params.body.mediaIds) ? params.body.mediaIds.map((id: unknown) => Number(id)).filter(Number.isFinite) : [];
  await ensureMediaOwnership(params.userId, mediaIds);
  await ensureShelterOwnership(params.userId, toInt(params.body.shelterProfileId));

  const status = normalizePetStatus(Boolean(params.body.submitNow));
  const petData = buildPetData(params.body, false);

  const created = await prisma.$transaction(async (tx: any) => {
    const pet = await tx.adoptionPet.create({
      data: {
        ownerId: params.userId,
        status,
        publishedAt: status === "PUBLISHED" ? new Date() : undefined,
        submittedForReviewAt: status === "PENDING_REVIEW" ? new Date() : undefined,
        ...petData,
      },
    });

    if (params.body.criteria) {
      await tx.adoptionCriteria.create({
        data: {
          petId: pet.id,
          ...params.body.criteria,
        },
      });
    }

    if (mediaIds.length) {
      await tx.adoptionPetMedia.createMany({
        data: mediaIds.map((mediaId: number, index: number) => ({
          petId: pet.id,
          mediaId,
          order: index,
          isCover: index === 0,
        })),
      });
    }

    await tx.adoptionStatusHistory.create({
      data: {
        petId: pet.id,
        toStatus: status,
        actorUserId: params.userId,
        note: status === "PUBLISHED" ? "Listing published" : "Listing created as draft",
      },
    });

    return tx.adoptionPet.findUnique({
      where: { id: pet.id },
      include: listingInclude(params.userId),
    });
  });

  return created;
}

export async function updateAdoptionListing(params: { id: number; user: any; body: any }) {
  const listing = await prisma.adoptionPet.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      ownerId: true,
      status: true,
    },
  });

  if (!listing) {
    throw createHttpError(404, "Adoption listing not found");
  }

  const admin = isAdminLike(params.user);
  if (!admin && Number(listing.ownerId) !== Number(params.user.id)) {
    throw createHttpError(403, "You cannot edit this adoption listing");
  }

  if (!admin && !["DRAFT", "NEEDS_CHANGES"].includes(String(listing.status))) {
    throw createHttpError(409, "Only draft or needs changes listings can be edited");
  }

  const mediaIds = Array.isArray(params.body.mediaIds)
    ? params.body.mediaIds.map((id: unknown) => Number(id)).filter(Number.isFinite)
    : null;
  if (mediaIds) {
    await ensureMediaOwnership(Number(params.user.id), mediaIds);
  }
  await ensureShelterOwnership(Number(params.user.id), toInt(params.body.shelterProfileId));

  const updateData = buildPetData(params.body, true);
  const nextStatus =
    params.body.submitNow && ["DRAFT", "NEEDS_CHANGES"].includes(String(listing.status))
      ? "PUBLISHED"
      : undefined;

  const updated = await prisma.$transaction(async (tx: any) => {
    await tx.adoptionPet.update({
      where: { id: params.id },
      data: {
        ...updateData,
        ...(nextStatus
          ? {
              status: nextStatus,
              publishedAt: new Date(),
            }
          : {}),
      },
    });

    if (params.body.criteria !== undefined) {
      await tx.adoptionCriteria.upsert({
        where: { petId: params.id },
        update: { ...params.body.criteria },
        create: {
          petId: params.id,
          ...params.body.criteria,
        },
      });
    }

    if (mediaIds) {
      await tx.adoptionPetMedia.deleteMany({ where: { petId: params.id } });
      if (mediaIds.length) {
        await tx.adoptionPetMedia.createMany({
          data: mediaIds.map((mediaId: number, index: number) => ({
            petId: params.id,
            mediaId,
            order: index,
            isCover: index === 0,
          })),
        });
      }
    }

    if (nextStatus) {
      await tx.adoptionStatusHistory.create({
        data: {
          petId: params.id,
          fromStatus: listing.status,
          toStatus: nextStatus,
          actorUserId: Number(params.user.id),
          note: "Listing published",
        },
      });
    }

    return tx.adoptionPet.findUnique({
      where: { id: params.id },
      include: listingInclude(Number(params.user.id)),
    });
  });

  return updated;
}

export async function submitAdoptionForReview(params: { id: number; user: any }) {
  const listing = await prisma.adoptionPet.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      ownerId: true,
      status: true,
    },
  });

  if (!listing) {
    throw createHttpError(404, "Adoption listing not found");
  }

  const admin = isAdminLike(params.user);
  if (!admin && Number(listing.ownerId) !== Number(params.user.id)) {
    throw createHttpError(403, "You cannot submit this adoption listing");
  }

  if (!["DRAFT", "NEEDS_CHANGES"].includes(String(listing.status))) {
    throw createHttpError(409, "Only draft or needs changes listings can be published");
  }

  await prisma.$transaction([
    prisma.adoptionPet.update({
      where: { id: params.id },
      data: {
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    }),
    prisma.adoptionStatusHistory.create({
      data: {
        petId: params.id,
        fromStatus: listing.status,
        toStatus: "PUBLISHED",
        actorUserId: Number(params.user.id),
        note: "Listing published",
      },
    }),
  ]);

  return prisma.adoptionPet.findUnique({
    where: { id: params.id },
    include: listingInclude(Number(params.user.id)),
  });
}

export async function applyToAdoption(params: { id: number; userId: number; body: any }) {
  const listing = await prisma.adoptionPet.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      ownerId: true,
      name: true,
      status: true,
    },
  });

  if (!listing || listing.status !== "PUBLISHED") {
    throw createHttpError(404, "Adoption listing not found");
  }

  if (Number(listing.ownerId) === Number(params.userId)) {
    throw createHttpError(400, "You cannot apply to your own listing");
  }

  const existing = await prisma.adoptionApplication.findFirst({
    where: {
      petId: params.id,
      applicantId: params.userId,
      deletedAt: null,
    },
    select: { id: true },
  });

  if (existing) {
    throw createHttpError(409, "You already applied to this adoption listing");
  }

  const created = await prisma.adoptionApplication.create({
    data: {
      petId: params.id,
      applicantId: params.userId,
      ownerId: listing.ownerId,
      status: "SUBMITTED",
      messageToOwner: params.body.messageToOwner ?? undefined,
      applicantPhone: params.body.applicantPhone ?? undefined,
      applicantEmail: params.body.applicantEmail ?? undefined,
      applicantAddress: params.body.applicantAddress ?? undefined,
      applicantCountryId: toInt(params.body.applicantCountryId) ?? undefined,
      applicantStateId: toInt(params.body.applicantStateId) ?? undefined,
      applicantCityId: toInt(params.body.applicantCityId) ?? undefined,
      applicantSubDistrictId: toInt(params.body.applicantSubDistrictId) ?? undefined,
      applicantBdDivisionId: toInt(params.body.applicantBdDivisionId) ?? undefined,
      applicantBdDistrictId: toInt(params.body.applicantBdDistrictId) ?? undefined,
      applicantBdUpazilaId: toInt(params.body.applicantBdUpazilaId) ?? undefined,
      applicantBdAreaId: toInt(params.body.applicantBdAreaId) ?? undefined,
      applicantOccupation: params.body.applicantOccupation ?? undefined,
      applicantHouseholdSummary: params.body.applicantHouseholdSummary ?? undefined,
      applicantExperienceSummary: params.body.applicantExperienceSummary ?? undefined,
      applicantOtherPetsSummary: params.body.applicantOtherPetsSummary ?? undefined,
      applicantIncomeRange: params.body.applicantIncomeRange ?? undefined,
      consentToHomeCheck: Boolean(params.body.consentToHomeCheck),
      consentToFollowUp: Boolean(params.body.consentToFollowUp),
      submittedAt: new Date(),
      answers: Array.isArray(params.body.answers)
        ? {
            create: params.body.answers.map((answer: any) => ({
              questionKey: answer.questionKey,
              questionLabel: answer.questionLabel ?? undefined,
              answerText: answer.answerText ?? undefined,
              answerJson: answer.answerJson ?? undefined,
            })),
          }
        : undefined,
    },
    include: {
      answers: true,
      pet: {
        select: {
          id: true,
          name: true,
          status: true,
        },
      },
    },
  });

  try {
    await createNotification({
      userId: Number(listing.ownerId),
      type: "SYSTEM",
      title: "New adoption application",
      message: `${listing.name} received a new adoption application.`,
      source: "adoptions",
      meta: {
        adoptionPetId: params.id,
        adoptionApplicationId: created.id,
      },
    });
  } catch (_error) {
    // Notification failure should not break the application flow.
  }

  return created;
}

export async function listMyAdoptions(params: { userId: number; query: any }) {
  const page = Math.max(Number(params.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(params.query.limit) || 20, 1), 100);
  const where = buildListWhere(params.query, "owner", params.userId);

  const [items, total] = await Promise.all([
    prisma.adoptionPet.findMany({
      where,
      include: listingInclude(params.userId),
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.adoptionPet.count({ where }),
  ]);

  return {
    items,
    meta: toPagination(page, limit, total),
  };
}

export async function listMyAdoptionApplications(params: { userId: number; query: any }) {
  const page = Math.max(Number(params.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(params.query.limit) || 20, 1), 100);
  const where: any = {
    applicantId: params.userId,
    deletedAt: null,
  };

  const [items, total] = await Promise.all([
    prisma.adoptionApplication.findMany({
      where,
      include: {
        pet: {
          include: {
            media: {
              orderBy: { order: "asc" },
              take: 1,
              include: {
                media: {
                  select: {
                    id: true,
                    url: true,
                    thumbnailUrl: true,
                    type: true,
                  },
                },
              },
            },
            owner: {
              select: {
                id: true,
                profile: {
                  select: {
                    displayName: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
        answers: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.adoptionApplication.count({ where }),
  ]);

  return {
    items,
    meta: toPagination(page, limit, total),
  };
}


async function changeListingStatus(params: {
  id: number;
  user: any;
  req?: any;
  toStatus: string;
  allowedFrom?: string[];
  note?: string;
  action: string;
  setPublishedAt?: boolean;
  setReviewedAt?: boolean;
}) {
  const listing = await prisma.adoptionPet.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      status: true,
      deletedAt: true,
    },
  });

  if (!listing || listing.deletedAt) {
    throw createHttpError(404, "Adoption listing not found");
  }

  if (params.allowedFrom?.length && !params.allowedFrom.includes(String(listing.status))) {
    throw createHttpError(409, `Cannot move listing from ${listing.status} to ${params.toStatus}`);
  }

  const data: any = {
    status: params.toStatus,
    adminReviewNote: params.note ?? undefined,
  };
  if (params.setReviewedAt) data.reviewedAt = new Date();
  if (params.setPublishedAt) data.publishedAt = new Date();

  if (params.toStatus === "PAUSED" || params.toStatus === "REMOVED" || params.toStatus === "REJECTED" || params.toStatus === "NEEDS_CHANGES") {
    data.reviewedAt = data.reviewedAt ?? new Date();
  }

  await prisma.$transaction(async (tx: any) => {
    await tx.adoptionPet.update({
      where: { id: params.id },
      data,
    });
    await tx.adoptionStatusHistory.create({
      data: {
        petId: params.id,
        fromStatus: listing.status,
        toStatus: params.toStatus,
        actorUserId: Number(params.user.id),
        note: params.note ?? undefined,
      },
    });
  });

  const updated = await prisma.adoptionPet.findUnique({
    where: { id: params.id },
    include: listingInclude(Number(params.user.id)),
  });

  await writeAudit({
    prisma,
    req: params.req || { headers: {}, user: params.user },
    action: params.action,
    entityType: "ADOPTION_PET",
    entityId: params.id,
    before: { status: listing.status },
    after: { status: params.toStatus, note: params.note ?? null },
  });

  return updated;
}

export async function adminListAdoptions(params: { query: any; user: any }) {
  const page = Math.max(Number(params.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(params.query.limit) || 20, 1), 100);
  const search = String(params.query.search || "").trim();
  const status = parseStatusFilter(params.query.status);
  const species = params.query.species ? String(params.query.species).trim().toUpperCase() : null;
  const countryId = toInt(params.query.countryId);
  const ownerId = toInt(params.query.ownerId);
  const reportedOnly = Boolean(params.query.reportedOnly);

  const where: any = {
    deletedAt: null,
    ...(status?.length ? { status: { in: status } } : {}),
    ...(species ? { species } : {}),
    ...(countryId ? { countryId } : {}),
    ...(ownerId ? { ownerId } : {}),
  };

  if (reportedOnly) {
    where.reports = { some: {} };
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { breed: { contains: search, mode: "insensitive" } },
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { owner: { profile: { displayName: { contains: search, mode: "insensitive" } } } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.adoptionPet.findMany({
      where,
      include: {
        ...listingInclude(Number(params.user.id)),
        _count: {
          select: {
            applications: true,
            favorites: true,
            reports: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.adoptionPet.count({ where }),
  ]);

  return { items, meta: toPagination(page, limit, total) };
}

export async function adminGetAdoptionById(params: { id: number; user: any }) {
  const listing = await prisma.adoptionPet.findUnique({
    where: { id: params.id },
    include: {
      ...listingInclude(Number(params.user.id)),
      reports: {
        orderBy: { createdAt: "desc" },
        include: {
          reporter: {
            select: {
              id: true,
              profile: {
                select: {
                  displayName: true,
                  username: true,
                },
              },
            },
          },
        },
      },
      statusHistory: {
        orderBy: { createdAt: "desc" },
        take: 30,
      },
      _count: {
        select: {
          applications: true,
          favorites: true,
          reports: true,
        },
      },
    },
  });

  if (!listing || listing.deletedAt) {
    throw createHttpError(404, "Adoption listing not found");
  }

  return redactApplications(listing);
}

export async function adminListPendingAdoptions(params: { query: any; user: any }) {
  return adminListAdoptions({
    query: { ...params.query, status: "PENDING_REVIEW" },
    user: params.user,
  });
}

export async function adminListAdoptionReports(params: { query: any }) {
  const page = Math.max(Number(params.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(params.query.limit) || 20, 1), 100);
  const search = String(params.query.search || "").trim();
  const where: any = {};

  if (search) {
    where.OR = [
      { reasonCode: { contains: search, mode: "insensitive" } },
      { details: { contains: search, mode: "insensitive" } },
      { pet: { name: { contains: search, mode: "insensitive" } } },
      { reporter: { profile: { displayName: { contains: search, mode: "insensitive" } } } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.adoptionReport.findMany({
      where,
      include: {
        pet: {
          select: {
            id: true,
            name: true,
            species: true,
            status: true,
            ownerId: true,
          },
        },
        reporter: {
          select: {
            id: true,
            profile: {
              select: {
                displayName: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.adoptionReport.count({ where }),
  ]);

  return { items, meta: toPagination(page, limit, total) };
}

export async function adminApproveAdoption(params: { id: number; user: any; note?: string }) {
  return changeListingStatus({
    id: params.id,
    user: params.user,
    req: (params as any).req,
    toStatus: "PUBLISHED",
    allowedFrom: ["PENDING_REVIEW", "APPROVED"],
    note: params.note,
    action: "ADOPTION_PET_APPROVE",
    setReviewedAt: true,
    setPublishedAt: true,
  });
}

export async function adminRejectAdoption(params: { id: number; user: any; note?: string }) {
  return changeListingStatus({
    id: params.id,
    user: params.user,
    req: (params as any).req,
    toStatus: "REJECTED",
    allowedFrom: ["PENDING_REVIEW", "NEEDS_CHANGES"],
    note: params.note,
    action: "ADOPTION_PET_REJECT",
    setReviewedAt: true,
  });
}

export async function adminRequestAdoptionChanges(params: { id: number; user: any; note?: string }) {
  return changeListingStatus({
    id: params.id,
    user: params.user,
    req: (params as any).req,
    toStatus: "NEEDS_CHANGES",
    allowedFrom: ["PENDING_REVIEW"],
    note: params.note,
    action: "ADOPTION_PET_REQUEST_CHANGES",
    setReviewedAt: true,
  });
}

export async function adminPauseAdoption(params: { id: number; user: any; note?: string }) {
  return changeListingStatus({
    id: params.id,
    user: params.user,
    req: (params as any).req,
    toStatus: "PAUSED",
    allowedFrom: ["PUBLISHED"],
    note: params.note,
    action: "ADOPTION_PET_PAUSE",
  });
}

export async function adminRemoveAdoption(params: { id: number; user: any; note?: string }) {
  return changeListingStatus({
    id: params.id,
    user: params.user,
    req: (params as any).req,
    toStatus: "REMOVED",
    note: params.note,
    action: "ADOPTION_PET_REMOVE",
  });
}

export async function adminListCountryRules(params: { query: any }) {
  const countryId = toInt(params.query.countryId);
  const rows = await prisma.countryAdoptionRule.findMany({
    where: countryId ? { countryId } : {},
    include: {
      country: {
        select: {
          id: true,
          code: true,
          name: true,
        },
      },
    },
    orderBy: [{ isActive: "desc" }, { updatedAt: "desc" }],
  });
  return rows;
}

export async function adminCreateCountryRule(params: { body: any; req: any }) {
  const row = await prisma.countryAdoptionRule.create({
    data: {
      countryId: Number(params.body.countryId),
      title: params.body.title,
      summary: params.body.summary ?? undefined,
      policyUrl: params.body.policyUrl ?? undefined,
      minAdopterAgeYears: params.body.minAdopterAgeYears ?? undefined,
      allowInternationalAdoption: Boolean(params.body.allowInternationalAdoption),
      metadataJson: params.body.metadataJson ?? undefined,
      isActive: params.body.isActive !== undefined ? Boolean(params.body.isActive) : true,
    },
    include: {
      country: {
        select: { id: true, code: true, name: true },
      },
    },
  });

  await writeAudit({
    prisma,
    req: params.req,
    action: "COUNTRY_ADOPTION_RULE_CREATE",
    entityType: "COUNTRY_ADOPTION_RULE",
    entityId: row.id,
    before: null,
    after: row,
  });

  return row;
}

export async function adminUpdateCountryRule(params: { id: number; body: any; req: any }) {
  const data: any = {};
  if (params.body.countryId !== undefined) data.countryId = Number(params.body.countryId);
  if (params.body.title !== undefined) data.title = params.body.title;
  if (params.body.summary !== undefined) data.summary = params.body.summary ?? null;
  if (params.body.policyUrl !== undefined) data.policyUrl = params.body.policyUrl ?? null;
  if (params.body.minAdopterAgeYears !== undefined) data.minAdopterAgeYears = params.body.minAdopterAgeYears ?? null;
  if (params.body.allowInternationalAdoption !== undefined) data.allowInternationalAdoption = Boolean(params.body.allowInternationalAdoption);
  if (params.body.metadataJson !== undefined) data.metadataJson = params.body.metadataJson ?? null;
  if (params.body.isActive !== undefined) data.isActive = Boolean(params.body.isActive);

  const row = await prisma.countryAdoptionRule.update({
    where: { id: params.id },
    data,
    include: {
      country: {
        select: { id: true, code: true, name: true },
      },
    },
  });

  await writeAudit({
    prisma,
    req: params.req,
    action: "COUNTRY_ADOPTION_RULE_UPDATE",
    entityType: "COUNTRY_ADOPTION_RULE",
    entityId: row.id,
    before: null,
    after: row,
  });

  return row;
}

module.exports = {
  listPublicAdoptions,
  getAdoptionById,
  createAdoptionListing,
  updateAdoptionListing,
  submitAdoptionForReview,
  applyToAdoption,
  listMyAdoptions,
  listMyAdoptionApplications,
  adminListAdoptions,
  adminGetAdoptionById,
  adminListPendingAdoptions,
  adminListAdoptionReports,
  adminApproveAdoption,
  adminRejectAdoption,
  adminRequestAdoptionChanges,
  adminPauseAdoption,
  adminRemoveAdoption,
  adminListCountryRules,
  adminCreateCountryRule,
  adminUpdateCountryRule,
};
