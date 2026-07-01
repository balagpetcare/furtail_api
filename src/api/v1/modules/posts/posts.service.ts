import type { Prisma, PostCategory, PostPrivacy } from "@prisma/client";
const prisma = require('../../../../infrastructure/db/prismaClient');
const { resolveClientMediaUrl } = require('../../../../shared/storage/publicMediaUrl');

const mediaSelect = {
  id: true,
  url: true,
  key: true,
  hlsUrl: true,
  hlsKey: true,
  type: true,
  status: true,
  processingError: true,
  thumbnailUrl: true,
  thumbnailKey: true,
  trimStartMs: true,
  trimEndMs: true,
  mute: true,
  volume: true,
  coverTimestampMs: true,
  aspectRatio: true,
  quality: true,
};
const avatarMediaSelect = { url: true, key: true };
const taggedPetMediaSelect = { id: true, url: true, key: true };
const taggedPetsInclude = {
  include: {
    pet: {
      select: {
        id: true,
        name: true,
        profilePic: { select: taggedPetMediaSelect },
      },
    },
  },
};
const composerPostTypes = ['GENERAL', 'HEALTH_UPDATE', 'VACCINATION', 'LOST_PET', 'ADOPTION', 'SERVICE_REVIEW'];

function rewriteAvatarMedia(avatarMedia) {
  if (!avatarMedia) return avatarMedia;
  return {
    ...avatarMedia,
    url: resolveClientMediaUrl({ url: avatarMedia.url, key: avatarMedia.key }),
  };
}

function rewriteProfile(profile) {
  if (!profile) return profile;
  return {
    ...profile,
    avatarMedia: rewriteAvatarMedia(profile.avatarMedia),
  };
}

function mapPostForClient(post) {
  const p = {
    ...post,
    isLikedByMe: Array.isArray(post.likes) && post.likes.length > 0,
    isBookmarkedByMe: Array.isArray(post.bookmarks) && post.bookmarks.length > 0,
    likes: undefined,
    bookmarks: undefined,
  };

  if (p.author?.profile) {
    p.author = { ...p.author, profile: rewriteProfile(p.author.profile) };
  }

  if (Array.isArray(p.media)) {
    p.media = p.media.map((pm) => {
      if (!pm?.media) return pm;
      const m = pm.media;
      return {
        ...pm,
        media: {
          ...m,
          url: resolveClientMediaUrl({ url: m.url, key: m.key }),
          hlsUrl: m.hlsUrl
            ? resolveClientMediaUrl({ url: m.hlsUrl, key: m.hlsKey ?? null })
            : m.hlsUrl,
          thumbnailUrl: m.thumbnailUrl
            ? resolveClientMediaUrl({ url: m.thumbnailUrl, key: m.thumbnailKey ?? null })
            : m.thumbnailUrl,
        },
      };
    });
  }

  if (Array.isArray(p.taggedPets)) {
    p.taggedPets = p.taggedPets
      .map((row) => {
        const pet = row?.pet;
        if (!pet) return null;
        const imageUrl = pet.profilePic
          ? resolveClientMediaUrl({ url: pet.profilePic.url, key: pet.profilePic.key })
          : null;
        return {
          id: pet.id,
          name: pet.name,
          imageUrl,
          avatarUrl: imageUrl,
        };
      })
      .filter(Boolean);
  }

  const fc = p.fundraisingCampaign;
  if (fc?.donations) {
    p.fundraisingCampaign = {
      ...fc,
      donations: fc.donations.map((d) => {
        if (!d?.donor?.profile) return d;
        return {
          ...d,
          donor: { ...d.donor, profile: rewriteProfile(d.donor.profile) },
        };
      }),
    };
  }

  return p;
}

function normalizePostType(type) {
  const t = String(type || '').toUpperCase();
  const allowed = ['TEXT', 'IMAGE', 'VIDEO', 'REEL'];
  return allowed.includes(t) ? t : 'TEXT';
}

function normalizeComposerPostType(postType) {
  if (postType === undefined || postType === null || String(postType).trim() === '') return 'GENERAL';
  const raw = String(postType).trim();
  const normalized = raw
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toUpperCase();
  const aliases = {
    HEALTH: 'HEALTH_UPDATE',
    LOSTPET: 'LOST_PET',
    LOST_PET_ALERT: 'LOST_PET',
    SERVICE: 'SERVICE_REVIEW',
    SERVICEREVIEW: 'SERVICE_REVIEW',
    HEALTHUPDATE: 'HEALTH_UPDATE',
  };
  const value = aliases[normalized] || normalized;
  if (!composerPostTypes.includes(value)) {
    const err = new Error(`Invalid postType. Allowed values: ${composerPostTypes.join(', ')}`);
    (err as any).statusCode = 400;
    throw err;
  }
  return value;
}

function toNullableString(value) {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  return s.length ? s : null;
}

