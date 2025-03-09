const mongoose = require("mongoose");

const RevenueSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  revenue: { type: Number, required: true },
  details: { type: String, required: true },
});

module.exports = mongoose.model("Revenue", RevenueSchema);
