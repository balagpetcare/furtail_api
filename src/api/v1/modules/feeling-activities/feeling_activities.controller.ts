const svc = require("./feeling_activities.service");

/**
 * GET /api/v1/feeling-activities
 * Query params:
 *   type        : FEELING | ACTIVITY (optional filter)
 *   category    : string (optional filter)
 *   petSpecific : boolean (optional filter)
 *   q           : string (search labelEn)
 */
async function list(req, res, next) {
  try {
    const { type, category, petSpecific, q } = req.query;
    const items = await svc.list({
      type: type || undefined,
      category: category || undefined,
      petSpecific: petSpecific !== undefined ? petSpecific === "true" : undefined,
      q: q || undefined,
    });
    return res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
}

module.exports = { list };
export {};
