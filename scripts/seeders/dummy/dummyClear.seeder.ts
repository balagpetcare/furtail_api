import prisma from "../../../src/infrastructure/db/prismaClient";

export async function clearDummyData(dryRun: boolean) {
  const results = { deleted: 0, skipped: 0, updated: 0, failed: 0 };

  // Find all dummy users
  const dummyUsers = await prisma.user.findMany({
    where: {
      OR: [
        { profile: { username: { startsWith: "dummy_user_" } } },
        { auth: { email: { startsWith: "dummy.user." } } }
      ]
    },
    select: { id: true }
  });

  if (dummyUsers.length === 0) {
    console.log("No dummy users found to delete.");
    return results;
  }

  const dummyUserIds = dummyUsers.map(u => u.id);

  if (dryRun) {
    console.log(`[Dry Run] Would clear data for ${dummyUserIds.length} dummy users.`);
    return results;
  }

  try {
    // Count how many items we are going to delete
    const postCount = await prisma.post.count({ where: { authorId: { in: dummyUserIds } } });
    const petCount = await prisma.pet.count({ where: { userId: { in: dummyUserIds } } });
    const mediaCount = await prisma.media.count({ where: { ownerUserId: { in: dummyUserIds } } });

    // Nullify media relations first to prevent foreign key errors
    await prisma.userProfile.updateMany({
      where: { userId: { in: dummyUserIds } },
      data: { avatarMediaId: null, coverMediaId: null }
    });

    await prisma.pet.updateMany({
      where: { userId: { in: dummyUserIds } },
      data: { profilePicId: null, coverMediaId: null }
    });

    // Delete Post associations (likes, bookmarks, comments)
    const dummyPosts = await prisma.post.findMany({
      where: { authorId: { in: dummyUserIds } },
      select: { id: true }
    });
    const dummyPostIds = dummyPosts.map(p => p.id);

    if (dummyPostIds.length > 0) {
      await prisma.postLike.deleteMany({ where: { postId: { in: dummyPostIds } } });
      await prisma.postBookmark.deleteMany({ where: { postId: { in: dummyPostIds } } });
      await prisma.postCommentLike.deleteMany({ where: { comment: { postId: { in: dummyPostIds } } } });
      await prisma.postComment.deleteMany({ where: { postId: { in: dummyPostIds } } });
      
      // Delete PostMedia
      await prisma.postMedia.deleteMany({ where: { postId: { in: dummyPostIds } } });
      
      // Delete Post
      await prisma.post.deleteMany({ where: { id: { in: dummyPostIds } } });
    }

    // Delete Stories
    const dummyStories = await prisma.story.findMany({
      where: { userId: { in: dummyUserIds } },
      select: { id: true }
    });
    const dummyStoryIds = dummyStories.map(s => s.id);

    if (dummyStoryIds.length > 0) {
      await prisma.storyView.deleteMany({
        where: { storyId: { in: dummyStoryIds } }
      });
      await prisma.story.deleteMany({
        where: { id: { in: dummyStoryIds } }
      });
    }

    // Also remove views by dummy users on other stories
    await prisma.storyView.deleteMany({
      where: { viewerId: { in: dummyUserIds } }
    });

    // Delete Pet associations
    await prisma.petFollow.deleteMany({ where: { pet: { userId: { in: dummyUserIds } } } });
    await prisma.petLike.deleteMany({ where: { pet: { userId: { in: dummyUserIds } } } });
    await prisma.petFamilyMember.deleteMany({ where: { pet: { userId: { in: dummyUserIds } } } });
    await prisma.petWeight.deleteMany({ where: { pet: { userId: { in: dummyUserIds } } } });
    await prisma.vaccination.deleteMany({ where: { pet: { userId: { in: dummyUserIds } } } });
    await prisma.vaccinationReminder.deleteMany({ where: { pet: { userId: { in: dummyUserIds } } } });
    await prisma.dewormingRecord.deleteMany({ where: { pet: { userId: { in: dummyUserIds } } } });
    await prisma.medicalHistory.deleteMany({ where: { pet: { userId: { in: dummyUserIds } } } });

    // Delete Pet
    await prisma.pet.deleteMany({ where: { userId: { in: dummyUserIds } } });

    // Delete UserProfile
    await prisma.userProfile.deleteMany({ where: { userId: { in: dummyUserIds } } });

    // Delete UserAuth
    await prisma.userAuth.deleteMany({ where: { userId: { in: dummyUserIds } } });

    // Delete Gallery & Achievements
    await prisma.userGalleryItem.deleteMany({ where: { userId: { in: dummyUserIds } } });
    await prisma.userAchievement.deleteMany({ where: { userId: { in: dummyUserIds } } });

    // Delete User
    await prisma.user.deleteMany({ where: { id: { in: dummyUserIds } } });

    // Delete Media owned by dummy users
    await prisma.media.deleteMany({ where: { ownerUserId: { in: dummyUserIds } } });

    results.deleted = dummyUserIds.length + postCount + petCount + mediaCount;
  } catch (err) {
    console.error("Failed to clear dummy data:", err);
    results.failed = 1;
  }

  return results;
}
