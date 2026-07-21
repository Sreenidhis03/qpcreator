// server/middleware/adminAuth.js

import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; // Assuming your user model is at this path

const adminAuth = async (req, res, next) => {
    // 1. Get the token from cookies (access_token)
    const token = req.cookies.access_token;

    if (!token) {
        console.log("Admin Auth Failed: No token provided");
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided." });
    }

    try {
        // 2. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Admin Auth: Decoded token:", decoded);

        // 3. Find the user by ID
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            console.log("Admin Auth Failed: User not found for token ID:", decoded.id);
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // 4. Check if the user has the 'hod' or 'HOD' role
        // Adjust these role checks based on your actual roles (e.g., 'admin', 'HOD', 'hod')
        const isAdmin = user.role === 'hod' || user.role === 'HOD';

        if (!isAdmin) {
            console.log("Admin Auth Failed: User does not have sufficient privileges. Role:", user.role);
            return res.status(403).json({ success: false, message: "Forbidden: You do not have administrative privileges." });
        }

        // 5. Attach the user object to the request for subsequent middleware/controllers
        req.user = user;
        console.log("Admin Auth Success: Admin/HOD user authenticated and authorized.");
        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        console.error("Admin Auth Error:", error.message);
        // Clear cookie on invalid/expired token
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
        });
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token." });
    }
};

export default adminAuth;