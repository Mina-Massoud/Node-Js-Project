import { Router } from "express";
import { register, login, getProfile, getUsers } from "../controllers/userController.js";
import { auth } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

const userRoutes = Router();

// Public routes
userRoutes.post("/register", register);
userRoutes.post("/login", login);

// Authenticated routes
userRoutes.get("/profile", auth, getProfile);

// Admin only routes
userRoutes.get("/", auth, authorize("admin"), getUsers);

export default userRoutes;