const express = require("express");
const statsRouter = express.Router();
const statsController = require("../controllers/statsController");

statsRouter.post("/generate", statsController.generateStats);
statsRouter.get("/view", statsController.viewStats);
statsRouter.put("/update", statsController.updateStats);

module.exports = statsRouter;