function toBoolean(value, fallback = false) {
  if (value === true || value === 'true' || value === 1 || value === '1') return true;
  if (value === false || value === 'false' || value === 0 || value === '0') return false;
  return fallback;
}

function normalizeTaggedPetIds(taggedPetIds) {
  if (taggedPetIds === undefined || taggedPetIds === null) return [];
  const values = Array.isArray(taggedPetIds) ? taggedPetIds : String(taggedPetIds).split(',');
  return Array.from(new Set(values.map((x) => Number(x)).filter((x) => Number.isFinite(x) && x > 0)));
}

async function validateTaggedPets({ userId, taggedPetIds }) {
  const ids = normalizeTaggedPetIds(taggedPetIds);
  if (!ids.length) return [];

  const pets = await prisma.pet.findMany({
    where: { id: { in: ids }, userId: Number(userId), deleted: false },
    select: { id: true },
  });
  const found = new Set(pets.map((p) => p.id));
  const missing = ids.filter((id) => !found.has(id));
  if (missing.length) {
    const err = new Error(`Invalid taggedPetIds: ${missing.join(', ')}. You can only tag your own pets.`);
    (err as any).statusCode = 400;
    throw err;
  }
  return ids;
}

function normalizeComposerFields(input) {
  const postType = normalizeComposerPostType(input.postType);
  const data: any = {
    postType,
    backgroundStyle: toNullableString(input.backgroundStyle),
  };

  if (postType === 'LOST_PET') {
    data.lostPetName = toNullableString(input.lostPetName);
    data.lostPetLocation = toNullableString(input.lostPetLocation);
    data.lostPetContactVisible = toBoolean(input.lostPetContactVisible, false);
  } else {
    data.lostPetName = null;
    data.lostPetLocation = null;
    data.lostPetContactVisible = false;
  }

  return data;
}

function normalizeComposerUpdateFields(input) {
  const data: any = {};
  const nextType = input.postType !== undefined ? normalizeComposerPostType(input.postType) : input.currentPostType;
  if (input.postType !== undefined) data.postType = nextType;
  if (input.backgroundStyle !== undefined) data.backgroundStyle = toNullableString(input.backgroundStyle);

  if (nextType === 'LOST_PET') {
    if (input.lostPetName !== undefined) data.lostPetName = toNullableString(input.lostPetName);
    if (input.lostPetLocation !== undefined) data.lostPetLocation = toNullableString(input.lostPetLocation);
    if (input.lostPetContactVisible !== undefined) data.lostPetContactVisible = toBoolean(input.lostPetContactVisible, false);
  } else if (input.postType !== undefined) {
    data.lostPetName = null;
    data.lostPetLocation = null;
    data.lostPetContactVisible = false;
  }
  return data;
}

function normalizePostCategory(category) {
  const c = String(category || '').toUpperCase();
  const allowed = ['GENERAL', 'FUNDRAISING'];
  return allowed.includes(c) ? c : 'GENERAL';
}

function normalizePostPrivacy(privacy) {
  const p = String(privacy || '').toUpperCase();
  const allowed = ['PUBLIC', 'FOLLOWERS', 'PRIVATE'];
  return allowed.includes(p) ? p : 'PUBLIC';
}

function normalizeVideoCategory(category) {
  const c = String(category || '').trim().toUpperCase();
  const allowed = ['FOR YOU', 'FOLLOWING', 'HEALTH', 'TRAINING', 'RESCUE', 'FUNNY', 'SHOP'];
  return allowed.includes(c) ? c : 'FOR YOU';
}

function normalizeVideoSort(sort) {
  const s = String(sort || '').trim().toLowerCase();
  const allowed = ['latest', 'most_liked', 'most_commented'];
  return allowed.includes(s) ? s : 'latest';
}

function matchesVideoCategory(post, category) {
  if (category === 'FOR YOU') return true;
  const haystack = [
    post.caption,
    post.postType,
    post.feelingActivityLabel,
    post.feelingActivityType,
    post.author?.profile?.displayName,
    post.author?.profile?.username,
  ].filter(Boolean).join(' ').toLowerCase();

  switch (category) {
    case 'FOLLOWING':
      return true;
    case 'HEALTH':
      return haystack.includes('health') || haystack.includes('vet') || haystack.includes('medical') || haystack.includes('vaccin');
    case 'TRAINING':
      return haystack.includes('train');
    case 'RESCUE':
      return haystack.includes('rescue') || haystack.includes('lost') || haystack.includes('adopt') || haystack.includes('found');
    case 'FUNNY':
      return haystack.includes('funny') || haystack.includes('cute') || haystack.includes('lol') || haystack.includes('haha');
    case 'SHOP':
      return haystack.includes('shop') || haystack.includes('product') || haystack.includes('buy');
    default:
      return true;
  }
}

