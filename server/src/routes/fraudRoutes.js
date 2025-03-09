const express = require("express");

const fraudRouter = express.Router();
const fraudController = require("../controllers/fraudController");

fraudRouter.post("/detect", fraudController.detectFraud);
fraudRouter.get("/history", fraudController.getFraudHistory);

module.exports = fraudRouter;
