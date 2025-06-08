const mongoose = require("mongoose");
const dataSchema = new mongoose.Schema({
  originalFileName: String,
  uploadedAt: Date,
  content: String,
  agent: String, // Added agent field
});
module.exports = mongoose.model("Data", dataSchema);
