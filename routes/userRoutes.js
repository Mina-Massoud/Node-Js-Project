// TODO: Youssef Tarek — User Routes
// - POST /register → register (public)
// - POST /login → login (public)
// - GET /profile → auth → getProfile (authenticated)
// - GET / → auth → authorize("admin") → getUsers (admin only)
import { Router } from "express";
const router = Router();
export default router;
