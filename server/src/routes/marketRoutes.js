const express = require("express");
const marketRouter = express.Router();
const marketController = require("../controllers/marketController");

marketRouter.post("/compare", marketController.compareMarket);
marketRouter.get("/results", marketController.getMarketResults);
marketRouter.get("/LLMRun", marketController.runLLM);
marketRouter.get("/pdf", marketController.downloadLatestMarketPDF);
marketRouter.get("/download-report", marketController.downloadMarketReport);

module.exports = marketRouter;
