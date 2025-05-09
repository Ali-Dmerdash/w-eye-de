const express = require("express");
const revenueRouter = express.Router();
const revenueController = require("../controllers/revenueController");

revenueRouter.post("/predict", revenueController.predictRevenue);
revenueRouter.get("/trends", revenueController.getRevenueTrends);
revenueRouter.patch("/update", revenueController.updateRevenue);

module.exports = revenueRouter;
