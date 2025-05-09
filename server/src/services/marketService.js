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

exports.getMarketResults = async () => {
  try {
    const marketResults = await MarketSchema.find().sort({
      date: -1,
    });
    return marketResults;
  } catch (err) {
    throw new Error("Error retrieving Market Comparison: " + err.message);
  }
};