function matchesVideoSearch(post, search) {
  if (!search) return true;
  const q = String(search).trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    post.caption,
    post.postType,
    post.feelingActivityLabel,
    post.author?.profile?.displayName,
    post.author?.profile?.username,
  ].filter(Boolean).join(' ').toLowerCase();
  return haystack.includes(q);
}

function matchesVideoDuration(post, duration) {
  if (!duration) return true;
  // TODO: Backend duration metadata is not yet exposed on Post/PostMedia.
  // Keep this as a safe no-op until the API returns a usable duration field.
  return true;
}

async function getFeed({ userId, limit = 50, cursor }) {
  // Cursor pagination (optional)
  const take = Math.min(Number(limit) || 50, 100);

  const follows = await prisma.userFollow.findMany({
    where: { followerId: Number(userId) },
    select: { followingId: true },
  });
  const followedIds = follows.map(f => f.followingId);

  // Exclude FUNDRAISING_UPDATE posts from the normal feed.
  // These are campaign updates and must only appear inside the campaign details screen.
  const where = {
    deletedAt: null,
    category: { not: 'FUNDRAISING_UPDATE' as PostCategory },
    OR: [
      { privacy: 'PUBLIC' as PostPrivacy },
      { authorId: Number(userId) },
      { privacy: 'FOLLOWERS' as PostPrivacy, authorId: { in: followedIds } }
    ]
  };

  const args: Prisma.PostFindManyArgs = {
    where,
    orderBy: { createdAt: 'desc' },
    take,
    include: {
      author: {
        select: {
          id: true,
          profile: {
            select: {
              displayName: true,
              username: true,
              avatarMedia: { select: avatarMediaSelect },
            },
          },
        },
      },
      media: {
        orderBy: { order: 'asc' },
        include: { media: { select: mediaSelect } },
      },
      taggedPets: taggedPetsInclude,
      fundraisingCampaign: {
        select: {
          id: true,
          title: true,
          targetAmount: true,
          deadline: true,
          // category: true,
          locationText: true,
          account: { select: { status: true } },
          stats: { select: { raisedAmount: true, donorsCount: true } },
          donations: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            select: {
              amount: true,
              createdAt: true,
              donor: {
                select: {
                  id: true,
                  profile: {
                    select: {
                      displayName: true,
                      username: true,
                      avatarMedia: { select: avatarMediaSelect },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // Like button state for the current user (optional)
      likes: userId
        ? {
            where: { userId: Number(userId) },
            select: { id: true },
            take: 1,
          }
        : false,
      bookmarks: userId
        ? {
            where: { userId: Number(userId) },
            select: { id: true },
            take: 1,
          }
        : false,
      _count: { select: { likes: true, comments: true } },
    },
  };

  if (cursor) {
    args.skip = 1;
    args.cursor = { id: Number(cursor) };
  }

  const posts = await prisma.post.findMany(args);
  return posts.map(mapPostForClient);
}

async function getVideosFeed({
  userId,
  limit = 50,
  page,
  cursor,
  search,
  category,
  sort,
  duration,
  followingOnly,
}) {
  const take = Math.min(Number(limit) || 50, 100);
  const pageNum = Math.max(Number(page) || 1, 1);
  const normalizedSort = normalizeVideoSort(sort);
  const normalizedCategory = normalizeVideoCategory(category);
  const isFollowingOnly = followingOnly === true || followingOnly === 'true' || normalizedCategory === 'FOLLOWING';

  const follows = await prisma.userFollow.findMany({
    where: { followerId: Number(userId) },
    select: { followingId: true },
  });
  const followedIds = follows.map((f) => f.followingId);

  const where: any = {
    deletedAt: null,
    type: { in: ['VIDEO', 'REEL'] },
    category: { not: 'FUNDRAISING_UPDATE' as PostCategory },
    OR: [
      { privacy: 'PUBLIC' as PostPrivacy },
      { authorId: Number(userId) },
      { privacy: 'FOLLOWERS' as PostPrivacy, authorId: { in: followedIds } },
    ],
  };

  if (isFollowingOnly) {
    where.authorId = { in: followedIds.length ? followedIds : [-1] };
    where.OR = [
      { privacy: 'PUBLIC' as PostPrivacy, authorId: { in: followedIds.length ? followedIds : [-1] } },
      { privacy: 'FOLLOWERS' as PostPrivacy, authorId: { in: followedIds.length ? followedIds : [-1] } },
      { authorId: Number(userId) },
    ];
  }

  const args: Prisma.PostFindManyArgs = {
    where,
    orderBy:
      normalizedSort === 'most_liked'
        ? [{ likes: { _count: 'desc' } }, { createdAt: 'desc' }]
        : normalizedSort === 'most_commented'
          ? [{ comments: { _count: 'desc' } }, { createdAt: 'desc' }]
          : [{ createdAt: 'desc' }],
    take,
    skip: page ? (pageNum - 1) * take : undefined,
    include: {
      author: {
        select: {
          id: true,
          profile: {
            select: {
              displayName: true,
              username: true,
              avatarMedia: { select: avatarMediaSelect },
            },
          },
        },
      },
      media: {
        orderBy: { order: 'asc' },
        include: { media: { select: mediaSelect } },
      },
      taggedPets: taggedPetsInclude,
      fundraisingCampaign: {
        select: {
          id: true,
          title: true,
          targetAmount: true,
          deadline: true,
          locationText: true,
          account: { select: { status: true } },
          stats: { select: { raisedAmount: true, donorsCount: true } },
        },
      },
      likes: userId
        ? {
            where: { userId: Number(userId) },
            select: { id: true },
            take: 1,
          }
        : false,
      bookmarks: userId
        ? {
            where: { userId: Number(userId) },
            select: { id: true },
            take: 1,
          }
        : false,
      _count: { select: { likes: true, comments: true } },
    },
  };

  if (cursor) {
    args.skip = 1;
    args.cursor = { id: Number(cursor) };
  }

  const posts = await prisma.post.findMany(args);
  const filtered = posts
    .filter((post) => matchesVideoCategory(post, normalizedCategory))
    .filter((post) => matchesVideoSearch(post, search))
    .filter((post) => matchesVideoDuration(post, duration));

  const hasMore = filtered.length >= take;
  return {
    items: filtered.map(mapPostForClient),
    hasMore,
    page: pageNum,
    limit: take,
  };
}

async function getUserFeed({ meId, userId, limit = 50, cursor }) {
  const take = Math.min(Number(limit) || 50, 100);
  
  const isMe = Number(meId) === Number(userId);
  const where: any = {
    deletedAt: null,
    authorId: Number(userId),
    category: { not: 'FUNDRAISING_UPDATE' as PostCategory },
  };

  if (!isMe) {
    const follow = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: Number(meId),
          followingId: Number(userId),
        },
      },
    });
    const isFollowing = !!follow;

    if (isFollowing) {
      where.privacy = { in: ['PUBLIC' as PostPrivacy, 'FOLLOWERS' as PostPrivacy] };
    } else {
      where.privacy = 'PUBLIC' as PostPrivacy;
    }
  }

  const args: Prisma.PostFindManyArgs = {
    where,
    orderBy: { createdAt: 'desc' },
    take,
    include: {
      author: {
        select: {
          id: true,
          profile: {
            select: {
              displayName: true,
              username: true,
              avatarMedia: { select: avatarMediaSelect },
            },
          },
        },
      },
      media: {
        orderBy: { order: 'asc' },
        include: { media: { select: mediaSelect } },
      },
      taggedPets: taggedPetsInclude,
      fundraisingCampaign: {
        select: {
          id: true,
          title: true,
          targetAmount: true,
          deadline: true,
          locationText: true,
          account: { select: { status: true } },
          stats: { select: { raisedAmount: true, donorsCount: true } },
          donations: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            select: {
              amount: true,
              createdAt: true,
              donor: {
                select: {
                  id: true,
                  profile: {
                    select: {
                      displayName: true,
                      username: true,
                      avatarMedia: { select: avatarMediaSelect },
                    },
                  },
                },
              },
            },
          },
        },
      },
      likes: meId
        ? {
            where: { userId: Number(meId) },
            select: { id: true },
            take: 1,
          }
        : false,
      bookmarks: meId
        ? {
            where: { userId: Number(meId) },
            select: { id: true },
            take: 1,
          }
        : false,
      _count: { select: { likes: true, comments: true } },
    },
  };

  if (cursor) {
    args.skip = 1;
    args.cursor = { id: Number(cursor) };
  }

  const posts = await prisma.post.findMany(args);
  return posts.map(mapPostForClient);
}

async function getPostById({ meId, postId }) {
  const id = Number(postId);
  const post = await prisma.post.findFirst({
    // Keep fundraising updates out of normal single post API.
    where: { id, deletedAt: null, category: { not: 'FUNDRAISING_UPDATE' as PostCategory } },
    include: {
      author: {
        select: {
          id: true,
          profile: {
            select: {
              displayName: true,
              username: true,
              avatarMedia: { select: avatarMediaSelect },
            },
          },
        },
      },
      media: {
        orderBy: { order: 'asc' },
        include: { media: { select: mediaSelect } },
      },
      taggedPets: taggedPetsInclude,
      fundraisingCampaign: {
        select: {
          id: true,
          title: true,
          targetAmount: true,
          deadline: true,
          locationText: true,
          account: { select: { status: true } },
          stats: { select: { raisedAmount: true, donorsCount: true } },
          donations: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            select: {
              amount: true,
              createdAt: true,
              donor: {
                select: {
                  id: true,
                  profile: {
                    select: {
                      displayName: true,
                      username: true,
                      avatarMedia: { select: avatarMediaSelect },
                    },
                  },
                },
              },
            },
          },
        },
      },
      likes: meId
        ? {
            where: { userId: Number(meId) },
            select: { id: true },
            take: 1,
          }
        : false,
      bookmarks: meId
        ? {
            where: { userId: Number(meId) },
            select: { id: true },
            take: 1,
          }
        : false,
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!post) {
    const err = new Error('Post not found');
    (err as any).statusCode = 404;
    throw err;
  }

  // Check visibility/privacy
  if (post.privacy === 'PRIVATE' && Number(post.authorId) !== Number(meId)) {
    const err = new Error('Forbidden');
    (err as any).statusCode = 403;
    throw err;
  }
  if (post.privacy === 'FOLLOWERS' && Number(post.authorId) !== Number(meId)) {
    const follow = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: Number(meId),
          followingId: Number(post.authorId),
        },
      },
    });
    if (!follow) {
      const err = new Error('Forbidden');
      (err as any).statusCode = 403;
      throw err;
    }
  }

  return mapPostForClient(post);
}

