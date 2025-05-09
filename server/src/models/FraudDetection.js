const mongoose = require("mongoose");

const fraudSchema = new mongoose.Schema({}, { strict: false });

// The third parameter here explicitly sets the collection name
const Fraud = mongoose.model("Fraud", fraudSchema, "Fraud_LLM_Output");

module.exports = Fraud;
