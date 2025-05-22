const Data = require("../models/Data");

exports.saveExtractedData = async (payload) => {
  try {
    const doc = new Data(payload);
    const saved = await doc.save();
    return saved;
  } catch (err) {
    throw new Error("Error saving extracted data: " + err.message);
  }
};
