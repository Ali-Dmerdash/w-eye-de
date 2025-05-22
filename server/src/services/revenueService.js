const revenueSchema = require("../models/Revenue");

exports.compareRevenue = async (revenueData) => {
  try {
    const revenue = new revenueSchema({
      ...revenueData,
    });

    const savedRevenue = await revenue.save();
    return savedRevenue;
  } catch (err) {
    throw new Error("Error saving Revenue data: " + err.message);
  }
};

exports.getRevenueResults = async () => {
  try {
    const revenueResults = await revenueSchema.find().sort({
      detectedAt: -1,
    });
    return revenueResults;
  } catch (err) {
    throw new Error("Error retrieving Revenue Results: " + err.message);
  }
};
