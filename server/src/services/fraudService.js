const FraudDetection = require("../models/FraudDetection");

exports.detectFraud = async (fraudData) => {
    try {
        const fraud = new FraudDetection({
            ...fraudData,
        });

        const savedFraud = await fraud.save();
        return savedFraud;
    } catch (err) {
        throw new Error("Error saving fraud detection data: " + err.message);
    }
};

exports.getFraudHistory = async () => {
    try {
        const fraudHistory = await FraudDetection.find().sort({
            detectedAt: -1,
        });
        return fraudHistory;
    } catch (err) {
        throw new Error("Error retrieving fraud history: " + err.message);
    }
};
