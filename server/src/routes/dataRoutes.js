const express = require("express");
const multer = require("multer");
const dataController = require("../controllers/dataController");

const dataRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

dataRouter.post("/upload", upload.single("file"), dataController.uploadFile);

module.exports = dataRouter;
