const mongoose = require("mongoose");

const MarketInputSchema = new mongoose.Schema(
  {
    originalFileName: String,
    content: String,
    uploadedAt: Date,
    agent: String,
  },
  { collection: "Market_LLM_Input" }
);

module.exports =
  mongoose.models.Market_LLM_Input ||
  mongoose.model("Market_LLM_Input", MarketInputSchema);
