const revenueService = require("../services/revenueService");
const Revenue = require("../models/Revenue"); // Assuming you have a Revenue model similar to Fraud and Market
const { RevenueReport } = require("../models/Report");

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

exports.downloadLatestRevenuePDF = async (req, res) => {
  try {
    // Find the latest report based on created_at date
    const report = await RevenueReport.findOne().sort({ created_at: -1 });

    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "No revenue reports found" });
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
    console.error("Error downloading latest revenue PDF:", error);
    res.status(500).json({ success: false, message: "Error downloading PDF" });
  }
};
