const express = require("express");
const marketRouter = express.Router();
const marketController = require("../controllers/marketController");

marketRouter.post("/compare", marketController.compareMarket);
marketRouter.get("/results", marketController.getMarketResults);

module.exports = marketRouter;
