// TODO: Noura Ali — Order Routes
// - GET / → auth → getOrders (authenticated)
// - GET /:id → auth → getOrder (authenticated, ownership check inside controller)
// - POST / → auth → createOrder (authenticated)
// - PATCH /:id → auth → authorize("admin") → updateOrderStatus (admin only)
// - DELETE /:id → auth → authorize("admin") → deleteOrder (admin only)
// routes/orderRoutes.js
import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorize.js";
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

const router = Router();

// Authenticated users
router.get("/", auth, getOrders);
router.get("/:id", auth, getOrder);
router.post("/", auth, createOrder);

// Admin only
router.put("/:id", auth, authorize("admin"), updateOrder);
router.patch("/:id", auth, authorize("admin"), updateOrderStatus);
router.delete("/:id", auth, authorize("admin"), deleteOrder);

export default router;