// Returns a light-weight media list for profile gallery screens.
// Shape: { items: [{ postId, mediaId, url, createdAt }], nextCursor }
async function getUserMediaGallery({ meId, userId, mediaType, limit = 50, cursor }) {
  const take = Math.min(Number(limit) || 50, 100);
  const type = String(mediaType || '').toUpperCase() === 'VIDEO' ? 'VIDEO' : 'IMAGE';

  const isMe = Number(meId) === Number(userId);
  const where: any = {
    deletedAt: null,
    authorId: Number(userId),
    category: { not: 'FUNDRAISING_UPDATE' as PostCategory },
  };

  if (!isMe) {
    const follow = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: Number(meId),
          followingId: Number(userId),
        },
      },
    });
    const isFollowing = !!follow;

    if (isFollowing) {
      where.privacy = { in: ['PUBLIC' as PostPrivacy, 'FOLLOWERS' as PostPrivacy] };
    } else {
      where.privacy = 'PUBLIC' as PostPrivacy;
    }
  }

  const args: Prisma.PostFindManyArgs = {
    where,
    orderBy: { createdAt: 'desc' },
    take,
    include: {
      media: {
        orderBy: { order: 'asc' },
        include: { media: { select: mediaSelect } },
      },
    },
  };
  if (cursor) {
    args.skip = 1;
    args.cursor = { id: Number(cursor) };
  }

  const posts = await prisma.post.findMany(args);
  const items = [];
  for (const p of posts) {
    for (const pm of p.media || []) {
      const m = pm.media;
      if (!m) continue;
      const mt = String(m.type || '').toUpperCase();
      if (type === 'IMAGE' && mt !== 'IMAGE') continue;
      if (type === 'VIDEO' && mt !== 'VIDEO') continue;
      if (!m.url) continue;
      items.push({
        postId: p.id,
        mediaId: m.id,
        url: resolveClientMediaUrl({ url: m.url, key: m.key }),
        createdAt: p.createdAt,
      });
    }
  }

  const nextCursor = posts.length === take ? String(posts[posts.length - 1].id) : null;
  return { items, nextCursor };
}

