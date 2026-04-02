// TODO: Youssef Tarek — Authentication Middleware
// - Read Authorization header (Bearer token)
// - Verify JWT token using jwt.verify()
// - Find user by decoded ID, attach to req.user
// - Reject with 401 if no token, invalid token, or user not found
const auth = (req, res, next) => next();
export default auth;
