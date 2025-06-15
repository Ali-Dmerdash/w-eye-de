const pdfParse = require("pdf-parse");
const DataModel = require("../models/Data");
const FraudInput = require("../models/FraudInput");
const MarketInput = require("../models/MarketInput");
const RevenueInput = require("../models/RevenueInput");

exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const agent = req.body.agent; // Extract agent from request
    console.log("Received agent:", agent); // Added log

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
    } else if (
      file.mimetype === "text/plain" ||
      file.originalname.endsWith(".txt")
    ) {
      extractedText = file.buffer.toString("utf-8");
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Unsupported file type" });
    }

    const commonData = {
      content: extractedText,
      originalFileName: file.originalname, // Note: This was reverted in your provided code. If you want .txt, we can change it back later.
      uploadedAt: new Date(),
      agent: agent,
    };

    // Save to general 'datas' collection
    const dataDoc = new DataModel(commonData);
    await dataDoc.save();
    console.log("Saved to datas collection."); // Added log

    // Save to agent-specific input collection
    switch (agent) {
      case "Public Agent":
        console.log("Public Agent data - only to general collection.");
        break;
      case "Fraud Agent":
        try {
          const fraudDoc = new FraudInput(commonData);
          await fraudDoc.save();
          console.log("Saved to Fraud_LLM_Input."); // Added log
        } catch (error) {
          console.error("Error saving to Fraud_LLM_Input:", error); // Added error log
        }
        break;
      case "Market Agent":
        try {
          const marketDoc = new MarketInput(commonData);
          await marketDoc.save();
          console.log("Saved to Market_LLM_Input."); // Added log
        } catch (error) {
          console.error("Error saving to Market_LLM_Input:", error); // Added error log
        }
        break;
      case "Revenue Agent":
        try {
          const revenueDoc = new RevenueInput(commonData);
          await revenueDoc.save();
          console.log("Saved to Revenue_LLM_Input."); // Added log
        } catch (error) {
          console.error("Error saving to Revenue_LLM_Input:", error); // Added error log
        }
        break;
      default:
        console.log("No specific agent collection for: ", agent);
        break;
    }

    res.status(200).json({
      success: true,
      message: "File content saved to DB",
      content: extractedText,
    });
  } catch (err) {
    console.error("Overall upload error:", err); // Modified log
    res.status(500).json({ success: false, message: err.message });
  }
};
