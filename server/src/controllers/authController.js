const authService = require("../services/authService");

exports.register = async (req, res) => {
    try {
        const { user, token } = await authService.register(req.body);
        res.status(201).json({ success: true, user, token }); // Send both user and token in response
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const token = await authService.login(req.body);
        res.status(200).json({ success: true, token });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.logout = async (req, res) => {
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

exports.getSingleProfile = async (req, res) => {
    try {
        const userId = req.params.userId; // Get userId from request params
        const user = await authService.getProfile(userId);
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getAllProfiles = async (req, res) => {
    try {
        const users = await authService.getAllProfiles(); // Call the service to get all profiles
        res.status(200).json({ success: true, users }); // Return all users in the response
    } catch (err) {
        res.status(400).json({ success: false, message: err.message }); // Handle errors
    }
};
exports.deleteSingleProfile = async (req, res) => {
    try {
        const userId = req.params.userId; // Get userId from request params
        const result = await authService.deleteSingleProfile(userId); // Call the service to delete the user
        if (result.deletedCount === 0) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.deleteAllProfiles = async (req, res) => {
    try {
        const result = await authService.deleteAllProfiles(); // Call the service to delete all users
        res.status(200).json({
            success: true,
            message: "All profiles deleted successfully",
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.params.userId; // Get userId from request params
        const user = await authService.updateProfile(userId, req.body);
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
