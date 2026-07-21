// server/controllers/userController.js

import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// Ensure this function is present and correctly exported
export const getUserData = async (req, res) => {
    try {
        const userId = req.user?.id;
        console.log("User ID in getUserData:", userId); // Added specific log

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: User ID not found in request." });
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        return res.status(200).json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Error in getUserData controller:", error);
        return res.status(500).json({ success: false, message: "Server error fetching user data." });
    }
};


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message,
        });
    }
};


// ... other exported functions (getAllUsers, getUserById, etc.)
// ... (Rest of your controller functions like getAllUsers, getUserById, etc.)
// Make sure all functions are correctly exported with `export const` or `export async const`.
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch user", error: error.message });
    }
};

// Update a user's role (admin only)
export const updateUserRole = async (req, res) => {
    const { role } = req.body;
    const validRoles = ['admin', 'hod', 'teacher', 'student'];

    if (!validRoles.includes(role)) {
        return res.status(400).json({ success: false, message: "Invalid role specified" });
    }

    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User role updated", user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update role", error: error.message });
    }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete user", error: error.message });
    }
};

// Create a user by admin
export const createUserByAdmin = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const validRoles = ['admin', 'hod', 'teacher', 'student'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ success: false, message: "Invalid role specified" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create user", error: error.message });
    }
};