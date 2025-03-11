const fraudService = require("../services/fraudService");

exports.detectFraud = async (req, res) => {
    try {
        // Assuming the fraud detection data comes in the request body
        const fraudData = req.body;

        // Save fraud detection result
        const result = await fraudService.detectFraud(fraudData); // Pass user id from token
        res.status(200).json({ success: true, result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getAllFraudHistory = async (req, res) => {
    try {
        const history = await fraudService.getFraudHistory();
        res.status(200).json({ success: true, history });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
