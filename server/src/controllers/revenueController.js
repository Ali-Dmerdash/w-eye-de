const revenueService = require("../services/revenueService");

exports.predictRevenue = async (req, res) => {
  try {
    const prediction = await revenueService.predictRevenue(req.body);
    res.status(200).json({ success: true, prediction });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getRevenueTrends = async (req, res) => {
  try {
    const trends = await revenueService.getRevenueTrends();
    res.status(200).json({ success: true, trends });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
