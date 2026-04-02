// TODO: Youssef Tarek — Authorization Middleware
// - Factory function: (...roles) => middleware
// - Check req.user exists (401 if not)
// - Check req.user.role is in allowed roles (403 if not)
const authorize = (...roles) => (req, res, next) => next();
export default authorize;
