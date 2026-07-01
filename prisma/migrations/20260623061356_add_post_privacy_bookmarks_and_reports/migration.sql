-- CreateEnum
CREATE TYPE "PostPrivacy" AS ENUM ('PUBLIC', 'FOLLOWERS', 'PRIVATE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'POST_LIKE';
ALTER TYPE "NotificationType" ADD VALUE 'POST_COMMENT';
ALTER TYPE "NotificationType" ADD VALUE 'USER_FOLLOW';

-- AlterEnum
ALTER TYPE "ReportTargetType" ADD VALUE 'COMMENT';

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "privacy" "PostPrivacy" NOT NULL DEFAULT 'PUBLIC';

-- CreateTable
CREATE TABLE "post_bookmarks" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "post_bookmarks_userId_idx" ON "post_bookmarks"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "post_bookmarks_postId_userId_key" ON "post_bookmarks"("postId", "userId");

-- AddForeignKey
ALTER TABLE "post_bookmarks" ADD CONSTRAINT "post_bookmarks_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_bookmarks" ADD CONSTRAINT "post_bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