async function createPost({ userId, caption, type, category, mediaIds = [], privacy, postType, backgroundStyle, lostPetName, lostPetLocation, lostPetContactVisible, taggedPetIds = [], songTitle, songArtist, songStartMs, songDurationMs }) {
  const requestedType = normalizePostType(type);
  const postCategory = normalizePostCategory(category);
  const postPrivacy = normalizePostPrivacy(privacy);
  const trimmedCaption = typeof caption === 'string' ? caption.trim() : null;
  const ids = (Array.isArray(mediaIds) ? mediaIds : [])
    .map((x) => Number(x))
    .filter((x) => Number.isFinite(x));
  const composerFields = normalizeComposerFields({ postType, backgroundStyle, lostPetName, lostPetLocation, lostPetContactVisible });
  const validTaggedPetIds = await validateTaggedPets({ userId, taggedPetIds });

  if (requestedType !== 'TEXT' && ids.length === 0) {
    const err = new Error('mediaIds is required for IMAGE/VIDEO/REEL posts');
    (err as any).statusCode = 400;
    throw err;
  }

  // Validate media existence/ownership and infer a safe post type from actual media.
  // This prevents situations like: client sends type=VIDEO but media is actually IMAGE,
  // which can cause clients to not render the post.
  let inferredType = requestedType;
  if (ids.length > 0) {
    const mediaRows = await prisma.media.findMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
      select: { id: true, type: true, ownerUserId: true },
    });

    // Ensure all referenced media exist
    const foundIds = new Set(mediaRows.map((m) => m.id));
    const missing = ids.filter((id) => !foundIds.has(id));
    if (missing.length) {
      const err = new Error(`Invalid mediaIds: ${missing.join(', ')}`);
      (err as any).statusCode = 400;
      throw err;
    }

    // Ensure media belongs to the caller (basic access control)
    const foreignMedia = mediaRows.find((m) => Number(m.ownerUserId) !== Number(userId));
    if (foreignMedia) {
      const err = new Error('One or more mediaIds do not belong to you');
      (err as any).statusCode = 403;
      throw err;
    }

    const hasVideo = mediaRows.some((m) => String(m.type || '').toUpperCase() === 'VIDEO');
    inferredType = hasVideo ? 'VIDEO' : 'IMAGE';

    // If client asked for TEXT but provided media, upgrade to inferred.
    // If client asked for VIDEO/IMAGE but media indicates otherwise, we trust the media.
    if (requestedType === 'TEXT') {
      inferredType = hasVideo ? 'VIDEO' : 'IMAGE';
    }
  }

  // REEL behaves like VIDEO in our storage model
  const mediaPostType = requestedType === 'REEL' ? 'REEL' : inferredType;

  const created = await prisma.post.create({
    data: {
      authorId: Number(userId),
      caption: trimmedCaption,
      type: mediaPostType,
      ...composerFields,
      category: postCategory,
      privacy: postPrivacy,
      songTitle: songTitle?.toString().trim() || null,
      songArtist: songArtist?.toString().trim() || null,
      songStartMs: songStartMs != null ? Number(songStartMs) : null,
      songDurationMs: songDurationMs != null ? Number(songDurationMs) : null,
      media: {
        create: ids.map((mediaId, idx) => ({
          mediaId,
          order: idx,
        })),
      },
      taggedPets: validTaggedPetIds.length
        ? { create: validTaggedPetIds.map((petId) => ({ petId })) }
        : undefined,
    },
    include: {
      author: {
        select: {
          id: true,
          profile: {
            select: {
              displayName: true,
              username: true,
              avatarMedia: { select: avatarMediaSelect },
            },
          },
        },
      },
      media: {
        orderBy: { order: 'asc' },
        include: { media: { select: mediaSelect } },
      },
      taggedPets: taggedPetsInclude,
      fundraisingCampaign: {
        select: { id: true },
      },
      likes: false,
      _count: { select: { likes: true, comments: true } },
    },
  });

  return mapPostForClient({ ...created, likes: [] });
}

