import { prisma } from "../../../../lib/prisma";
import { PetProfileVisibility } from "@prisma/client";
import { createSocialNotification } from "../../services/socialNotification.service";

// ---------- helpers ----------
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name) || "pet";
  let slug = base;
  let attempt = 0;
  while (true) {
    const existing = await prisma.pet.findFirst({ where: { slug }, select: { id: true } });
    if (!existing) return slug;
    attempt++;
    slug = `${base}-${attempt}`;
  }
}

function toNullableInt(v: any): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function toNullableString(v: any): string | null {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s.length === 0 ? null : s;
}
function toBool(v: any, fallback = false): boolean {
  if (v === true || v === "true" || v === 1 || v === "1") return true;
  if (v === false || v === "false" || v === 0 || v === "0") return false;
  return fallback;
}

function canViewPet(pet: any, userId: number | null): boolean {
  if (pet.deleted) return false;
  if (userId && pet.userId === userId) return true; // owner always
  if (!pet.isPublicProfileEnabled) return false;
  if (pet.visibility === PetProfileVisibility.PUBLIC) return true;
  if (pet.visibility === PetProfileVisibility.FOLLOWERS_ONLY && userId) {
    return (pet.petFollows ?? []).some((f: any) => f.userId === userId);
  }
  return false;
}

const PUBLIC_PET_SELECT = {
  id: true,
  name: true,
  slug: true,
  bio: true,
  isPublicProfileEnabled: true,
  visibility: true,
  followersCount: true,
  likesCount: true,
  animalTypeNameSnapshot: true,
  breedNameSnapshot: true,
  colorNameSnapshot: true,
  sizeNameSnapshot: true,
  sex: true,
  dateOfBirth: true,
  isRescue: true,
  isNeutered: true,
  userId: true,
  status: true,
  deleted: true,
  profilePic: { select: { url: true, id: true } },
  coverMedia: { select: { url: true, id: true } },
  user: { select: { id: true, profile: { select: { displayName: true, avatarMedia: { select: { url: true } } } } } },
  petFollows: { select: { userId: true } },
} as const;

// --------------------------------------------------
// GET /api/v1/pets/my — current user's pets
// --------------------------------------------------
exports.getMyPets = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const pets = await prisma.pet.findMany({
      where: { userId: Number(userId), deleted: false },
      orderBy: { id: "desc" },
      include: {
        animalType: true,
        breed: true,
        profilePic: true,
        coverMedia: true,
        weights: { orderBy: { recordedAt: "desc" }, take: 1 },
        _count: { select: { petFollows: true, petLikes: true, posts: true } },
      },
    });

    return res.status(200).json({ success: true, data: pets });
  } catch (e: any) {
    console.error("getMyPets error:", e);
    return res.status(500).json({ success: false, message: e.message || "Server error" });
  }
};

