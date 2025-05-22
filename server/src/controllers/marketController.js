const Market = require("../models/Market");
const marketService = require("../services/marketService");

exports.compareMarket = async (req, res) => {
  try {
    const comparison = await marketService.compareMarket(req.body);
    res.status(200).json({ success: true, comparison });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMarketResults = async (req, res, next) => {
  try {
    const results = await Market.find({});
    res.status(200).json(results);
  } catch (err) {
    next(error);
  }
};