async function updatePost({ userId, postId, caption, type, category, mediaIds, privacy, postType, backgroundStyle, lostPetName, lostPetLocation, lostPetContactVisible, taggedPetIds, songTitle, songArtist, songStartMs, songDurationMs }) {
  const id = Number(postId);
  const existing = await prisma.post.findFirst({
    where: { id, deletedAt: null },
    select: { id: true, authorId: true, type: true, postType: true },
  });
  if (!existing) {
    const err = new Error('Post not found');
    (err as any).statusCode = 404;
    throw err;
  }
  if (existing.authorId !== Number(userId)) {
    const err = new Error('Forbidden');
    (err as any).statusCode = 403;
    throw err;
  }

  const data: any = {};
  if (caption !== undefined) data.caption = (caption ?? '').toString().trim() || null;
  if (type !== undefined) data.type = normalizePostType(type);
  if (category !== undefined) data.category = normalizePostCategory(category);
  if (privacy !== undefined) data.privacy = normalizePostPrivacy(privacy);
  if (songTitle !== undefined) data.songTitle = songTitle?.toString().trim() || null;
  if (songArtist !== undefined) data.songArtist = songArtist?.toString().trim() || null;
  if (songStartMs !== undefined) data.songStartMs = songStartMs != null ? Number(songStartMs) : null;
  if (songDurationMs !== undefined) data.songDurationMs = songDurationMs != null ? Number(songDurationMs) : null;
  Object.assign(data, normalizeComposerUpdateFields({
    postType,
    currentPostType: existing.postType,
    backgroundStyle,
    lostPetName,
    lostPetLocation,
    lostPetContactVisible,
  }));
  const validTaggedPetIds = taggedPetIds !== undefined
    ? await validateTaggedPets({ userId, taggedPetIds })
    : null;

  // If caller sends mediaIds, we replace post media order with the new list.
  // This keeps the API simple and deterministic.
  const ids = Array.isArray(mediaIds)
    ? mediaIds
        .map((x) => Number(x))
        .filter((n) => Number.isFinite(n) && n > 0)
    : null;

  // If mediaIds is provided but type not provided, infer a safe type.
  if (ids && type === undefined) {
    if (ids.length === 0) {
      data.type = 'TEXT';
    } else {
      // Check if any uploaded media is VIDEO -> post type VIDEO
      const mediaRows = await prisma.media.findMany({
        where: { id: { in: ids }, deletedAt: null },
        select: { id: true, type: true },
      });
      const hasVideo = mediaRows.some((m) => (m.type || '').toUpperCase() === 'VIDEO');
      data.type = hasVideo ? 'VIDEO' : 'IMAGE';
    }
  }

  const updated = await prisma.$transaction(async (tx) => {
    const p = await tx.post.update({
      where: { id },
      data,
    });

    if (ids) {
      await tx.postMedia.deleteMany({ where: { postId: id } });
      if (ids.length > 0) {
        await tx.postMedia.createMany({
          data: ids.map((mediaId, order) => ({ postId: id, mediaId, order })),
        });
      }
    }

    if (validTaggedPetIds) {
      await tx.postTaggedPet.deleteMany({ where: { postId: id } });
      if (validTaggedPetIds.length > 0) {
        await tx.postTaggedPet.createMany({
          data: validTaggedPetIds.map((petId) => ({ postId: id, petId })),
          skipDuplicates: true,
        });
      }
    }

    // Re-fetch with includes
    const full = await tx.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            profile: {
              select: {
                displayName: true,
                username: true,
                avatarMedia: { select: avatarMediaSelect },
              },
            },
          },
        },
        media: {
          orderBy: { order: 'asc' },
          include: { media: { select: mediaSelect } },
        },
        taggedPets: taggedPetsInclude,
        _count: { select: { likes: true, comments: true } },
      },
    });

    return full;
  });

  return mapPostForClient({ ...(updated || {}), likes: [] });
}

