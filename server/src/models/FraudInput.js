const mongoose = require("mongoose");
const fraudInputSchema = new mongoose.Schema(
  {
    originalFileName: String,
    content: String,
    uploadedAt: Date,
    agent: String,
  },
  { collection: "Fraud_LLM_Input" }
); // Explicitly define
module.exports = mongoose.model("Fraud_LLM_Input", fraudInputSchema);
