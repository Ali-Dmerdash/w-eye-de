const Fraud = require("../models/FraudDetection");
const { FraudReport } = require("../models/Report");
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

exports.downloadLatestFraudPDF = async (req, res) => {
  try {
    // Find the latest report based on created_at date
    const report = await FraudReport.findOne().sort({ created_at: -1 });

    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "No fraud reports found" });
    }

    // Set headers for PDF download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${report.filename}"`
    );
    res.setHeader("Content-Length", report.pdf.length);

    // Send the PDF buffer
    res.send(report.pdf);
  } catch (error) {
    console.error("Error downloading latest fraud PDF:", error);
    res.status(500).json({ success: false, message: "Error downloading PDF" });
  }
};
