const mongoose = require("mongoose");
const revenueInputSchema = new mongoose.Schema(
  {
    originalFileName: String,
    content: String,
    uploadedAt: Date,
    agent: String,
  },
  { collection: "Revenue_LLM_Input" }
); // Explicitly define

module.exports =
  mongoose.models.Revenue_LLM_Input ||
  mongoose.model("Revenue_LLM_Input", revenueInputSchema);
