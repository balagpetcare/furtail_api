const router = require("express").Router();
const ctrl = require("./feeling_activities.controller");

// Public: list active feeling/activity items
router.get("/", ctrl.list);

module.exports = router;
export {};
