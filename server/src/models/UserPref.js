const mongoose = require("mongoose");

const userPrefSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Description is required"],
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("User_Pref", userPrefSchema, "User_Pref");
