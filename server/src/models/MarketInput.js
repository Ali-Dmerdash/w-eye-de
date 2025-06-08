const mongoose = require("mongoose");
const marketInputSchema = new mongoose.Schema(
  {
    originalFileName: String,
    content: String,
    uploadedAt: Date,
    agent: String,
  },
  { collection: "Market_LLM_Input" }
); // Explicitly define
module.exports = mongoose.model("Market_LLM_Input", marketInputSchema);
