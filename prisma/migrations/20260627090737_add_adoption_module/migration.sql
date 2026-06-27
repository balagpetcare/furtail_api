-- CreateEnum
CREATE TYPE "AdoptionPetStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'NEEDS_CHANGES', 'APPROVED', 'PUBLISHED', 'PAUSED', 'APPLICATION_CLOSED', 'ADOPTED', 'REJECTED', 'REPORTED', 'REMOVED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AdoptionApplicationStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'VIEWED', 'OWNER_REVIEW', 'SHORTLISTED', 'MESSAGE_STARTED', 'INTERVIEW_SCHEDULED', 'HOME_CHECK_REQUESTED', 'APPROVED', 'REJECTED', 'CANCELLED', 'ADOPTION_COMPLETED');

-- CreateEnum
CREATE TYPE "AdoptionSpecies" AS ENUM ('CAT', 'DOG', 'BIRD', 'RABBIT', 'OTHER');

-- CreateEnum
CREATE TYPE "AdoptionOwnerType" AS ENUM ('INDIVIDUAL', 'SHELTER', 'RESCUE', 'FOSTER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ServiceAreaType" AS ENUM ('SAME_AREA', 'SAME_CITY', 'SAME_DISTRICT', 'SAME_DIVISION', 'ANYWHERE_COUNTRY', 'CUSTOM_AREAS', 'RADIUS_BASED', 'INTERNATIONAL');

-- CreateEnum
CREATE TYPE "AdoptionAgreementStatus" AS ENUM ('DRAFT', 'SENT', 'SIGNED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AdoptionFollowUpStatus" AS ENUM ('PENDING', 'COMPLETED', 'SKIPPED');

-- CreateTable
CREATE TABLE "adoption_pets" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "shelterProfileId" INTEGER,
    "legacyPostId" INTEGER,
    "countryId" INTEGER NOT NULL,
    "stateId" INTEGER,
    "cityId" INTEGER,
    "subDistrictId" INTEGER,
    "bdDivisionId" INTEGER,
    "bdDistrictId" INTEGER,
    "bdUpazilaId" INTEGER,
    "bdAreaId" INTEGER,
    "ownerType" "AdoptionOwnerType" NOT NULL,
    "species" "AdoptionSpecies" NOT NULL,
    "status" "AdoptionPetStatus" NOT NULL DEFAULT 'DRAFT',
    "name" TEXT NOT NULL,
    "breed" VARCHAR(128),
    "ageText" VARCHAR(64),
    "gender" "Gender" NOT NULL DEFAULT 'UNKNOWN',
    "sizeText" VARCHAR(64),
    "colorText" VARCHAR(64),
    "title" VARCHAR(180),
    "description" TEXT,
    "story" TEXT,
    "healthInfo" TEXT,
    "personalityTagsJson" JSONB DEFAULT '[]',
    "compatibilityTagsJson" JSONB DEFAULT '[]',
    "adopterConditionsJson" JSONB DEFAULT '[]',
    "serviceAreaType" "ServiceAreaType" NOT NULL DEFAULT 'SAME_CITY',
    "serviceAreaNotes" TEXT,
    "customServiceAreasJson" JSONB DEFAULT '[]',
    "serviceRadiusKm" INTEGER,
    "allowInternationalAdoption" BOOLEAN NOT NULL DEFAULT false,
    "vaccinated" BOOLEAN,
    "dewormed" BOOLEAN,
    "neutered" BOOLEAN,
    "microchipped" BOOLEAN,
    "specialNeeds" BOOLEAN NOT NULL DEFAULT false,
    "adoptionFeeText" VARCHAR(128),
    "contactPhoneVisible" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "submittedForReviewAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "adminReviewNote" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "adoption_pets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adoption_pet_media" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "kind" VARCHAR(32),
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adoption_pet_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adoption_criteria" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "minimumAdopterAgeYears" INTEGER,
    "allowedResidenceTypesJson" JSONB DEFAULT '[]',
    "adoptionExperienceRequired" BOOLEAN NOT NULL DEFAULT false,
    "fencedYardRequired" BOOLEAN NOT NULL DEFAULT false,
    "landlordApprovalRequired" BOOLEAN NOT NULL DEFAULT false,
    "canHaveChildren" BOOLEAN,
    "canHaveOtherPets" BOOLEAN,
    "homeCheckRequired" BOOLEAN NOT NULL DEFAULT false,
    "vetReferenceRequired" BOOLEAN NOT NULL DEFAULT false,
    "identityVerificationRequired" BOOLEAN NOT NULL DEFAULT false,
    "minimumMonthlyIncomeRange" VARCHAR(64),
    "maximumMonthlyIncomeRange" VARCHAR(64),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "adoption_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adoption_applications" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "applicantId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "status" "AdoptionApplicationStatus" NOT NULL DEFAULT 'DRAFT',
    "messageToOwner" TEXT,
    "applicantPhone" VARCHAR(32),
    "applicantEmail" VARCHAR(255),
    "applicantAddress" VARCHAR(512),
    "applicantCountryId" INTEGER,
    "applicantStateId" INTEGER,
    "applicantCityId" INTEGER,
    "applicantSubDistrictId" INTEGER,
    "applicantBdDivisionId" INTEGER,
    "applicantBdDistrictId" INTEGER,
    "applicantBdUpazilaId" INTEGER,
    "applicantBdAreaId" INTEGER,
    "applicantOccupation" VARCHAR(128),
    "applicantHouseholdSummary" TEXT,
    "applicantExperienceSummary" TEXT,
    "applicantOtherPetsSummary" TEXT,
    "applicantIncomeRange" VARCHAR(64),
    "consentToHomeCheck" BOOLEAN NOT NULL DEFAULT false,
    "consentToFollowUp" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "adoption_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adoption_application_answers" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "questionKey" VARCHAR(128) NOT NULL,
    "questionLabel" VARCHAR(255),
    "answerText" TEXT,
    "answerJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adoption_application_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adoption_favorites" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adoption_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adoption_reports" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "reporterId" INTEGER NOT NULL,
    "reasonCode" VARCHAR(64) NOT NULL,
    "details" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "adoption_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adoption_status_history" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "fromStatus" "AdoptionPetStatus",
    "toStatus" "AdoptionPetStatus" NOT NULL,
    "actorUserId" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "adoption_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adoption_agreements" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "applicationId" INTEGER,
    "ownerId" INTEGER NOT NULL,
    "adopterUserId" INTEGER,
    "status" "AdoptionAgreementStatus" NOT NULL DEFAULT 'DRAFT',
    "title" VARCHAR(255),
    "contentJson" JSONB,
    "signedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "adoption_agreements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adoption_follow_ups" (
    "id" SERIAL NOT NULL,
    "petId" INTEGER NOT NULL,
    "applicationId" INTEGER,
    "ownerId" INTEGER NOT NULL,
    "adopterUserId" INTEGER,
    "status" "AdoptionFollowUpStatus" NOT NULL DEFAULT 'PENDING',
    "scheduledFor" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "adoption_follow_ups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "country_adoption_rules" (
    "id" SERIAL NOT NULL,
    "countryId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "policyUrl" VARCHAR(1024),
    "minAdopterAgeYears" INTEGER,
    "allowInternationalAdoption" BOOLEAN NOT NULL DEFAULT false,
    "metadataJson" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "country_adoption_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shelter_profiles" (
    "id" SERIAL NOT NULL,
    "ownerUserId" INTEGER NOT NULL,
    "organizationId" INTEGER,
    "countryId" INTEGER,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNSUBMITTED',
    "displayName" TEXT NOT NULL,
    "legalName" TEXT,
    "description" TEXT,
    "websiteUrl" VARCHAR(1024),
    "supportEmail" VARCHAR(255),
    "supportPhone" VARCHAR(32),
    "addressText" VARCHAR(512),
    "serviceAreasJson" JSONB DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "shelter_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "adoption_pets_legacyPostId_key" ON "adoption_pets"("legacyPostId");

-- CreateIndex
CREATE INDEX "adoption_pets_status_createdAt_idx" ON "adoption_pets"("status", "createdAt");

-- CreateIndex
CREATE INDEX "adoption_pets_ownerId_status_idx" ON "adoption_pets"("ownerId", "status");

-- CreateIndex
CREATE INDEX "adoption_pets_countryId_status_idx" ON "adoption_pets"("countryId", "status");

-- CreateIndex
CREATE INDEX "adoption_pets_species_status_idx" ON "adoption_pets"("species", "status");

-- CreateIndex
CREATE INDEX "adoption_pets_stateId_idx" ON "adoption_pets"("stateId");

-- CreateIndex
CREATE INDEX "adoption_pets_cityId_idx" ON "adoption_pets"("cityId");

-- CreateIndex
CREATE INDEX "adoption_pets_subDistrictId_idx" ON "adoption_pets"("subDistrictId");

-- CreateIndex
CREATE INDEX "adoption_pets_bdDivisionId_idx" ON "adoption_pets"("bdDivisionId");

-- CreateIndex
CREATE INDEX "adoption_pets_bdDistrictId_idx" ON "adoption_pets"("bdDistrictId");

-- CreateIndex
CREATE INDEX "adoption_pets_bdUpazilaId_idx" ON "adoption_pets"("bdUpazilaId");

-- CreateIndex
CREATE INDEX "adoption_pets_bdAreaId_idx" ON "adoption_pets"("bdAreaId");

-- CreateIndex
CREATE INDEX "adoption_pets_publishedAt_idx" ON "adoption_pets"("publishedAt");

-- CreateIndex
CREATE INDEX "adoption_pet_media_mediaId_idx" ON "adoption_pet_media"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "adoption_pet_media_petId_order_key" ON "adoption_pet_media"("petId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "adoption_pet_media_petId_mediaId_key" ON "adoption_pet_media"("petId", "mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "adoption_criteria_petId_key" ON "adoption_criteria"("petId");

-- CreateIndex
CREATE INDEX "adoption_applications_petId_status_idx" ON "adoption_applications"("petId", "status");

-- CreateIndex
CREATE INDEX "adoption_applications_applicantId_status_idx" ON "adoption_applications"("applicantId", "status");

-- CreateIndex
CREATE INDEX "adoption_applications_ownerId_status_idx" ON "adoption_applications"("ownerId", "status");

-- CreateIndex
CREATE INDEX "adoption_applications_createdAt_idx" ON "adoption_applications"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "adoption_applications_petId_applicantId_key" ON "adoption_applications"("petId", "applicantId");

-- CreateIndex
CREATE INDEX "adoption_application_answers_applicationId_idx" ON "adoption_application_answers"("applicationId");

-- CreateIndex
CREATE INDEX "adoption_favorites_userId_createdAt_idx" ON "adoption_favorites"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "adoption_favorites_petId_userId_key" ON "adoption_favorites"("petId", "userId");

-- CreateIndex
CREATE INDEX "adoption_reports_petId_status_idx" ON "adoption_reports"("petId", "status");

-- CreateIndex
CREATE INDEX "adoption_reports_reporterId_idx" ON "adoption_reports"("reporterId");

-- CreateIndex
CREATE INDEX "adoption_status_history_petId_createdAt_idx" ON "adoption_status_history"("petId", "createdAt");

-- CreateIndex
CREATE INDEX "adoption_status_history_actorUserId_idx" ON "adoption_status_history"("actorUserId");

-- CreateIndex
CREATE INDEX "adoption_agreements_petId_status_idx" ON "adoption_agreements"("petId", "status");

-- CreateIndex
CREATE INDEX "adoption_agreements_applicationId_idx" ON "adoption_agreements"("applicationId");

-- CreateIndex
CREATE INDEX "adoption_follow_ups_petId_status_idx" ON "adoption_follow_ups"("petId", "status");

-- CreateIndex
CREATE INDEX "adoption_follow_ups_applicationId_idx" ON "adoption_follow_ups"("applicationId");

-- CreateIndex
CREATE INDEX "country_adoption_rules_countryId_isActive_idx" ON "country_adoption_rules"("countryId", "isActive");

-- CreateIndex
CREATE INDEX "shelter_profiles_ownerUserId_idx" ON "shelter_profiles"("ownerUserId");

-- CreateIndex
CREATE INDEX "shelter_profiles_organizationId_idx" ON "shelter_profiles"("organizationId");

-- CreateIndex
CREATE INDEX "shelter_profiles_countryId_idx" ON "shelter_profiles"("countryId");

-- CreateIndex
CREATE INDEX "shelter_profiles_verificationStatus_idx" ON "shelter_profiles"("verificationStatus");

-- AddForeignKey
ALTER TABLE "adoption_pets" ADD CONSTRAINT "adoption_pets_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_pets" ADD CONSTRAINT "adoption_pets_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_pets" ADD CONSTRAINT "adoption_pets_shelterProfileId_fkey" FOREIGN KEY ("shelterProfileId") REFERENCES "shelter_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_pet_media" ADD CONSTRAINT "adoption_pet_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_pet_media" ADD CONSTRAINT "adoption_pet_media_petId_fkey" FOREIGN KEY ("petId") REFERENCES "adoption_pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_criteria" ADD CONSTRAINT "adoption_criteria_petId_fkey" FOREIGN KEY ("petId") REFERENCES "adoption_pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_applications" ADD CONSTRAINT "adoption_applications_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_applications" ADD CONSTRAINT "adoption_applications_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_applications" ADD CONSTRAINT "adoption_applications_petId_fkey" FOREIGN KEY ("petId") REFERENCES "adoption_pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_application_answers" ADD CONSTRAINT "adoption_application_answers_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "adoption_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_favorites" ADD CONSTRAINT "adoption_favorites_petId_fkey" FOREIGN KEY ("petId") REFERENCES "adoption_pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_favorites" ADD CONSTRAINT "adoption_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_reports" ADD CONSTRAINT "adoption_reports_petId_fkey" FOREIGN KEY ("petId") REFERENCES "adoption_pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_reports" ADD CONSTRAINT "adoption_reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_status_history" ADD CONSTRAINT "adoption_status_history_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_status_history" ADD CONSTRAINT "adoption_status_history_petId_fkey" FOREIGN KEY ("petId") REFERENCES "adoption_pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_agreements" ADD CONSTRAINT "adoption_agreements_petId_fkey" FOREIGN KEY ("petId") REFERENCES "adoption_pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_agreements" ADD CONSTRAINT "adoption_agreements_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "adoption_applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_follow_ups" ADD CONSTRAINT "adoption_follow_ups_petId_fkey" FOREIGN KEY ("petId") REFERENCES "adoption_pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adoption_follow_ups" ADD CONSTRAINT "adoption_follow_ups_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "adoption_applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "country_adoption_rules" ADD CONSTRAINT "country_adoption_rules_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelter_profiles" ADD CONSTRAINT "shelter_profiles_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelter_profiles" ADD CONSTRAINT "shelter_profiles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelter_profiles" ADD CONSTRAINT "shelter_profiles_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
