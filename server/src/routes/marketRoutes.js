const express = require("express");
const marketRouter = express.Router();
const { authenticate } = require("../middleware/auth");
const marketController = require("../controllers/marketController");

marketRouter.post("/compare", authenticate, marketController.compareMarket);
marketRouter.get(
    "/benchmark",
    authenticate,
    marketController.getMarketBenchmark,
);

module.exports = marketRouter;
