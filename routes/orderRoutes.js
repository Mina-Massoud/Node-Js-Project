// TODO: Noura Ali — Order Routes
// - GET / → auth → getOrders (authenticated)
// - GET /:id → auth → getOrder (authenticated, ownership check inside controller)
// - POST / → auth → createOrder (authenticated)
// - PATCH /:id → auth → authorize("admin") → updateOrderStatus (admin only)
// - DELETE /:id → auth → authorize("admin") → deleteOrder (admin only)
import { Router } from "express";
const router = Router();
export default router;
