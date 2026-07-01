import { z } from "zod";

const adoptionSpecies = z.enum(["CAT", "DOG", "BIRD", "RABBIT", "OTHER"]);
const adoptionOwnerType = z.enum(["INDIVIDUAL", "SHELTER", "RESCUE", "FOSTER", "ADMIN"]);
const serviceAreaType = z.enum([
  "SAME_AREA",
  "SAME_CITY",
  "SAME_DISTRICT",
  "SAME_DIVISION",
  "ANYWHERE_COUNTRY",
  "CUSTOM_AREAS",
  "RADIUS_BASED",
  "INTERNATIONAL",
]);
const adoptionPetStatus = z.enum([
  "DRAFT",
  "PENDING_REVIEW",
  "NEEDS_CHANGES",
  "APPROVED",
  "PUBLISHED",
  "PAUSED",
  "APPLICATION_CLOSED",
  "ADOPTED",
  "REJECTED",
  "REPORTED",
  "REMOVED",
  "EXPIRED",
]);
const gender = z.enum(["MALE", "FEMALE", "UNKNOWN"]);

const idSchema = z.coerce.number().int().positive();
const optionalIdSchema = z.coerce.number().int().positive().optional();

const criteriaSchema = z
  .object({
    minimumAdopterAgeYears: z.coerce.number().int().min(0).max(120).optional(),
    allowedResidenceTypesJson: z.array(z.string().trim().min(1)).max(20).optional(),
    adoptionExperienceRequired: z.boolean().optional(),
    fencedYardRequired: z.boolean().optional(),
    landlordApprovalRequired: z.boolean().optional(),
    canHaveChildren: z.boolean().nullable().optional(),
    canHaveOtherPets: z.boolean().nullable().optional(),
    homeCheckRequired: z.boolean().optional(),
    vetReferenceRequired: z.boolean().optional(),
    identityVerificationRequired: z.boolean().optional(),
    minimumMonthlyIncomeRange: z.string().trim().max(64).optional(),
    maximumMonthlyIncomeRange: z.string().trim().max(64).optional(),
    notes: z.string().trim().max(2000).optional(),
  })
  .partial();

export const adoptionListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(120).optional(),
  species: adoptionSpecies.optional(),
  status: z.string().trim().max(120).optional(),
  // structured filters
  breed: z.string().trim().max(128).optional(),
  gender: gender.optional(),
  size: z.string().trim().max(64).optional(),
  minAgeDays: z.coerce.number().int().min(0).optional(),
  maxAgeDays: z.coerce.number().int().min(0).optional(),
  // health
  vaccinated: z
    .union([z.boolean(), z.string().trim()])
    .optional()
    .transform((v) => {
      if (v === undefined || v === null) return undefined;
      if (typeof v === "boolean") return v;
      const s = String(v).toLowerCase();
      return s === "true" || s === "1" ? true : s === "false" || s === "0" ? false : undefined;
    }),
  dewormed: z
    .union([z.boolean(), z.string().trim()])
    .optional()
    .transform((v) => {
      if (v === undefined || v === null) return undefined;
      if (typeof v === "boolean") return v;
      const s = String(v).toLowerCase();
      return s === "true" || s === "1" ? true : s === "false" || s === "0" ? false : undefined;
    }),
  neutered: z
    .union([z.boolean(), z.string().trim()])
    .optional()
    .transform((v) => {
      if (v === undefined || v === null) return undefined;
      if (typeof v === "boolean") return v;
      const s = String(v).toLowerCase();
      return s === "true" || s === "1" ? true : s === "false" || s === "0" ? false : undefined;
    }),
  // compatibility (stored in criteria json via canHaveChildren / canHaveOtherPets)
  goodWithKids: z
    .union([z.boolean(), z.string().trim()])
    .optional()
    .transform((v) => {
      if (v === undefined || v === null) return undefined;
      if (typeof v === "boolean") return v;
      const s = String(v).toLowerCase();
      return s === "true" || s === "1" ? true : s === "false" || s === "0" ? false : undefined;
    }),
  goodWithDogs: z
    .union([z.boolean(), z.string().trim()])
    .optional()
    .transform((v) => {
      if (v === undefined || v === null) return undefined;
      if (typeof v === "boolean") return v;
      const s = String(v).toLowerCase();
      return s === "true" || s === "1" ? true : s === "false" || s === "0" ? false : undefined;
    }),
  goodWithCats: z
    .union([z.boolean(), z.string().trim()])
    .optional()
    .transform((v) => {
      if (v === undefined || v === null) return undefined;
      if (typeof v === "boolean") return v;
      const s = String(v).toLowerCase();
      return s === "true" || s === "1" ? true : s === "false" || s === "0" ? false : undefined;
    }),
  // location
  countryId: optionalIdSchema,
  stateId: optionalIdSchema,
  cityId: optionalIdSchema,
  subDistrictId: optionalIdSchema,
  divisionId: optionalIdSchema,
  districtId: optionalIdSchema,
  upazilaId: optionalIdSchema,
  areaId: optionalIdSchema,
  nearLat: z.coerce.number().min(-90).max(90).optional(),
  nearLng: z.coerce.number().min(-180).max(180).optional(),
  radiusKm: z.coerce.number().min(1).max(500).optional(),
});

