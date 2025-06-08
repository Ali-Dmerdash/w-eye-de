const pdfParse = require("pdf-parse");
const DataModel = require("../models/Data");

exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const agent = req.body.agent; // Extract agent from request body
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    let extractedText = "";

    if (file.mimetype === "application/pdf") {
      const parsed = await pdfParse(file.buffer);
      extractedText = parsed.text;
    } else if (
      file.mimetype === "text/csv" ||
      file.originalname.endsWith(".csv")
    ) {
      extractedText = file.buffer.toString("utf-8");
    } else if (
      file.mimetype === "application/json" ||
      file.originalname.endsWith(".json")
    ) {
      extractedText = file.buffer.toString("utf-8");
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Unsupported file type" });
    }

    const dataDoc = new DataModel({
      content: extractedText,
      originalFileName: file.originalname,
      uploadedAt: new Date(),
      agent: agent, // Save the agent information
    });
    await dataDoc.save();

    res.status(200).json({
      success: true,
      message: "File content saved to DB",
      content: extractedText,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
