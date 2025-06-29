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
    // Find the latest document based on a timestamp field.
    // IMPORTANT: Replace 'createdAt' with the actual name of your timestamp field
    // in the Market_LLM_Output collection (or whatever collection your Market model points to).
    const latestResult = await Market.findOne().sort({ createdAt: -1 });
    res.status(200).json(latestResult);
  } catch (err) {
    // Changed 'error' to 'err' for consistency with other catch blocks
    next(err);
  }
};

exports.runLLM = async (req, res) => {
  try {
    const response = await marketService.runLLM();
    res.status(200).json({ success: true, message: response });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
