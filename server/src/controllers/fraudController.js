const fraudService = require("../services/fraudService");

exports.detectFraud = async (req, res) => {
  try {
    const result = await fraudService.detectFraud(req.body);
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getFraudHistory = async (req, res) => {
  try {
    const history = await fraudService.getFraudHistory();
    res.status(200).json({ success: true, history });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
