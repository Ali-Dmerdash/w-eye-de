const mongoose = require("mongoose");

const StatsSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    reportType: { type: String, required: true },
    details: { type: String, required: true },
});

module.exports = mongoose.model("Stats", StatsSchema);
