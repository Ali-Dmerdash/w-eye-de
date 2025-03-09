const express = require("express");
const marketRouter = express.Router();
const marketController = require("../controllers/marketController");

marketRouter.post("/compare", marketController.compareMarket);
marketRouter.get("/benchmark", marketController.getMarketBenchmark);

module.exports = marketRouter;
