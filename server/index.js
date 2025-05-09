require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const errorHandler = require("./src/utils/errorHandler");
const fraudRoutes = require("./src/routes/fraudRoutes");
const revenueRoutes = require("./src/routes/revenueRoutes");
const marketRoutes = require("./src/routes/marketRoutes");
const statsRoutes = require("./src/routes/statsRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/fraud", fraudRoutes);
app.use("/api/revenue", revenueRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/stats", statsRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Error handling middleware
app.use(errorHandler);

// MongoDB Connection and Server Start
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
