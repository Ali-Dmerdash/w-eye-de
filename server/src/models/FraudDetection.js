const mongoose = require("mongoose");

const FraudDetectionSchema = new mongoose.Schema({
    detectedAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ["Fraud detected", "No fraud"],
        required: true,
    },
    details: { type: String, required: true },
});

module.exports = mongoose.model("FraudDetection", FraudDetectionSchema);
