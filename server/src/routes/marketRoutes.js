const express = require("express");
const marketRouter = express.Router();
const marketController = require("../controllers/marketController");

marketRouter.post("/compare", marketController.compareMarket);
marketRouter.get("/results", marketController.getMarketResults);
marketRouter.get("/LLMRun", marketController.runLLM);

module.exports = marketRouter;
