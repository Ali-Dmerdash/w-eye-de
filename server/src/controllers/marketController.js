const marketService = require("../services/marketService");

exports.compareMarket = async (req, res) => {
    try {
        const comparison = await marketService.compareMarket(req.body);
        res.status(200).json({ success: true, comparison });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getMarketResults = async (req, res) => {
    try {
        const results = await marketService.getMarketResults();
        res.status(200).json({ success: true, results });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