export const adoptionIdParamSchema = z.object({
  id: idSchema,
});

export const adoptionCommentIdParamSchema = z.object({
  id: idSchema,
  commentId: idSchema,
});

export const createAdoptionSchema = z.object({
  submitNow: z.boolean().optional(),
  shelterProfileId: optionalIdSchema,
  countryId: idSchema,
  stateId: optionalIdSchema,
  cityId: optionalIdSchema,
  subDistrictId: optionalIdSchema,
  bdDivisionId: optionalIdSchema,
  bdDistrictId: optionalIdSchema,
  bdUpazilaId: optionalIdSchema,
  bdAreaId: optionalIdSchema,
  ownerType: adoptionOwnerType,
  species: adoptionSpecies,
  name: z.string().trim().min(1).max(120),
  breed: z.string().trim().max(128).optional(),
  ageText: z.string().trim().max(64).optional(),
  ageYears: z.number().int().min(0).max(100).optional(),
  ageMonths: z.number().int().min(0).max(11).optional(),
  ageDays: z.number().int().min(0).max(31).optional(),
  totalAgeDays: z.number().int().min(0).optional(),
  approximateDateOfBirth: z.preprocess((val) => val === null ? undefined : (typeof val === 'string' ? new Date(val) : val), z.date()).optional(),
  gender: gender.optional(),
  sizeText: z.string().trim().max(64).optional(),
  colorText: z.string().trim().max(64).optional(),
  title: z.string().trim().max(180).optional(),
  description: z.string().trim().max(5000).optional(),
  story: z.string().trim().max(5000).optional(),
  healthInfo: z.string().trim().max(5000).optional(),
  personalityTagsJson: z.array(z.string().trim().min(1)).max(30).optional(),
  compatibilityTagsJson: z.array(z.string().trim().min(1)).max(30).optional(),
  adopterConditionsJson: z.array(z.string().trim().min(1)).max(30).optional(),
  serviceAreaType: serviceAreaType.optional(),
  serviceAreaNotes: z.string().trim().max(2000).optional(),
  customServiceAreasJson: z.array(z.any()).max(100).optional(),
  serviceRadiusKm: z.coerce.number().int().min(1).max(10000).optional(),
  allowInternationalAdoption: z.boolean().optional(),
  vaccinated: z.boolean().nullable().optional(),
  dewormed: z.boolean().nullable().optional(),
  neutered: z.boolean().nullable().optional(),
  microchipped: z.boolean().nullable().optional(),
  specialNeeds: z.boolean().optional(),
  adoptionFeeText: z.string().trim().max(128).optional(),
  contactPhoneVisible: z.boolean().optional(),
  ownerContactPhone: z.string().trim().min(7).max(32),
  ownerWhatsappPhone: z.string().trim().max(32).optional(),
  ownerCityAreaText: z.string().trim().min(2).max(160),
  pickupLocationNotes: z.string().trim().min(4).max(2000),
  expiresAt: z.string().datetime().optional(),
  mediaIds: z.array(idSchema).max(20).optional(),
  criteria: criteriaSchema.optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
});

export const updateAdoptionSchema = createAdoptionSchema.partial();

