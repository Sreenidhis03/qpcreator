// server/middleware/userAuth.js (UPDATED)
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const userAuth = async (req, res, next) => {
  // Try to get token from cookies or Authorization header
  // THIS IS THE CRITICAL CHANGE: Look for 'access_token'
  const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
        return res.status(401).json({ success: false, message: "Invalid token: User ID missing in payload" });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found for provided token ID" });
    }

    req.user = user; // Full user object attached
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: "Unauthorized: Token expired" });
    }
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token signature or format" });
    }
    return res.status(500).json({ success: false, message: "Authentication failed due to server error" });
  }
};

export default userAuth;