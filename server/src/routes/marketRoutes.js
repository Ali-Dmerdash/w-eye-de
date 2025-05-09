const express = require("express");
const marketRouter = express.Router();
const { authenticate } = require("../middleware/auth");
const marketController = require("../controllers/marketController");

marketRouter.post("/compare", authenticate, marketController.compareMarket);
marketRouter.get("/results", authenticate, marketController.getMarketResults);

module.exports = marketRouter;
