import { AppError } from "../utils/classError.js";

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("User not authenticated", 401));
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return next(new AppError("You don't have permission", 403));
    }

    next();
  };
};
