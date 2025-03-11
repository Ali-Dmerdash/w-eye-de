const MarketSchema = require("../models/Market");

exports.compareMarket = async (marketData) => {
    try {
        const market = new MarketSchema({
            ...marketData,
        });

        const savedMarket = await market.save();
        return savedMarket;
    } catch (err) {
        throw new Error("Error saving Market Comparison data: " + err.message);
    }
};

exports.getMarketBenchmark = async () => {
    try {
        const marketBenchmark = await MarketSchema.find().sort({
            date: -1,
        });
        return marketBenchmark;
    } catch (err) {
        throw new Error("Error retrieving Market Comparison: " + err.message);
    }
};
