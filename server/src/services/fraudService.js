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

const FraudInput = require("../models/fraudInput");
const axios = require("axios");

exports.runLLM = async () => {
  try {
    const requiredFiles = ["file1.txt", "file2.txt"]; // Placeholder for required files
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

    const llmResponse = await axios.post("http://localhost:8000/run/fraud", {});
    return llmResponse.data;
  } catch (err) {
    throw new Error("Error running Fraud LLM: " + err.message);
  }
};
