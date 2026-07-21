// server/routes/authroutes.js

import express from "express";
import * as AuthController from "../controllers/authcontroller.js";
import userAuth from "../middleware/userAuth.js";
const authRouter = express.Router();

// ✅ Auth Routes

// Registration & Login
authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);

// Logout
authRouter.post("/logout", userAuth, AuthController.logout);

// Check Authentication
// --- CORRECTED ROUTE PATH ---
authRouter.get('/isAuthenticated', userAuth, AuthController.isAuthenticated);
// ---------------------------

export default authRouter;