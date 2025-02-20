const userModel = require("../models/user.model");  
const BlackListToken = require("../models/blackListToken.model");  
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized - No Token" });
    }

    try {
        const isBlacklisted = await BlackListToken.findOne({ token: token });

        if (isBlacklisted) {
            return res.status(401).json({ message: "Unauthorized - Token Blacklisted" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User Not Found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
};
