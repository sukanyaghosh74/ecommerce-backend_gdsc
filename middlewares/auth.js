const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

const authorize = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) return res.status(403).json({ message: "Forbidden" });
        next();
    };
};

module.exports = { authenticate, authorize };
