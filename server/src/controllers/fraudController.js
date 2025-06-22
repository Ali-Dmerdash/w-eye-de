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
    const results = await Fraud.find({});
    res.status(200).json(results);
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