async function softDeletePost({ userId, postId }) {
  const id = Number(postId);
  const existing = await prisma.post.findFirst({
    where: { id, deletedAt: null },
    select: { id: true, authorId: true },
  });
  if (!existing) {
    const err = new Error('Post not found');
    (err as any).statusCode = 404;
    throw err;
  }
  if (existing.authorId !== Number(userId)) {
    const err = new Error('Forbidden');
    (err as any).statusCode = 403;
    throw err;
  }

  await prisma.post.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return { id, deletedAt: true };
}

async function like({ userId, postId }) {
  const pId = Number(postId);
  const uId = Number(userId);

  await prisma.postLike.createMany({
    data: [{ postId: pId, userId: uId }],
    skipDuplicates: true,
  });

  const post = await prisma.post.findUnique({
    where: { id: pId },
    select: { _count: { select: { likes: true, comments: true } } },
  });
  return { likeCount: post?._count?.likes ?? 0, commentCount: post?._count?.comments ?? 0 };
}

async function unlike({ userId, postId }) {
  const pId = Number(postId);
  const uId = Number(userId);

  await prisma.postLike.deleteMany({
    where: { postId: pId, userId: uId },
  });
  const post = await prisma.post.findUnique({
    where: { id: pId },
    select: { _count: { select: { likes: true, comments: true } } },
  });
  return { likeCount: post?._count?.likes ?? 0, commentCount: post?._count?.comments ?? 0 };
}

async function listComments({ userId, postId, limit = 50 }) {
  const comments = await prisma.postComment.findMany({
    where: { postId: Number(postId), deletedAt: null },
    orderBy: { createdAt: 'asc' },
    take: Math.min(Number(limit) || 50, 200),
    include: {
      user: {
        select: {
          id: true,
          profile: {
            select: {
              displayName: true,
              username: true,
              avatarMedia: { select: avatarMediaSelect },
            },
          },
        },
      },
      _count: { select: { likes: true } },
      likes: userId
        ? {
            where: { userId: Number(userId) },
            select: { id: true },
            take: 1,
          }
        : false,
    },
  });

  return comments.map((c) => ({
    ...c,
    likeCount: c._count?.likes ?? 0,
    isLikedByMe: Array.isArray(c.likes) && c.likes.length > 0,
    likes: undefined,
    _count: undefined,
  }));
}

async function addComment({ userId, postId, text, parentId }) {
  const t = String(text || '').trim();
  if (!t) {
    const err = new Error('Comment text is required');
    (err as any).statusCode = 400;
    throw err;
  }
  const created = await prisma.postComment.create({
    data: {
      postId: Number(postId),
      userId: Number(userId),
      text: t,
      parentId: parentId ? Number(parentId) : null,
    },
    include: {
      user: {
        select: {
          id: true,
          profile: {
            select: {
              displayName: true,
              username: true,
              avatarMedia: { select: avatarMediaSelect },
            },
          },
        },
      },
    },
  });
  return created;
}



async function likeComment({ userId, commentId }) {
  await prisma.postCommentLike.upsert({
    where: { commentId_userId: { commentId: Number(commentId), userId: Number(userId) } },
    update: {},
    create: { commentId: Number(commentId), userId: Number(userId) },
  });
  const c = await prisma.postComment.findUnique({
    where: { id: Number(commentId) },
    select: { _count: { select: { likes: true } } },
  });
  return { likeCount: c?._count?.likes ?? 0 };
}

