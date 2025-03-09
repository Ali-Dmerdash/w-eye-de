const statsService = require("../services/statsService");

exports.generateStats = async (req, res) => {
  try {
    const stats = await statsService.generateStats(req.body);
    res.status(200).json({ success: true, stats });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.viewStats = async (req, res) => {
  try {
    const stats = await statsService.viewStats();
    res.status(200).json({ success: true, stats });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateStats = async (req, res) => {
  try {
    const updatedStats = await statsService.updateStats(req.body);
    res.status(200).json({ success: true, updatedStats });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
