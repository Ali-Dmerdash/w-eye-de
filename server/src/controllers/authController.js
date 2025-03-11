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

exports.getProfile = async (req, res) => {
    try {
        const user = await authService.getProfile(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await authService.updateProfile(req.user.id, req.body);
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
