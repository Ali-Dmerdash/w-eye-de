const preferenceService = require("../services/preferenceService");

class PreferenceController {
  async savePreference(req, res, next) {
    try {
      const { description } = req.body;
      const result = await preferenceService.savePreference(description);
      res.status(201).json({
        success: true,
        data: result.data,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PreferenceController();
