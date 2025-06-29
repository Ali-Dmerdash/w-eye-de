const Fraud = require("../models/FraudDetection");
const fraudService = require("../services/fraudService");

exports.detectFraud = async (req, res) => {
  try {
    const fraudData = req.body;
    const result = await fraudService.detectFraud(fraudData);
    res.status(200).json({ success: true, result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAllFraudHistory = async (req, res, next) => {
  try {
    // Find the latest document based on the 'detectedAt' field
    // Assuming 'detectedAt' is the field that stores the timestamp of the fraud detection.
    // If your timestamp field has a different name, please replace 'detectedAt' with the correct field name.
    const latestResult = await Fraud.findOne().sort({ detectedAt: -1 });
    res.status(200).json(latestResult);
  } catch (error) {
    next(error);
  }
};

exports.runLLM = async (req, res) => {
  try {
    const response = await fraudService.runLLM();
    res.status(200).json({ success: true, message: response });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
