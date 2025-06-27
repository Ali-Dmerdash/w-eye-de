const revenueSchema = require("../models/Revenue");

exports.compareRevenue = async (revenueData) => {
  try {
    const revenue = new revenueSchema({
      ...revenueData,
    });

    const savedRevenue = await revenue.save();
    return savedRevenue;
  } catch (err) {
    throw new Error("Error saving Revenue data: " + err.message);
  }
};

exports.getRevenueResults = async () => {
  try {
    const revenueResults = await revenueSchema.find().sort({
      detectedAt: -1,
    });
    return revenueResults;
  } catch (err) {
    throw new Error("Error retrieving Revenue Results: " + err.message);
  }
};

const RevenueInput = require("../models/RevenueInput");
const axios = require("axios");

exports.runLLM = async () => {
  try {
    const requiredFiles = ["company_revenue.txt"]; // Placeholder for required files
    const uploadedFiles = await RevenueInput.find({}).select(
      "originalFileName -_id"
    );
    const uploadedFileNames = uploadedFiles.map(
      (file) => file.originalFileName
    );

    const missingFiles = requiredFiles.filter(
      (file) => !uploadedFileNames.includes(file)
    );

    if (missingFiles.length > 0) {
      throw new Error(`Missing required files: ${missingFiles.join(", ")}`);
    }

    // Call the LLM at localhost:8002 (assuming same port for revenue LLM)
    const llmResponse = await axios.get("http://localhost:8002/run/revenue"); // Placeholder endpoint
    return llmResponse.data;
  } catch (err) {
    throw new Error("Error running Revenue LLM: " + err.message);
  }
};
