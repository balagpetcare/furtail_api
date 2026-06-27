const service = require("./adoptions.service");
const {
  adoptionIdParamSchema,
  adminAdoptionListQuerySchema,
  adminAdoptionActionSchema,
  adminCountryRuleCreateSchema,
  adminCountryRuleUpdateSchema,
} = require("./adoptions.dto");

function validationError(res: any, result: any) {
  const first = result?.error?.errors?.[0];
  return res.status(400).json({
    success: false,
    message: first?.message || "Validation error",
    code: "VALIDATION_ERROR",
  });
}

function getNote(body: any) {
  return body?.note || body?.reason || undefined;
}

exports.list = async (req: any, res: any) => {
  try {
    const parsed = adminAdoptionListQuerySchema.safeParse(req.query || {});
    if (!parsed.success) return validationError(res, parsed);
    const data = await service.adminListAdoptions({ query: parsed.data, user: req.user });
    return res.status(200).json({ success: true, data: data.items, meta: data.meta });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to load admin adoption list" });
  }
};

exports.pending = async (req: any, res: any) => {
  try {
    const parsed = adminAdoptionListQuerySchema.safeParse(req.query || {});
    if (!parsed.success) return validationError(res, parsed);
    const data = await service.adminListPendingAdoptions({ query: parsed.data, user: req.user });
    return res.status(200).json({ success: true, data: data.items, meta: data.meta });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to load pending adoption list" });
  }
};

exports.reports = async (req: any, res: any) => {
  try {
    const parsed = adminAdoptionListQuerySchema.safeParse(req.query || {});
    if (!parsed.success) return validationError(res, parsed);
    const data = await service.adminListAdoptionReports({ query: parsed.data });
    return res.status(200).json({ success: true, data: data.items, meta: data.meta });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to load adoption reports" });
  }
};

exports.getById = async (req: any, res: any) => {
  try {
    const parsed = adoptionIdParamSchema.safeParse(req.params || {});
    if (!parsed.success) return validationError(res, parsed);
    const data = await service.adminGetAdoptionById({ id: parsed.data.id, user: req.user });
    return res.status(200).json({ success: true, data });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to load adoption detail" });
  }
};

async function runAction(req: any, res: any, handler: Function, fallbackMessage: string) {
  const paramsParsed = adoptionIdParamSchema.safeParse(req.params || {});
  if (!paramsParsed.success) return validationError(res, paramsParsed);
  const bodyParsed = adminAdoptionActionSchema.safeParse(req.body || {});
  if (!bodyParsed.success) return validationError(res, bodyParsed);

  try {
    const data = await handler({
      id: paramsParsed.data.id,
      user: req.user,
      note: getNote(bodyParsed.data),
      req,
    });
    return res.status(200).json({ success: true, data });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || fallbackMessage });
  }
}

exports.approve = async (req: any, res: any) => runAction(req, res, service.adminApproveAdoption, "Failed to approve adoption listing");
exports.reject = async (req: any, res: any) => runAction(req, res, service.adminRejectAdoption, "Failed to reject adoption listing");
exports.requestChanges = async (req: any, res: any) => runAction(req, res, service.adminRequestAdoptionChanges, "Failed to request changes");
exports.pause = async (req: any, res: any) => runAction(req, res, service.adminPauseAdoption, "Failed to pause adoption listing");
exports.remove = async (req: any, res: any) => runAction(req, res, service.adminRemoveAdoption, "Failed to remove adoption listing");

exports.listCountryRules = async (req: any, res: any) => {
  try {
    const data = await service.adminListCountryRules({ query: req.query || {} });
    return res.status(200).json({ success: true, data });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to load adoption country rules" });
  }
};

exports.createCountryRule = async (req: any, res: any) => {
  const parsed = adminCountryRuleCreateSchema.safeParse(req.body || {});
  if (!parsed.success) return validationError(res, parsed);
  try {
    const data = await service.adminCreateCountryRule({ body: parsed.data, req });
    return res.status(201).json({ success: true, data });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to create adoption country rule" });
  }
};

exports.updateCountryRule = async (req: any, res: any) => {
  const paramsParsed = adoptionIdParamSchema.safeParse(req.params || {});
  if (!paramsParsed.success) return validationError(res, paramsParsed);
  const bodyParsed = adminCountryRuleUpdateSchema.safeParse(req.body || {});
  if (!bodyParsed.success) return validationError(res, bodyParsed);
  try {
    const data = await service.adminUpdateCountryRule({ id: paramsParsed.data.id, body: bodyParsed.data, req });
    return res.status(200).json({ success: true, data });
  } catch (e: any) {
    const status = e?.statusCode || 500;
    return res.status(status).json({ success: false, message: e?.message || "Failed to update adoption country rule" });
  }
};

module.exports = {
  list: exports.list,
  pending: exports.pending,
  reports: exports.reports,
  getById: exports.getById,
  approve: exports.approve,
  reject: exports.reject,
  requestChanges: exports.requestChanges,
  pause: exports.pause,
  remove: exports.remove,
  listCountryRules: exports.listCountryRules,
  createCountryRule: exports.createCountryRule,
  updateCountryRule: exports.updateCountryRule,
};
