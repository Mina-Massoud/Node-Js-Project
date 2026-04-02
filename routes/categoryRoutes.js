// TODO: Mostafa Shanab — Category Routes
// - GET / → getCategories (public)
// - GET /:id → getCategory (public)
// - GET /:id/products → getProductsByCategory (public)
// - POST / → auth → authorize("admin") → createCategory
// - PATCH /:id → auth → authorize("admin") → updateCategory
// - DELETE /:id → auth → authorize("admin") → deleteCategory
import { Router } from "express";
const router = Router();
export default router;
