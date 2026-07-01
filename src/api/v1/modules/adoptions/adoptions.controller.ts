const service = require("./adoptions.service");
const {
  adoptionListQuerySchema,
  adoptionIdParamSchema,
  adoptionCommentIdParamSchema,
  adoptionCommentListQuerySchema,
  createAdoptionSchema,
  updateAdoptionSchema,
  applyAdoptionSchema,
  createAdoptionCommentSchema,
  applicationStatusUpdateSchema,
  reportAdoptionSchema,
} = require("./adoptions.dto");
const { z } = require("zod");

function validationError(res: any, result: any) {
  const issues = Array.isArray(result?.error?.issues) ? result.error.issues : [];
  const first = issues[0];
  return res.status(400).json({
    success: false,
    message: first?.message || "Validation error",
    code: "VALIDATION_ERROR",
    errors: issues.map((issue: any) => ({
      path: Array.isArray(issue?.path) ? issue.path.join(".") : "",
      message: issue?.message || "Invalid value",
      code: issue?.code || "invalid",
    })),
  });
}

function mapAdoptionCreateError(error: any) {
  const code = String(error?.code || "");
  if (code === "P2003") {
    return {
      status: 400,
      message: "One or more selected location or media values are invalid.",
      code: "ADOPTION_REFERENCE_INVALID",
    };
  }
  if (code === "P2002") {
    return {
      status: 409,
      message: "This adoption listing conflicts with existing data.",
      code: "ADOPTION_CONFLICT",
    };
  }
  return null;
}

exports.listPublic = async (req: any, res: any) => {
  try {
    const parsed = adoptionListQuerySchema.safeParse(req.query || {});
    if (!parsed.success) return validationError(res, parsed);

    const data = await service.listPublicAdoptions({
      ...parsed.data,
      viewerId: req.user?.id ?? null,
    });

    return res.status(200).json({ success: true, data: data.items, meta: data.meta });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to load adoption listings" });
  }
};

exports.getById = async (req: any, res: any) => {
  try {
    const parsed = adoptionIdParamSchema.safeParse(req.params || {});
    if (!parsed.success) return validationError(res, parsed);

    const data = await service.getAdoptionById({
      id: parsed.data.id,
      user: req.user,
    });

    return res.status(200).json({ success: true, data });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to load adoption detail" });
  }
};

exports.create = async (req: any, res: any) => {
  try {
    const userId = Number(req.user?.id || 0);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const parsed = createAdoptionSchema.safeParse(req.body || {});
    if (!parsed.success) return validationError(res, parsed);

    const data = await service.createAdoptionListing({
      userId,
      body: parsed.data,
    });

    return res.status(201).json({ success: true, data });
  } catch (e: any) {
    console.error("[ADOPTION_CREATE]", {
      userId: Number(req.user?.id || 0),
      message: e?.message || "Unknown error",
      code: e?.code,
      statusCode: e?.statusCode,
      countryId: req.body?.countryId,
      bdDivisionId: req.body?.bdDivisionId,
      bdDistrictId: req.body?.bdDistrictId,
      bdUpazilaId: req.body?.bdUpazilaId,
      bdAreaId: req.body?.bdAreaId,
      mediaCount: Array.isArray(req.body?.mediaIds) ? req.body.mediaIds.length : 0,
      hasLatitude: req.body?.latitude !== undefined && req.body?.latitude !== null,
      hasLongitude: req.body?.longitude !== undefined && req.body?.longitude !== null,
      submitNow: Boolean(req.body?.submitNow),
    });

    const mapped = mapAdoptionCreateError(e);
    if (mapped) {
      return res.status(mapped.status).json({
        success: false,
        message: mapped.message,
        code: mapped.code,
      });
    }

    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to create adoption listing" });
  }
};

exports.update = async (req: any, res: any) => {
  try {
    const userId = Number(req.user?.id || 0);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const paramsParsed = adoptionIdParamSchema.safeParse(req.params || {});
    if (!paramsParsed.success) return validationError(res, paramsParsed);

    const bodyParsed = updateAdoptionSchema.safeParse(req.body || {});
    if (!bodyParsed.success) return validationError(res, bodyParsed);

    const data = await service.updateAdoptionListing({
      id: paramsParsed.data.id,
      user: req.user,
      body: bodyParsed.data,
    });

    return res.status(200).json({ success: true, data });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to update adoption listing" });
  }
};

