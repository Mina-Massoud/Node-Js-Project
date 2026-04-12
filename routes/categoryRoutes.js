// TODO: Mostafa Shanab — Category Routes
// - GET / → getCategories (public)
// - GET /:id → getCategory (public)
// - GET /:id/products → getProductsByCategory (public)
// - POST / → auth → authorize("admin") → createCategory
// - PATCH /:id → auth → authorize("admin") → updateCategory
// - DELETE /:id → auth → authorize("admin") → deleteCategory
import { Router } from "express";
import {
  getCategories,
  getCategory,
  getProductsByCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { auth } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

const router = Router();

// Public Routes
// Anyone can read categories — no token needed

router.get("/", getCategories); // GET  /categories
router.get("/:id", getCategory); // GET  /categories/:id
router.get("/:id/products", getProductsByCategory); // GET  /categories/:id/products

// Admin Only Routes
// auth -> checks the JWT token and attaches req.user
// authorize("admin") -> checks that req.user.role === "admin"

router.post("/", auth, authorize("admin"), createCategory); // POST   /categories
router.patch("/:id", auth, authorize("admin"), updateCategory); // PATCH  /categories/:id
router.delete("/:id", auth, authorize("admin"), deleteCategory); // DELETE /categories/:id

export default router;
