// TODO: Ahmed Gaber — Product Routes
// - GET / → getProducts (public)
// - GET /:id → getProduct (public)
// - POST / → auth → authorize("admin") → createProduct
// - PATCH /:id → auth → authorize("admin") → updateProduct
// - DELETE /:id → auth → authorize("admin") → deleteProduct
import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getProduct,
    getProducts,
    updateProduct
} from "../controllers/productController.js";

import { auth } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";

const router = Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProduct);

// Admin only
router.post("/", auth, authorize("admin"), createProduct);
router.patch("/:id", auth, authorize("admin"), updateProduct);
router.delete("/:id", auth, authorize("admin"), deleteProduct);

export default router;
