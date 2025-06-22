const express = require("express");
const revenueRouter = express.Router();
const revenueController = require("../controllers/revenueController");

revenueRouter.post("/predict", revenueController.predictRevenue);
revenueRouter.get("/results", revenueController.getRevenueResults);

revenueRouter.get("/LLMRun", revenueController.runLLM);

module.exports = revenueRouter;
