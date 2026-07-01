CREATE TABLE "adoption_comments" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "adoption_comments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "adoption_comments_petId_createdAt_idx" ON "adoption_comments"("petId", "createdAt");
CREATE INDEX "adoption_comments_userId_createdAt_idx" ON "adoption_comments"("userId", "createdAt");

ALTER TABLE "adoption_comments"
ADD CONSTRAINT "adoption_comments_petId_fkey"
FOREIGN KEY ("petId") REFERENCES "adoption_pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "adoption_comments"
ADD CONSTRAINT "adoption_comments_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
