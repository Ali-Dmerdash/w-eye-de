const express = require("express");
const fraudController = require("../controllers/fraudController");

const fraudRouter = express.Router();

// Protecting the POST and GET requests with authentication middleware
fraudRouter.post("/detect", fraudController.detectFraud);
fraudRouter.get("/results", fraudController.getAllFraudHistory);
fraudRouter.get("/download-report", fraudController.downloadFraudReport);
fraudRouter.get("/LLMRun", fraudController.runLLM);
fraudRouter.get("/pdf", fraudController.downloadLatestFraudPDF);

module.exports = fraudRouter;
