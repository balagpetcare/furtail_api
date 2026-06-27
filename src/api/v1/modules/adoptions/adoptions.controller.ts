const service = require("./adoptions.service");
const {
  adoptionListQuerySchema,
  adoptionIdParamSchema,
  createAdoptionSchema,
  updateAdoptionSchema,
  applyAdoptionSchema,
} = require("./adoptions.dto");

function validationError(res: any, result: any) {
  const first = result?.error?.errors?.[0];
  return res.status(400).json({
    success: false,
    message: first?.message || "Validation error",
    code: "VALIDATION_ERROR",
  });
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

module.exports = {
  listPublic: exports.listPublic,
  getById: exports.getById,
  create: exports.create,
  update: exports.update,
  submitReview: exports.submitReview,
  apply: exports.apply,
  listMine: exports.listMine,
  listMyApplications: exports.listMyApplications,
};
