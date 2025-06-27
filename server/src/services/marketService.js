const MarketSchema = require("../models/Market");

exports.compareMarket = async (marketData) => {
  try {
    const market = new MarketSchema({
      ...marketData,
    });

    const savedMarket = await market.save();
    return savedMarket;
  } catch (err) {
    throw new Error("Error saving Market Comparison data: " + err.message);
  }
};

exports.getMarketResults = async () => {
  try {
    const marketResults = await MarketSchema.find().sort({
      date: -1,
    });
    return marketResults;
  } catch (err) {
    throw new Error("Error retrieving Market Comparison: " + err.message);
  }
};

const MarketInput = require("../models/marketInput");
const axios = require("axios");

exports.runLLM = async () => {
  try {
    const requiredFiles = ["annual_report_2024.txt", "customer_feedback_summary_q1_2025.txt","balance_sheet_2024.txt","cash_flow_statement_2024.txt","income_statement_2024.txt","marketing_report_q1_2025.txt","operational_report_q1_2025.txt","sales_report_q1_2025.txt","internal_pricing_document.txt","product_roadmap_h2_2025.txt"]; // Placeholder for required files
    const uploadedFiles = await MarketInput.find({}).select(
      "originalFileName -_id"
    );
    console.log("Uploaded files from DB:", uploadedFiles);
    const uploadedFileNames = uploadedFiles.map(
      (file) => file.originalFileName
    );

    const missingFiles = requiredFiles.filter(
      (file) => !uploadedFileNames.includes(file)
    );

    if (missingFiles.length > 0) {
      throw new Error(`Missing required files: ${missingFiles.join(", ")}`);
    }

    // Call the LLM at localhost:8001
    const llmResponse = await axios.get(
      "http://localhost:8003/run/market",
      {}
    ); // Assuming a POST request to /run-llm
    return llmResponse.data;
  } catch (err) {
    throw new Error("Error running LLM: " + err.message);
  }
};
