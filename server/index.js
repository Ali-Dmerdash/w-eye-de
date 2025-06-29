require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args)); // Add this line

const errorHandler = require("./src/utils/errorHandler");
const fraudRoutes = require("./src/routes/fraudRoutes");
const revenueRoutes = require("./src/routes/revenueRoutes");
const marketRoutes = require("./src/routes/marketRoutes");
const statsRoutes = require("./src/routes/statsRoutes");
const dataRoutes = require("./src/routes/dataRoutes");
const preferenceRoutes = require("./src/routes/preferenceRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend origin
    credentials: true, // allow cookies or auth headers if needed
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/api/fraud", fraudRoutes);
app.use("/api/revenue", revenueRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/preference", preferenceRoutes);

// New chatbot proxy route
app.post("/api/chat", async (req, res) => {
  try {
    const response = await fetch("https://bora-eyide-xcgh.vercel.app/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Chatbot proxy error:", error);
    res.status(500).json({ error: "Failed to fetch from chatbot API" });
  }
});

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
    console.log(`MongoDB connected on ${process.env.MONGODB_DB}`);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} !!!`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