async function unlikeComment({ userId, commentId }) {
  await prisma.postCommentLike.deleteMany({ where: { commentId: Number(commentId), userId: Number(userId) } });
  const c = await prisma.postComment.findUnique({
    where: { id: Number(commentId) },
    select: { _count: { select: { likes: true } } },
  });
  return { likeCount: c?._count?.likes ?? 0 };
}

async function replyComment({ userId, postId, commentId, text }) {
  // Ensure parent exists
  const parent = await prisma.postComment.findFirst({
    where: { id: Number(commentId), postId: Number(postId), deletedAt: null },
    select: { id: true },
  });
  if (!parent) {
    const err = new Error('Comment not found');
    (err as any).statusCode = 404;
    throw err;
  }
  return addComment({ userId, postId, text, parentId: commentId });
}

async function bookmark({ userId, postId }) {
  const pId = Number(postId);
  const uId = Number(userId);

  const post = await prisma.post.findFirst({
    where: { id: pId, deletedAt: null },
    select: { id: true, authorId: true, privacy: true }
  });
  if (!post) {
    const err = new Error('Post not found');
    (err as any).statusCode = 404;
    throw err;
  }

  // Ownership/visibility check:
  if (post.privacy === 'PRIVATE' && post.authorId !== uId) {
    const err = new Error('Forbidden');
    (err as any).statusCode = 403;
    throw err;
  }
  if (post.privacy === 'FOLLOWERS' && post.authorId !== uId) {
    const follow = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId: uId,
          followingId: post.authorId,
        },
      },
    });
    if (!follow) {
      const err = new Error('Forbidden');
      (err as any).statusCode = 403;
      throw err;
    }
  }

  await prisma.postBookmark.upsert({
    where: { postId_userId: { postId: pId, userId: uId } },
    update: {},
    create: { postId: pId, userId: uId },
  });

  return { success: true };
}

async function unbookmark({ userId, postId }) {
  const pId = Number(postId);
  const uId = Number(userId);

  await prisma.postBookmark.deleteMany({
    where: { postId: pId, userId: uId },
  });

  return { success: true };
}

async function getBookmarkedPosts({ userId, limit = 50, cursor }) {
  const take = Math.min(Number(limit) || 50, 100);
  const uId = Number(userId);

  const follows = await prisma.userFollow.findMany({
    where: { followerId: uId },
    select: { followingId: true },
  });
  const followedIds = follows.map(f => f.followingId);

  const where: Prisma.PostBookmarkWhereInput = {
    userId: uId,
    post: {
      deletedAt: null,
      OR: [
        { privacy: 'PUBLIC' as PostPrivacy },
        { authorId: uId },
        { privacy: 'FOLLOWERS' as PostPrivacy, authorId: { in: followedIds } }
      ]
    }
  };

  const args: Prisma.PostBookmarkFindManyArgs = {
    where,
    orderBy: { createdAt: 'desc' },
    take,
    include: {
      post: {
        include: {
          author: {
            select: {
              id: true,
              profile: {
                select: {
                  displayName: true,
                  username: true,
                  avatarMedia: { select: avatarMediaSelect },
                },
              },
            },
          },
          media: {
            orderBy: { order: 'asc' },
            include: { media: { select: mediaSelect } },
          },
          fundraisingCampaign: {
            select: {
              id: true,
              title: true,
              targetAmount: true,
              deadline: true,
              locationText: true,
              account: { select: { status: true } },
              stats: { select: { raisedAmount: true, donorsCount: true } },
              donations: {
                take: 3,
                orderBy: { createdAt: 'desc' },
                select: {
                  amount: true,
                  createdAt: true,
                  donor: {
                    select: {
                      id: true,
                      profile: {
                        select: {
                          displayName: true,
                          username: true,
                          avatarMedia: { select: avatarMediaSelect },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          likes: {
            where: { userId: uId },
            select: { id: true },
            take: 1,
          },
          bookmarks: {
            where: { userId: uId },
            select: { id: true },
            take: 1,
          },
          _count: { select: { likes: true, comments: true } }
        }
      }
    }
  };

  if (cursor) {
    args.skip = 1;
    args.cursor = { id: Number(cursor) };
  }

  const bookmarkRows = await prisma.postBookmark.findMany(args);
  const posts = bookmarkRows.map(b => mapPostForClient(b.post));

  const nextCursor = bookmarkRows.length === take ? String(bookmarkRows[bookmarkRows.length - 1].id) : null;
  return { items: posts, nextCursor };
}

module.exports = {
  getFeed,
  getVideosFeed,
  getUserFeed,
  getPostById,
  getUserMediaGallery,
  createPost,
  updatePost,
  softDeletePost,
  like,
  unlike,
  listComments,
  addComment,
  likeComment,
  unlikeComment,
  replyComment,
  bookmark,
  unbookmark,
  getBookmarkedPosts,
};

export {};










