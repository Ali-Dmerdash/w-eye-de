const mongoose = require("mongoose");

const marketSchema = new mongoose.Schema({}, { strict: false });

// The third parameter here explicitly sets the collection name
const Market = mongoose.model("Market", marketSchema, "Market_LLM_Output");

module.exports = Market;
