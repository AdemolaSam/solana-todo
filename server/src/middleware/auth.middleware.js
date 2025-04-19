const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("../models/user.model");

const AuthenticateJWT = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Missing Auth Token" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("-nonce");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res
      .status(401)
      .json({ error: "Not authorized to access this route" });
  }
};

module.exports = AuthenticateJWT;
