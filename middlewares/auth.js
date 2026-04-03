import User from "../models/User.js";
import { AppError } from "../utils/classError.js";
import { verifyToken } from "../utils/generateToken.js";

export const auth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) throw new AppError("Token not provided", 401);

    const decoded = verifyToken(token);
    if (!decoded?.userId) throw new AppError("Invalid token", 401);

    const user = await User.findById(decoded.userId);
    if (!user) throw new AppError("User not found", 404);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};