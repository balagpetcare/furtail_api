const prisma = require('../../../../infrastructure/db/prismaClient');
const { resolveClientMediaUrl } = require('../../../../shared/storage/publicMediaUrl');

const _userWithProfile = {
  select: {
    id: true,
    profile: {
      select: {
        displayName: true,
        avatarMedia: { select: { url: true, key: true } },
      },
    },
  },
};

function mapStory(story: any, currentUserId: number) {
  const avatarRaw = story.user?.profile?.avatarMedia;
  const avatarUrl = avatarRaw
    ? resolveClientMediaUrl({ url: avatarRaw.url, key: avatarRaw.key })
    : null;

  return {
    id: story.id,
    userId: String(story.userId),
    userName: story.user?.profile?.displayName || 'User',
    userAvatarUrl: avatarUrl,
    mediaUrl: story.mediaUrl,
    mediaType: story.mediaType,
    caption: story.caption ?? null,
    createdAt: story.createdAt.toISOString(),
    expiresAt: story.expiresAt.toISOString(),
    viewCount: story.viewCount,
    isViewedByMe: Array.isArray(story.views) && story.views.some((v: any) => v.viewerId === currentUserId),
    isOwnStory: story.userId === currentUserId,
  };
}

exports.getFeed = async (userId: number) => {
  const now = new Date();

  const stories = await prisma.story.findMany({
    where: {
      isDeleted: false,
      expiresAt: { gt: now },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      user: _userWithProfile,
      views: {
        where: { viewerId: userId },
        select: { viewerId: true },
      },
    },
  });

  return stories.map((s: any) => mapStory(s, userId));
};

exports.create = async (
  userId: number,
  data: { mediaUrl: string; mediaType: string; caption?: string },
) => {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const story = await prisma.story.create({
    data: {
      userId,
      mediaUrl: data.mediaUrl,
      mediaType: data.mediaType,
      caption: data.caption ?? null,
      expiresAt,
    },
    include: {
      user: _userWithProfile,
      views: {
        where: { viewerId: userId },
        select: { viewerId: true },
      },
    },
  });

  return mapStory(story, userId);
};

exports.markViewed = async (storyId: number, viewerId: number) => {
  await prisma.storyView.upsert({
    where: { storyId_viewerId: { storyId, viewerId } },
    create: { storyId, viewerId },
    update: { viewedAt: new Date() },
  });

  await prisma.story.update({
    where: { id: storyId },
    data: { viewCount: { increment: 1 } },
  });
};

exports.deleteStory = async (storyId: number, userId: number) => {
  const story = await prisma.story.findFirst({
    where: { id: storyId, userId, isDeleted: false },
  });

  if (!story) {
    const err: any = new Error('Story not found or unauthorized');
    err.statusCode = 404;
    throw err;
  }

  await prisma.story.update({
    where: { id: storyId },
    data: { isDeleted: true },
  });
};

export {};
