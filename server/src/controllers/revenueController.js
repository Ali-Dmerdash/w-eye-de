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
    // Get all revenue data sorted by createdAt in descending order (latest first)
    const results = await Revenue.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, trends: results }); // Keeping 'trends' key for consistency with original response structure
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

exports.downloadRevenueReport = async (req, res) => {
  try {
    // Get the latest revenue data
    const latestRevenue = await Revenue.findOne().sort({ createdAt: -1 });

    if (!latestRevenue) {
      return res.status(404).json({ 
        success: false, 
        message: "No revenue data found" 
      });
    }

    // Create a comprehensive report object
    const report = {
      reportType: "Revenue Analysis Report",
      generatedAt: new Date().toISOString(),
      data: latestRevenue,
      summary: {
        totalRevenue: latestRevenue.total_revenue,
        growthRate: latestRevenue.growth_rate,
        forecastPeriod: latestRevenue.forecast_period,
        keyFactors: latestRevenue.key_factors,
        analysis: latestRevenue.analysis
      }
    };

    // Set headers for JSON download
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="revenue-report-${new Date().toISOString().split('T')[0]}.json"`
    );

    // Send the JSON report
    res.json(report);
  } catch (error) {
    console.error("Error downloading revenue report:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error generating revenue report" 
    });
  }
};
