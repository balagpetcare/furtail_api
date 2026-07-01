-- CreateEnum
CREATE TYPE "PetProfileVisibility" AS ENUM ('PUBLIC', 'FOLLOWERS_ONLY', 'PRIVATE');

-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "bio" VARCHAR(500),
ADD COLUMN     "coverMediaId" INTEGER,
ADD COLUMN     "followersCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isPublicProfileEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "likesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "slug" VARCHAR(100),
ADD COLUMN     "visibility" "PetProfileVisibility" NOT NULL DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "petId" INTEGER;

-- CreateTable
CREATE TABLE "pet_follows" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pet_follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pet_likes" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pet_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pet_follows_petId_idx" ON "pet_follows"("petId");

-- CreateIndex
CREATE INDEX "pet_follows_userId_idx" ON "pet_follows"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "pet_follows_petId_userId_key" ON "pet_follows"("petId", "userId");

-- CreateIndex
CREATE INDEX "pet_likes_petId_idx" ON "pet_likes"("petId");

-- CreateIndex
CREATE INDEX "pet_likes_userId_idx" ON "pet_likes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "pet_likes_petId_userId_key" ON "pet_likes"("petId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "pets_slug_key" ON "pets"("slug");

-- CreateIndex
CREATE INDEX "pets_userId_idx" ON "pets"("userId");

-- CreateIndex
CREATE INDEX "pets_slug_idx" ON "pets"("slug");

-- CreateIndex
CREATE INDEX "posts_petId_createdAt_idx" ON "posts"("petId", "createdAt");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_coverMediaId_fkey" FOREIGN KEY ("coverMediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_follows" ADD CONSTRAINT "pet_follows_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_follows" ADD CONSTRAINT "pet_follows_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_likes" ADD CONSTRAINT "pet_likes_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pet_likes" ADD CONSTRAINT "pet_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
