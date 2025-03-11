const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async ({ username, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    return { user, token }; // Return both user and token
};

exports.login = async ({ username, password }) => {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });

    return token;
};

exports.getProfile = async (userId) => {
    return await User.findById(userId).select("-password");
};
exports.getAllProfiles = async () => {
    return await User.find();
};
exports.deleteSingleProfile = async (userId) => {
    const result = await User.deleteOne({ _id: userId }); // Find the user by ID and delete it
    return result;
};

exports.deleteAllProfiles = async () => {
    const result = await User.deleteMany({}); // This deletes all users
    return result;
};

exports.updateProfile = async (userId, updates) => {
    return await User.findByIdAndUpdate(userId, updates, { new: true }).select(
        "-password",
    );
};
