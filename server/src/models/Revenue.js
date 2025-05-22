const mongoose = require("mongoose");

const revenueSchema = new mongoose.Schema({}, { strict: false });

// The third parameter here explicitly sets the collection name
const Revenue = mongoose.model("Revenue", revenueSchema, "Revenue_LLM_Output");

module.exports = Revenue;
