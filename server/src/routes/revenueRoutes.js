const express = require("express");
const revenueRouter = express.Router();
const revenueController = require("../controllers/revenueController");

revenueRouter.post("/predict", revenueController.predictRevenue);
revenueRouter.get("/results", revenueController.getRevenueTrends);

module.exports = revenueRouter;
