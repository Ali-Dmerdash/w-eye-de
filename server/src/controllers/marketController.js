const marketService = require("../services/marketService");

exports.compareMarket = async (req, res) => {
  try {
    const comparison = await marketService.compareMarket(req.body);
    res.status(200).json({ success: true, comparison });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMarketBenchmark = async (req, res) => {
  try {
    const benchmark = await marketService.getMarketBenchmark();
    res.status(200).json({ success: true, benchmark });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
