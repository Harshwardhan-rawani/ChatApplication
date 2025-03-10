const express = require("express");
const { userDetails } = require("../controller/userDetails");
const router = express.Router();
const jwt = require("jsonwebtoken")

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });

        req.user = decoded;
        next();
    });
};
router.get("/api/me",authenticateToken, userDetails);

module.exports = router;
