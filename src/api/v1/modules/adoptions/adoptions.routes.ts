const express = require("express");

const auth = require("../../../../middleware/auth.middleware");
const optionalAuth = require("../../../../middlewares/optionalAuth");
const controller = require("./adoptions.controller");

const router = express.Router();
const meRouter = express.Router();

router.get("/", optionalAuth, controller.listPublic);
router.get("/:id/comments", optionalAuth, controller.listComments);
router.post("/:id/comments", auth, controller.addComment);
router.delete("/:id/comments/:commentId", auth, controller.deleteComment);
router.get("/:id", optionalAuth, controller.getById);
router.post("/", auth, controller.create);
router.patch("/:id", auth, controller.update);
router.post("/:id/submit-review", auth, controller.submitReview);
router.post("/:id/apply", auth, controller.apply);
router.post("/:id/favorite", auth, controller.favorite);
router.delete("/:id/favorite", auth, controller.unfavorite);
router.post("/:id/report", auth, controller.report);


meRouter.get("/adoptions", auth, controller.listMine);
meRouter.get("/adoption-applications", auth, controller.listMyApplications);
meRouter.get("/adoptions/:id/applications", auth, controller.listApplications);
meRouter.get("/adoption-applications/:applicationId", auth, controller.getApplicationDetail);
meRouter.post("/adoption-applications/:applicationId/status", auth, controller.updateApplicationStatus);
meRouter.patch("/adoption-applications/:applicationId/notes", auth, controller.updateOwnerNotes);

module.exports = router;
module.exports.meRouter = meRouter;

export {};
