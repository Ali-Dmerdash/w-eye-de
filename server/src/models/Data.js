const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  originalFileName: String,
  content: String,
  uploadedAt: Date,
});

module.exports = mongoose.model("Data", dataSchema);
