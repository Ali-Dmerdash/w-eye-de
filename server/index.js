require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/database");
const errorHandler = require("./src/utils/errorHandler");
const authRoutes = require("./src/routes/authRoutes");
const fraudRoutes = require("./src/routes/fraudRoutes");
const revenueRoutes = require("./src/routes/revenueRoutes");
const marketRoutes = require("./src/routes/marketRoutes");
const statsRoutes = require("./src/routes/statsRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
