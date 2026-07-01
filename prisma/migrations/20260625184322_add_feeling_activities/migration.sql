-- CreateTable
CREATE TABLE "feeling_activities" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "labelBn" TEXT,
    "emoji" TEXT NOT NULL,
    "iconName" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPetSpecific" BOOLEAN NOT NULL DEFAULT false,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feeling_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feeling_activities_type_isActive_idx" ON "feeling_activities"("type", "isActive");

-- CreateIndex
CREATE INDEX "feeling_activities_category_isActive_idx" ON "feeling_activities"("category", "isActive");

-- AlterTable
ALTER TABLE "posts" ADD COLUMN "feelingActivityId" INTEGER,
ADD COLUMN "feelingActivityType" TEXT,
ADD COLUMN "feelingActivityLabel" TEXT,
ADD COLUMN "feelingActivityEmoji" TEXT;
