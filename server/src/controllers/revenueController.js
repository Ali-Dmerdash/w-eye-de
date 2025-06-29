const revenueService = require("../services/revenueService");
const Revenue = require("../models/Revenue"); // Assuming you have a Revenue model similar to Fraud and Market

exports.predictRevenue = async (req, res) => {
  try {
    const prediction = await revenueService.predictRevenue(req.body);
    res.status(200).json({ success: true, prediction });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getRevenueResults = async (req, res) => {
  try {
    // Find the latest document based on a timestamp field.
    // IMPORTANT: Replace 'createdAt' with the actual name of your timestamp field
    // in the Revenue_LLM_Output collection (or whatever collection your Revenue model points to).
    const latestResult = await Revenue.findOne().sort({ createdAt: -1 });
    res.status(200).json({ success: true, trends: latestResult }); // Keeping 'trends' key for consistency with original response structure
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.runLLM = async (req, res) => {
  try {
    const response = await revenueService.runLLM();
    res.status(200).json({ success: true, message: response });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