exports.submitReview = async (req: any, res: any) => {
  try {
    const userId = Number(req.user?.id || 0);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const parsed = adoptionIdParamSchema.safeParse(req.params || {});
    if (!parsed.success) return validationError(res, parsed);

    const data = await service.submitAdoptionForReview({
      id: parsed.data.id,
      user: req.user,
    });

    return res.status(200).json({ success: true, data });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to submit adoption listing" });
  }
};

exports.apply = async (req: any, res: any) => {
  try {
    const userId = Number(req.user?.id || 0);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const paramsParsed = adoptionIdParamSchema.safeParse(req.params || {});
    if (!paramsParsed.success) return validationError(res, paramsParsed);

    const bodyParsed = applyAdoptionSchema.safeParse(req.body || {});
    if (!bodyParsed.success) return validationError(res, bodyParsed);

    const data = await service.applyToAdoption({
      id: paramsParsed.data.id,
      userId,
      body: bodyParsed.data,
    });

    return res.status(201).json({ success: true, data });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to apply for adoption" });
  }
};

exports.favorite = async (req: any, res: any) => {
  try {
    const userId = Number(req.user?.id || 0);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const parsed = adoptionIdParamSchema.safeParse(req.params || {});
    if (!parsed.success) return validationError(res, parsed);

    const data = await service.favoriteAdoption({
      id: parsed.data.id,
      userId,
      user: req.user,
    });

    return res.status(200).json({ success: true, data });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to favorite adoption listing" });
  }
};

exports.unfavorite = async (req: any, res: any) => {
  try {
    const userId = Number(req.user?.id || 0);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const parsed = adoptionIdParamSchema.safeParse(req.params || {});
    if (!parsed.success) return validationError(res, parsed);

    const data = await service.unfavoriteAdoption({
      id: parsed.data.id,
      userId,
      user: req.user,
    });

    return res.status(200).json({ success: true, data });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to unfavorite adoption listing" });
  }
};

exports.listComments = async (req: any, res: any) => {
  try {
    const paramsParsed = adoptionIdParamSchema.safeParse(req.params || {});
    if (!paramsParsed.success) return validationError(res, paramsParsed);

    const queryParsed = adoptionCommentListQuerySchema.safeParse(req.query || {});
    if (!queryParsed.success) return validationError(res, queryParsed);

    const data = await service.listComments({
      id: paramsParsed.data.id,
      user: req.user,
      limit: queryParsed.data.limit,
    });

    return res.status(200).json({ success: true, data: data.items, meta: data.meta });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to load comments" });
  }
};

exports.addComment = async (req: any, res: any) => {
  try {
    const userId = Number(req.user?.id || 0);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const paramsParsed = adoptionIdParamSchema.safeParse(req.params || {});
    if (!paramsParsed.success) return validationError(res, paramsParsed);

    const bodyParsed = createAdoptionCommentSchema.safeParse(req.body || {});
    if (!bodyParsed.success) return validationError(res, bodyParsed);

    const data = await service.addComment({
      id: paramsParsed.data.id,
      userId,
      user: req.user,
      body: bodyParsed.data,
    });

    return res.status(201).json({ success: true, data });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to add comment" });
  }
};

exports.deleteComment = async (req: any, res: any) => {
  try {
    const userId = Number(req.user?.id || 0);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const parsed = adoptionCommentIdParamSchema.safeParse(req.params || {});
    if (!parsed.success) return validationError(res, parsed);

    const data = await service.deleteComment({
      id: parsed.data.id,
      commentId: parsed.data.commentId,
      userId,
      user: req.user,
    });

    return res.status(200).json({ success: true, data });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to delete comment" });
  }
};

exports.listMine = async (req: any, res: any) => {
  try {
    const userId = Number(req.user?.id || 0);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const parsed = adoptionListQuerySchema.safeParse(req.query || {});
    if (!parsed.success) return validationError(res, parsed);

    const data = await service.listMyAdoptions({
      userId,
      query: parsed.data,
    });

    return res.status(200).json({ success: true, data: data.items, meta: data.meta });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to load my adoption listings" });
  }
};

exports.listMyApplications = async (req: any, res: any) => {
  try {
    const userId = Number(req.user?.id || 0);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const parsed = adoptionListQuerySchema.safeParse(req.query || {});
    if (!parsed.success) return validationError(res, parsed);

    const data = await service.listMyAdoptionApplications({
      userId,
      query: parsed.data,
    });

    return res.status(200).json({ success: true, data: data.items, meta: data.meta });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to load my adoption applications" });
  }
};

