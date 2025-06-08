const mongoose = require("mongoose");
const dataSchema = new mongoose.Schema({
  originalFileName: String,
  agent: String, // Added agent field
  uploadedAt: Date,
  content: String,
});
module.exports = mongoose.model("Data", dataSchema);