export const applyAdoptionSchema = z.object({
  messageToOwner: z.string().trim().max(4000).optional(),
  applicantName: z.string().trim().min(2).max(160),
  applicantPhone: z.string().trim().max(32).optional(),
  applicantWhatsappPhone: z.string().trim().max(32).optional(),
  applicantEmail: z.string().trim().email().max(255).optional(),
  applicantAddress: z.string().trim().max(512).optional(),
  applicantCityAreaText: z.string().trim().min(2).max(160),
  applicantCountryId: optionalIdSchema,
  applicantStateId: optionalIdSchema,
  applicantCityId: optionalIdSchema,
  applicantSubDistrictId: optionalIdSchema,
  applicantBdDivisionId: optionalIdSchema,
  applicantBdDistrictId: optionalIdSchema,
  applicantBdUpazilaId: optionalIdSchema,
  applicantBdAreaId: optionalIdSchema,
  applicantOccupation: z.string().trim().max(128).optional(),
  applicantHouseholdSummary: z.string().trim().max(2000).optional(),
  applicantExperienceSummary: z.string().trim().max(2000).optional(),
  applicantOtherPetsSummary: z.string().trim().max(2000).optional(),
  applicantIncomeRange: z.string().trim().max(64).optional(),
  consentToHomeCheck: z.boolean().optional(),
  consentToFollowUp: z.boolean().optional(),
  answers: z
    .array(
      z.object({
        questionKey: z.string().trim().min(1).max(128),
        questionLabel: z.string().trim().max(255).optional(),
        answerText: z.string().trim().max(4000).optional(),
        answerJson: z.any().optional(),
      })
    )
    .max(50)
    .optional(),
});

export const adoptionCommentListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const createAdoptionCommentSchema = z.object({
  text: z.string().trim().min(1).max(4000),
});

export const ownerStatusFilterSchema = z.array(adoptionPetStatus).min(1);

export const adminAdoptionListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.string().trim().max(120).optional(),
  species: adoptionSpecies.optional(),
  countryId: optionalIdSchema,
  ownerId: optionalIdSchema,
  search: z.string().trim().max(120).optional(),
  reportedOnly: z
    .union([z.boolean(), z.string().trim()])
    .optional()
    .transform((value) => {
      if (typeof value === "boolean") return value;
      const lowered = String(value || "").toLowerCase();
      return lowered === "true" || lowered === "1";
    }),
});

export const adminAdoptionActionSchema = z.object({
  note: z.string().trim().max(2000).optional(),
  reason: z.string().trim().max(2000).optional(),
});

export const adminCountryRuleCreateSchema = z.object({
  countryId: idSchema,
  title: z.string().trim().min(1).max(255),
  summary: z.string().trim().max(2000).optional(),
  policyUrl: z.string().trim().url().max(1024).optional(),
  minAdopterAgeYears: z.coerce.number().int().min(0).max(120).optional(),
  allowInternationalAdoption: z.boolean().optional(),
  metadataJson: z.any().optional(),
  isActive: z.boolean().optional(),
});

export const adminCountryRuleUpdateSchema = adminCountryRuleCreateSchema.partial();

export const applicationStatusUpdateSchema = z.object({
  status: z.enum([
    "VIEWED",
    "OWNER_REVIEW",
    "SHORTLISTED",
    "INTERVIEW_SCHEDULED",
    "APPROVED",
    "REJECTED",
    "CANCELLED",
  ]),
  note: z.string().trim().max(2000).optional(),
});

export const reportAdoptionSchema = z.object({
  reasonCode: z.enum([
    "FAKE_LISTING",
    "PET_SELLING",
    "SCAM",
    "WRONG_INFO",
    "DUPLICATE",
    "SICK_PET_HIDDEN",
    "ABUSE_CONCERN",
    "SUSPICIOUS_PAYMENT",
    "OTHER",
  ]),
  details: z.string().trim().max(2000).optional(),
});

module.exports = {
  adoptionListQuerySchema,
  adoptionIdParamSchema,
  adoptionCommentIdParamSchema,
  adoptionCommentListQuerySchema,
  createAdoptionSchema,
  updateAdoptionSchema,
  applyAdoptionSchema,
  createAdoptionCommentSchema,
  ownerStatusFilterSchema,
  adminAdoptionListQuerySchema,
  adminAdoptionActionSchema,
  adminCountryRuleCreateSchema,
  adminCountryRuleUpdateSchema,
  applicationStatusUpdateSchema,
  reportAdoptionSchema,
};
