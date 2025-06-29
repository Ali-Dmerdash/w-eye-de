const UserPref = require("../models/UserPref");

class PreferenceService {
  async savePreference(description) {
    try {
      const preference = new UserPref({
        description: description,
      });

      const savedPreference = await preference.save();
      return {
        success: true,
        data: savedPreference,
        message: "Preference saved successfully",
      };
    } catch (error) {
      throw new Error(`Failed to save preference: ${error.message}`);
    }
  }
}

module.exports = new PreferenceService();
