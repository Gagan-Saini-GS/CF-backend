const jwt = require("jsonwebtoken");
const User = require("../models/Users");

// Middleware to authenticate and extract user from JWT token
const authenticateJWT = async (req, res, next) => {
  const includeAuthToken = req.body.includeAuthToken;
  const authHeader = req.headers.authorization;

  if (includeAuthToken !== undefined && !includeAuthToken) {
    next();
  } else {
    if (!authHeader && includeAuthToken !== undefined && includeAuthToken) {
      return res.status(401).json({ message: "No auth token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.AUTH_TOKEN);
      const user = await User.findById(decoded._id);

      if (!user) {
        return res.status(401).json({ message: "Invalid auth token" });
      }

      req.user = user;
      next();
    } catch (err) {
      return res
        .status(403)
        .json({ message: "Token is not valid", error: err.message });
    }
  }
};

module.exports = authenticateJWT;
