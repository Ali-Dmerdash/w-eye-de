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
    // Get all fraud data sorted by createdAt in descending order (latest first)
    const results = await Fraud.find({}).sort({ createdAt: -1 });
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

exports.downloadLatestFraudPDF = async (req, res) => {
  try {
    // Find the latest report based on created_at date
    const report = await FraudReport.findOne().sort({ created_at: -1 });

    if (!report || !report.pdf) {
      return res
        .status(404)
        .json({ success: false, message: "No fraud reports found or PDF missing" });
    }

    // If the PDF is stored as base64, convert it to Buffer
    let pdfBuffer = report.pdf;
    if (typeof pdfBuffer === 'string') {
      pdfBuffer = Buffer.from(pdfBuffer, 'base64');
    } else if (pdfBuffer && pdfBuffer.type === 'Buffer' && Array.isArray(pdfBuffer.data)) {
      pdfBuffer = Buffer.from(pdfBuffer.data);
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${report.filename || 'fraud_detection_report.pdf'}"`
    );
    res.setHeader("Content-Length", pdfBuffer.length);

    // Send the PDF buffer
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error downloading latest fraud PDF:", error);
    res.status(500).json({ success: false, message: "Error downloading PDF" });
  }
};

// New function to download fraud report
exports.downloadFraudReport = async (req, res) => {
  try {
    const reportData = await fraudService.generateFraudReport();
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="fraud-detection-report-${new Date().toISOString().split('T')[0]}.json"`);
    
    res.status(200).json(reportData);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getFraudReportPDF = async (req, res, next) => {
  try {
    // Get the latest fraud report
    const report = await Fraud.findOne().sort({ created_at: -1 });

    if (!report || !report.pdf) {
      return res.status(404).json({ message: "No PDF report found" });
    }

    let pdfBuffer;

    // Handle BSON Binary (what you have in your DB)
    if (report.pdf && report.pdf._bsontype === "Binary" && report.pdf.buffer) {
      pdfBuffer = report.pdf.buffer;
    } else if (Buffer.isBuffer(report.pdf)) {
      pdfBuffer = report.pdf;
    } else if (typeof report.pdf === "string") {
      // If base64 string, decode it
      pdfBuffer = Buffer.from(report.pdf, "base64");
    } else if (report.pdf && report.pdf.base64) {
      // If it's a plain object with base64 (rare, but possible)
      pdfBuffer = Buffer.from(report.pdf.base64, "base64");
    } else {
      return res.status(500).json({ message: "Unknown PDF format in database" });
    }

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=fraud_report.pdf",
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};
