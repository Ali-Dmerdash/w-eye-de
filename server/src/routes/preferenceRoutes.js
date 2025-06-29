const express = require("express");
const router = express.Router();
const preferenceController = require("../controllers/preferenceController");

// POST /api/preference - Save user preference
router.post("/", preferenceController.savePreference);

module.exports = router;
