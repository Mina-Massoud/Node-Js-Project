import jwt from "jsonwebtoken";
import { AppError } from "./classError.js";
export const generateToken = (userId, role) => {
  if (!process.env.SECRET_KEY) {
    throw new AppError("SECRET_KEY is not defined",500);
  }
  return jwt.sign({ userId, role }, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token) => {
  if (!token) throw new AppError("token is required");
  if (!process.env.SECRET_KEY) {
    throw new AppError("SECRET_KEY is not defined", 500);
  }
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    throw new AppError("Invalid or expired token", 401);
  }
};
