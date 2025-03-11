const express = require("express");
const fraudController = require("../controllers/fraudController");
const { authenticate } = require("../middleware/auth");

const fraudRouter = express.Router();

// Protecting the POST and GET requests with authentication middleware
fraudRouter.post("/detect/:userId", authenticate, fraudController.detectFraud);
fraudRouter.get("/results", authenticate, fraudController.getAllFraudHistory);

module.exports = fraudRouter;
