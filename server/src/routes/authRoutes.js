const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/user/singleProfile/:userId", authController.getSingleProfile);
router.get("/user/allProfiles", authController.getAllProfiles);
router.delete(
    "/user/singleProfile/:userId",
    authController.deleteSingleProfile,
);
router.delete("/user/allProfiles", authController.deleteAllProfiles);
router.put("/user/update/:userId", authController.updateProfile);

module.exports = router;
