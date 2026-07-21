// server/routes/userRoutes.js

import express from 'express';
import * as UserController from '../controllers/userController.js'; // Ensure this exact import
import adminAuth from '../middleware/adminAuth.js';
import userAuth from '../middleware/userAuth.js';
const userRouter = express.Router();

// Route that caused the 404
userRouter.get('/get-user-data', userAuth, UserController.getUserData);

// Admin/HOD User Management Routes
userRouter.get('/admin/all', userAuth, UserController.getAllUsers);
userRouter.get('/admin/:id', adminAuth, UserController.getUserById);
userRouter.put('/admin/update-role/:id', adminAuth, UserController.updateUserRole);
userRouter.delete('/admin/delete/:id', adminAuth, UserController.deleteUser);
userRouter.post('/admin/create', adminAuth, UserController.createUserByAdmin);
userRouter.get("/users/:id", UserController.getUserById); // get a single user
userRouter.put("/users/:id/role", UserController.updateUserRole); // update role
userRouter.delete("/users/:id", UserController.deleteUser); // delete user
userRouter.post("/users", UserController.createUserByAdmin);
export default userRouter;