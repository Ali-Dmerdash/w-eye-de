const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/user/singleProfile", authController.getSingleProfile);
router.get("/user/allProfiles", authController.getAllProfiles);
router.put("/user/update", authController.updateProfile);

module.exports = router;
