const Market = require("../models/Market"); // Assuming similar model structure
const { MarketReport } = require("../models/Report");
const marketService = require("../services/marketService");

exports.compareMarket = async (req, res) => {
  try {
    const comparison = await marketService.compareMarket(req.body);
    res.status(200).json({ success: true, comparison });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMarketResults = async (req, res, next) => {
  try {
    // Get all market data sorted by createdAt in descending order (latest first)
    const results = await Market.find({}).sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (err) {
    // Changed 'error' to 'err' for consistency with other catch blocks
    next(err);
  }
};

exports.runLLM = async (req, res) => {
  try {
    const response = await marketService.runLLM();
    res.status(200).json({ success: true, message: response });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.downloadLatestMarketPDF = async (req, res) => {
  try {
    // Find the latest report based on created_at date
    const report = await MarketReport.findOne().sort({ created_at: -1 });

    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "No market reports found" });
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
    console.error("Error downloading latest market PDF:", error);
    res.status(500).json({ success: false, message: "Error downloading PDF" });
  }
};

exports.downloadMarketReport = async (req, res) => {
  try {
    // Get the latest market data
    const latestMarket = await Market.findOne().sort({ createdAt: -1 });

    if (!latestMarket) {
      return res.status(404).json({ 
        success: false, 
        message: "No market data found" 
      });
    }

    // Create a comprehensive report object
    const report = {
      reportType: "Market Analysis Report",
      generatedAt: new Date().toISOString(),
      data: latestMarket,
      summary: {
        marketSize: latestMarket.market_size,
        growthRate: latestMarket.growth_rate,
        competitivePosition: latestMarket.competitive_position,
        swotAnalysis: {
          strengths: latestMarket.strengths,
          weaknesses: latestMarket.weaknesses,
          opportunities: latestMarket.opportunities,
          threats: latestMarket.threats
        },
        analysis: latestMarket.analysis
      }
    };

    // Set headers for JSON download
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="market-analysis-report-${new Date().toISOString().split('T')[0]}.json"`
    );

    // Send the JSON report
    res.json(report);
  } catch (error) {
    console.error("Error downloading market report:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error generating market report" 
    });
  }
};
