const mongoose = require("mongoose");

const MarketSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    industry: { type: String, required: true },
    competitors: { type: [String], required: true },
    benchmark: { type: String, required: true },
});

module.exports = mongoose.model("Market", MarketSchema);