exports.listApplications = async (req: any, res: any) => {
  try {
    const userId = Number(req.user?.id || 0);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const paramsParsed = adoptionIdParamSchema.safeParse(req.params || {});
    if (!paramsParsed.success) return validationError(res, paramsParsed);

    const queryParsed = adoptionListQuerySchema.safeParse(req.query || {});
    if (!queryParsed.success) return validationError(res, queryParsed);

    const isAdmin = Boolean(req.user?.role === "ADMIN" || req.user?.perms?.includes("adoption.read"));

    const data = await service.getApplicationsForListing({
      id: paramsParsed.data.id,
      userId,
      isAdmin,
      query: queryParsed.data,
    });

    return res.status(200).json({ success: true, data: data.items, meta: data.meta });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to load applications" });
  }
};

exports.getApplicationDetail = async (req: any, res: any) => {
  try {
    const userId = Number(req.user?.id || 0);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const paramsParsed = z.object({ applicationId: z.coerce.number().int().positive() }).safeParse(req.params || {});
    if (!paramsParsed.success) return validationError(res, paramsParsed);

    const isAdmin = Boolean(req.user?.role === "ADMIN" || req.user?.perms?.includes("adoption.read"));

    const data = await service.getApplicationDetail({
      applicationId: paramsParsed.data.applicationId,
      userId,
      isAdmin,
    });

    return res.status(200).json({ success: true, data });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to load application detail" });
  }
};

exports.updateApplicationStatus = async (req: any, res: any) => {
  try {
    const userId = Number(req.user?.id || 0);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const paramsParsed = z.object({ applicationId: z.coerce.number().int().positive() }).safeParse(req.params || {});
    if (!paramsParsed.success) return validationError(res, paramsParsed);

    const bodyParsed = applicationStatusUpdateSchema.safeParse(req.body || {});
    if (!bodyParsed.success) return validationError(res, bodyParsed);

    const isAdmin = Boolean(req.user?.role === "ADMIN" || req.user?.perms?.includes("adoption.review"));

    const data = await service.updateApplicationStatus({
      applicationId: paramsParsed.data.applicationId,
      userId,
      isAdmin,
      status: bodyParsed.data.status,
      note: bodyParsed.data.note,
      req,
    });

    return res.status(200).json({ success: true, data });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to update application status" });
  }
};

exports.updateOwnerNotes = async (req: any, res: any) => {
  try {
    const userId = Number(req.user?.id || 0);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const paramsParsed = z.object({ applicationId: z.coerce.number().int().positive() }).safeParse(req.params || {});
    if (!paramsParsed.success) return validationError(res, paramsParsed);

    const bodyParsed = z.object({ notes: z.string().max(2000) }).safeParse(req.body || {});
    if (!bodyParsed.success) return validationError(res, bodyParsed);

    const isAdmin = Boolean(req.user?.role === "ADMIN" || req.user?.perms?.includes("adoption.review"));

    const data = await service.updateOwnerNotes({
      applicationId: paramsParsed.data.applicationId,
      userId,
      isAdmin,
      notes: bodyParsed.data.notes,
    });

    return res.status(200).json({ success: true, data });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to update owner notes" });
  }
};

exports.report = async (req: any, res: any) => {
  try {
    const userId = Number(req.user?.id || 0);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const paramsParsed = adoptionIdParamSchema.safeParse(req.params || {});
    if (!paramsParsed.success) return validationError(res, paramsParsed);

    const bodyParsed = reportAdoptionSchema.safeParse(req.body || {});
    if (!bodyParsed.success) return validationError(res, bodyParsed);

    const data = await service.reportAdoption({
      id: paramsParsed.data.id,
      userId,
      reasonCode: bodyParsed.data.reasonCode,
      details: bodyParsed.data.details,
    });

    return res.status(201).json({ success: true, data });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to report adoption listing" });
  }
};

module.exports = {
  listPublic: exports.listPublic,
  getById: exports.getById,
  create: exports.create,
  update: exports.update,
  submitReview: exports.submitReview,
  apply: exports.apply,
  favorite: exports.favorite,
  unfavorite: exports.unfavorite,
  report: exports.report,
  listMine: exports.listMine,
  listMyApplications: exports.listMyApplications,
  listApplications: exports.listApplications,
  getApplicationDetail: exports.getApplicationDetail,
  updateApplicationStatus: exports.updateApplicationStatus,
  updateOwnerNotes: exports.updateOwnerNotes,
  listComments: exports.listComments,
  addComment: exports.addComment,
  deleteComment: exports.deleteComment,
};
