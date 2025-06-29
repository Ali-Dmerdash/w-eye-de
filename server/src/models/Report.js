const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    pdf: {
      type: Buffer,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    llm_type: {
      type: String,
      required: true,
      enum: ["fraud", "market", "revenue"],
    },
  },
  { strict: false }
);

// Create models for each collection
const FraudReport = mongoose.model("FraudReport", reportSchema, "Fraud_Report");
const MarketReport = mongoose.model(
  "MarketReport",
  reportSchema,
  "Market_Report"
);
const RevenueReport = mongoose.model(
  "RevenueReport",
  reportSchema,
  "Revenue_Report"
);

module.exports = {
  FraudReport,
  MarketReport,
  RevenueReport,
};
