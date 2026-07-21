// server/controllers/authcontroller.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

// 📝 REGISTER USER
export const register = async (req, res) => {
  console.log("Register request received with body:", req.body);
  const {
    name,
    email,
    password
  } = req.body;
  if (!name || !email || !password) {
    console.log("Register failed: Missing Details");
    return res.status(400).json({
      success: false,
      message: "Missing Details"
    });
  }
  try {
    const existingUser = await User.findOne({
      email
    });
    if (existingUser) {
      console.log("Register failed: User already exists with email:", email);
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    await user.save();
    const token = jwt.sign({
      id: user._id
    }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      // --- CORRECTED LINE FOR SAME_SITE IN DEV ---
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      // ------------------------------------------
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to QPcreator",
      text: `Welcome to QPcreator Website. Your account is successfully created with email id: ${email}`
    };
    await transporter.sendMail(mailOptions);
    console.log("User registered successfully:", email);
    return res.status(201).json({
      success: true,
      message: "User Registered"
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 📝 LOGIN USER
export const login = async (req, res) => {
  console.log("Login request received with body:", req.body);
  const {
    email,
    password
  } = req.body;
  if (!email || !password) {
    console.log("Login failed: Email and password required");
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }
  try {
    const user = await User.findOne({
      email
    });
    if (!user) {
      console.log("Login failed: Invalid email", email);
      return res.status(401).json({
        success: false,
        message: "Invalid email"
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Login failed: Invalid password for email", email);
      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });
    }
    const token = jwt.sign({
      id: user._id
    }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      // --- CORRECTED LINE FOR SAME_SITE IN DEV ---
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      // ------------------------------------------
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    console.log("Login successful for user:", email);
    return res.json({
      success: true,
      message: "Login Successful",
      userId: user._id,
      role: user.role,
      name: user.name
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 📝 LOGOUT USER
export const logout = async (req, res) => {
  console.log("Logout request received for user:", req.user?.id);
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      // --- CORRECTED LINE FOR SAME_SITE IN DEV ---
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
      // ------------------------------------------
    });
    console.log("Logout successful");
    return res.json({
      success: true,
      message: "Logged Out"
    });
  } catch (error) {
    console.error("Logout error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Check if user is authenticated
export const isAuthenticated = async (req, res) => {
  console.log("isAuthenticated request received");
  try {
    const token = req.cookies.access_token;
    if (!token) {
      console.log("isAuthenticated failed: No token in cookies");
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token"
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log("isAuthenticated failed: User not found in DB after token decode");
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    console.log("User is authenticated:", user.email, "Role:", user.role);
    return res.status(200).json({
      success: true,
      message: "User is authenticated",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        isAccountVerified: user.isAccountVerified
      }
    });
  } catch (error) {
    console.error("isAuthenticated error:", error.message);
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      // --- CORRECTED LINE FOR SAME_SITE IN DEV ---
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
      // ------------------------------------------
    });
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token"
    });
  }
};