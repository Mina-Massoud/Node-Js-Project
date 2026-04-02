// TODO: Ahmed Gaber — Product Routes
// - GET / → getProducts (public)
// - GET /:id → getProduct (public)
// - POST / → auth → authorize("admin") → createProduct
// - PATCH /:id → auth → authorize("admin") → updateProduct
// - DELETE /:id → auth → authorize("admin") → deleteProduct
import { Router } from "express";
const router = Router();
export default router;