// --------------------------------------------------
// GET /api/v1/pets/slug/:slug — public profile by slug
// --------------------------------------------------
exports.getPetBySlug = async (req: any, res: any) => {
  try {
    const userId = req.user?.id ?? null;
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ success: false, message: "Slug required" });

    const pet = await prisma.pet.findFirst({
      where: { slug: String(slug).toLowerCase(), deleted: false },
      select: { ...PUBLIC_PET_SELECT },
    });

    if (!pet) return res.status(404).json({ success: false, message: "Pet not found" });
    if (!canViewPet(pet, userId)) {
      return res.status(200).json({
        success: true,
        data: {
          id: pet.id,
          name: pet.name,
          slug: pet.slug,
          profilePic: pet.profilePic,
          coverMedia: pet.coverMedia,
          isPublicProfileEnabled: pet.isPublicProfileEnabled,
          visibility: pet.visibility,
          followersCount: pet.followersCount,
          likesCount: pet.likesCount,
          canViewFullProfile: false,
          isFollowing: false,
          isLiked: false,
          isOwner: false,
          canManage: false,
        }
      });
    }

    const isFollowing = userId ? pet.petFollows.some((f: any) => f.userId === userId) : false;
    const isOwner = userId === pet.userId;

    return res.status(200).json({
      success: true,
      data: {
        ...pet,
        petFollows: undefined,
        isFollowing,
        isOwner,
        canManage: isOwner,
        canViewFullProfile: true,
      },
    });
  } catch (e: any) {
    console.error("getPetBySlug error:", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------------------------------
// GET /api/v1/pets/:petId — public profile by id
// --------------------------------------------------
exports.getPublicPet = async (req: any, res: any) => {
  try {
    const userId = req.user?.id ?? null;
    const petId = Number(req.params.petId);
    if (!petId) return res.status(400).json({ success: false, message: "Invalid pet id" });

    const pet = await prisma.pet.findFirst({
      where: { id: petId, deleted: false },
      select: { ...PUBLIC_PET_SELECT },
    });

    if (!pet) return res.status(404).json({ success: false, message: "Pet not found" });
    if (!canViewPet(pet, userId)) {
      return res.status(200).json({
        success: true,
        data: {
          id: pet.id,
          name: pet.name,
          slug: pet.slug,
          profilePic: pet.profilePic,
          coverMedia: pet.coverMedia,
          isPublicProfileEnabled: pet.isPublicProfileEnabled,
          visibility: pet.visibility,
          followersCount: pet.followersCount,
          likesCount: pet.likesCount,
          canViewFullProfile: false,
          isFollowing: false,
          isLiked: false,
          isOwner: false,
          canManage: false,
        }
      });
    }

    const isFollowing = userId ? pet.petFollows.some((f: any) => f.userId === userId) : false;
    const isOwner = userId === pet.userId;

    return res.status(200).json({
      success: true,
      data: {
        ...pet,
        petFollows: undefined,
        isFollowing,
        isOwner,
        canManage: isOwner,
        canViewFullProfile: true,
      },
    });
  } catch (e: any) {
    console.error("getPublicPet error:", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------------------------------
// PATCH /api/v1/pets/:petId/profile — update public profile fields
// --------------------------------------------------
exports.updatePetProfile = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    const petId = Number(req.params.petId);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!petId) return res.status(400).json({ success: false, message: "Invalid pet id" });

    const existing = await prisma.pet.findFirst({
      where: { id: petId, userId: Number(userId), deleted: false },
      select: { id: true, name: true, slug: true },
    });
    if (!existing) return res.status(404).json({ success: false, message: "Pet not found" });

    const { slug, bio, coverMediaId, isPublicProfileEnabled, visibility } = req.body || {};
    const data: any = {};

    if (bio !== undefined) data.bio = toNullableString(bio);
    if (coverMediaId !== undefined) {
      const cid = toNullableInt(coverMediaId);
      data.coverMedia = cid ? { connect: { id: cid } } : { disconnect: true };
    }
    if (isPublicProfileEnabled !== undefined) data.isPublicProfileEnabled = toBool(isPublicProfileEnabled);
    if (visibility !== undefined) {
      const allowed = ["PUBLIC", "FOLLOWERS_ONLY", "PRIVATE"] as const;
      if (!allowed.includes(visibility)) {
        return res.status(400).json({ success: false, message: "Invalid visibility" });
      }
      data.visibility = visibility;
    }

    if (slug !== undefined) {
      const rawSlug = slugify(toNullableString(slug) || "");
      if (!rawSlug) return res.status(400).json({ success: false, message: "Invalid slug" });
      const collision = await prisma.pet.findFirst({
        where: { slug: rawSlug, id: { not: petId } },
        select: { id: true },
      });
      if (collision) {
        return res.status(409).json({ success: false, message: "This username is already taken", field: "slug" });
      }
      data.slug = rawSlug;
    }

    const updated = await prisma.pet.update({
      where: { id: petId },
      data,
      include: { profilePic: true, coverMedia: true },
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (e: any) {
    console.error("updatePetProfile error:", e);
    return res.status(500).json({ success: false, message: e.message || "Server error" });
  }
};

// --------------------------------------------------
// POST /api/v1/pets/:petId/follow
// DELETE /api/v1/pets/:petId/follow
// --------------------------------------------------
exports.followPet = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    const petId = Number(req.params.petId);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!petId) return res.status(400).json({ success: false, message: "Invalid pet id" });

    const pet = await prisma.pet.findFirst({
      where: { id: petId, deleted: false, isPublicProfileEnabled: true },
      select: { id: true, userId: true, name: true },
    });
    if (!pet) return res.status(404).json({ success: false, message: "Pet not found or profile not public" });

    // Owner cannot follow own pet
    if (pet.userId === Number(userId)) {
      return res.status(400).json({ success: false, message: "You cannot follow your own pet" });
    }

    const existing = await prisma.petFollow.findFirst({ where: { petId, userId: Number(userId) } });
    if (existing) return res.status(409).json({ success: false, message: "Already following" });

    await prisma.$transaction([
      prisma.petFollow.create({ data: { petId, userId: Number(userId) } }),
      prisma.pet.update({ where: { id: petId }, data: { followersCount: { increment: 1 } } }),
    ]);
    createSocialNotification({
      recipientUserId: pet.userId,
      actorUserId: Number(userId),
      type: "PET_FOLLOWED",
      targetType: "PET",
      targetId: petId,
      route: `/pet/${petId}`,
      metadata: { petId, petName: pet.name },
    }).catch((err: any) => console.warn("[Notification] Failed to send pet follow notification:", err.message));

    return res.status(200).json({ success: true, message: "Followed" });
  } catch (e: any) {
    console.error("followPet error:", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.unfollowPet = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    const petId = Number(req.params.petId);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!petId) return res.status(400).json({ success: false, message: "Invalid pet id" });

    const existing = await prisma.petFollow.findFirst({ where: { petId, userId: Number(userId) } });
    if (!existing) return res.status(404).json({ success: false, message: "Not following" });

    await prisma.$transaction([
      prisma.petFollow.delete({ where: { id: existing.id } }),
      prisma.pet.update({
        where: { id: petId },
        data: { followersCount: { decrement: 1 } },
      }),
    ]);

    return res.status(200).json({ success: true, message: "Unfollowed" });
  } catch (e: any) {
    console.error("unfollowPet error:", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------------------------------
// POST /api/v1/pets/:petId/like
// DELETE /api/v1/pets/:petId/like
// --------------------------------------------------
exports.likePet = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    const petId = Number(req.params.petId);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!petId) return res.status(400).json({ success: false, message: "Invalid pet id" });

    const pet = await prisma.pet.findFirst({
      where: { id: petId, deleted: false, isPublicProfileEnabled: true },
      select: { id: true, userId: true, name: true },
    });
    if (!pet) return res.status(404).json({ success: false, message: "Pet not found or profile not public" });

    if (pet.userId === Number(userId)) {
      return res.status(400).json({ success: false, message: "You cannot like your own pet" });
    }

    const existing = await prisma.petLike.findFirst({ where: { petId, userId: Number(userId) } });
    if (existing) return res.status(409).json({ success: false, message: "Already liked" });

    await prisma.$transaction([
      prisma.petLike.create({ data: { petId, userId: Number(userId) } }),
      prisma.pet.update({ where: { id: petId }, data: { likesCount: { increment: 1 } } }),
    ]);
    createSocialNotification({
      recipientUserId: pet.userId,
      actorUserId: Number(userId),
      type: "PET_LIKED",
      targetType: "PET",
      targetId: petId,
      route: `/pet/${petId}`,
      metadata: { petId, petName: pet.name },
    }).catch((err: any) => console.warn("[Notification] Failed to send pet like notification:", err.message));

    return res.status(200).json({ success: true, message: "Liked" });
  } catch (e: any) {
    console.error("likePet error:", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.unlikePet = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    const petId = Number(req.params.petId);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!petId) return res.status(400).json({ success: false, message: "Invalid pet id" });

    const existing = await prisma.petLike.findFirst({ where: { petId, userId: Number(userId) } });
    if (!existing) return res.status(404).json({ success: false, message: "Not liked" });

    await prisma.$transaction([
      prisma.petLike.delete({ where: { id: existing.id } }),
      prisma.pet.update({
        where: { id: petId },
        data: { likesCount: { decrement: 1 } },
      }),
    ]);

    return res.status(200).json({ success: true, message: "Unliked" });
  } catch (e: any) {
    console.error("unlikePet error:", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------------------------------
// GET /api/v1/pets/:petId/social-status
// --------------------------------------------------
exports.getPetSocialStatus = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    const petId = Number(req.params.petId);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!petId) return res.status(400).json({ success: false, message: "Invalid pet id" });

    const pet = await prisma.pet.findFirst({
      where: { id: petId, deleted: false },
      select: { id: true, userId: true, name: true },
    });
    if (!pet) return res.status(404).json({ success: false, message: "Pet not found" });

    const [follow, like] = await Promise.all([
      prisma.petFollow.findFirst({ where: { petId, userId: Number(userId) }, select: { id: true } }),
      prisma.petLike.findFirst({ where: { petId, userId: Number(userId) }, select: { id: true } }),
    ]);

    const isOwner = pet.userId === Number(userId);
    return res.status(200).json({
      success: true,
      data: {
        isFollowing: !!follow,
        isLiked: !!like,
        canManage: isOwner,
        isOwner,
      },
    });
  } catch (e: any) {
    console.error("getPetSocialStatus error:", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------------------------------
// GET /api/v1/pets/:petId/posts — posts for a pet profile
// --------------------------------------------------
exports.getPetPosts = async (req: any, res: any) => {
  try {
    const userId = req.user?.id ?? null;
    const petId = Number(req.params.petId);
    if (!petId) return res.status(400).json({ success: false, message: "Invalid pet id" });

    const pet = await prisma.pet.findFirst({
      where: { id: petId, deleted: false },
      select: {
        id: true,
        userId: true,
        isPublicProfileEnabled: true,
        visibility: true,
        petFollows: userId ? { where: { userId: Number(userId) }, select: { userId: true } } : { take: 0, select: { userId: true } },
      },
    });
    if (!pet) return res.status(404).json({ success: false, message: "Pet not found" });
    if (!canViewPet(pet, userId)) {
      return res.status(403).json({ success: false, message: "This profile is private" });
    }

    const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
    const take = Math.min(Number(req.query.limit ?? 20), 50);

    const posts = await prisma.post.findMany({
      where: {
        petId,
        deletedAt: null,
      },
      orderBy: { createdAt: "desc" },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: {
        author: { select: { id: true, profile: { select: { displayName: true, avatarMedia: { select: { url: true } } } } } },
        media: { include: { media: true }, orderBy: { order: "asc" } },
        _count: { select: { likes: true, comments: true } },
        likes: userId ? { where: { userId: Number(userId) }, select: { id: true } } : { take: 0, select: { id: true } },
      },
    });

    const nextCursor = posts.length === take ? posts[posts.length - 1]?.id : null;
    return res.status(200).json({ success: true, data: posts, nextCursor });
  } catch (e: any) {
    console.error("getPetPosts error:", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------------------------------
// POST /api/v1/pets/:petId/posts — create post as pet (owner only)
// --------------------------------------------------
exports.createPetPost = async (req: any, res: any) => {
  try {
    const userId = req.user?.id;
    const petId = Number(req.params.petId);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!petId) return res.status(400).json({ success: false, message: "Invalid pet id" });

    const pet = await prisma.pet.findFirst({
      where: { id: petId, userId: Number(userId), deleted: false },
      select: { id: true },
    });
    if (!pet) return res.status(403).json({ success: false, message: "You do not own this pet" });

    const { caption, type = "TEXT", mediaIds } = req.body || {};
    const allowedTypes = ["TEXT", "IMAGE", "VIDEO", "REEL"];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid post type" });
    }
    if (!caption && (!mediaIds || !mediaIds.length)) {
      return res.status(400).json({ success: false, message: "Post must have caption or media" });
    }

    const post = await prisma.post.create({
      data: {
        authorId: Number(userId),
        petId,
        caption: caption ? String(caption).trim() : null,
        type,
        privacy: "PUBLIC",
        ...(Array.isArray(mediaIds) && mediaIds.length
          ? {
              media: {
                create: mediaIds.map((mid: number, order: number) => ({
                  mediaId: Number(mid),
                  order,
                })),
              },
            }
          : {}),
      },
      include: {
        media: { include: { media: true }, orderBy: { order: "asc" } },
        author: { select: { id: true, profile: { select: { displayName: true, avatarMedia: { select: { url: true } } } } } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    return res.status(201).json({ success: true, data: post });
  } catch (e: any) {
    console.error("createPetPost error:", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// --------------------------------------------------
// Slug auto-generate helper (exported for use in pets.controller.ts)
// --------------------------------------------------
exports.generateUniqueSlug = generateUniqueSlug;

export {};


