const FraudDetection = require("../models/FraudDetection");

exports.detectFraud = async (fraudData) => {
  try {
    const fraud = new FraudDetection({
      ...fraudData,
    });

    const savedFraud = await fraud.save();
    return savedFraud;
  } catch (err) {
    throw new Error("Error saving fraud detection data: " + err.message);
  }
};

exports.getFraudHistory = async () => {
  try {
    const fraudHistory = await FraudDetection.find().sort({
      detectedAt: -1,
    });
    return fraudHistory;
  } catch (err) {
    throw new Error("Error retrieving fraud history: " + err.message);
  }
};

// New function to generate fraud detection report
exports.generateFraudReport = async () => {
  try {
    // Get the latest fraud data first
    const fraudHistory = await FraudDetection.find().sort({
      createdAt: -1,
    });

    // Generate report data
    const reportData = {
      generatedAt: new Date().toISOString(),
      totalRecords: fraudHistory.length,
      summary: {
        totalFraudCases: fraudHistory.filter(item => item.isFraudulent).length,
        totalLegitimateCases: fraudHistory.filter(item => !item.isFraudulent).length,
        fraudRate: fraudHistory.length > 0 ? 
          ((fraudHistory.filter(item => item.isFraudulent).length / fraudHistory.length) * 100).toFixed(2) + '%' : '0%'
      },
      recentCases: fraudHistory.slice(0, 10), // Last 10 cases
      analysis: fraudHistory[0]?.analysis || null
    };

    return reportData;
  } catch (err) {
    throw new Error("Error generating fraud report: " + err.message);
  }
};

const FraudInput = require("../models/fraudInput");
const axios = require("axios");

exports.runLLM = async () => {
  try {
    const requiredFiles = ["sample_db.embeddings.csv"]; // Placeholder for required files
    const uploadedFiles = await FraudInput.find({}).select(
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

    const llmResponse = await axios.get("http://localhost:8001/run/fraud", {});
    return llmResponse.data;
  } catch (err) {
    throw new Error("Error running Fraud LLM: " + err.message);
  }
};
