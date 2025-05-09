const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res
            .status(403)
            .json({ success: false, message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }
        req.user = decoded; // Attach user data to the request object
        next(); // Proceed to the next middleware/controller
    });
};
