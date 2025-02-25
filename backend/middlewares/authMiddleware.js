// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  // Token is expected in the header in the format "Bearer <token>"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.error("[AuthMiddleware] No token provided");
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // Attach user data (id and role) to the request object
    next();
  } catch (err) {
    console.error("[AuthMiddleware] Token verification failed:", err.message);
    return res.status(403).json({ message: "Invalid token." });
  }
};

export const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      console.error("[AuthMiddleware] No authenticated user found in request");
      return res.status(401).json({ message: "Unauthorized access" });
    }

    if (req.user && req.user.role === requiredRole) {
      next();
    } else {
      console.error("[AuthMiddleware] Insufficient privileges. Required:", requiredRole, "Found:", req.user?.role);
      return res.status(403).json({ message: "Forbidden. Insufficient privileges." });
    }
  };
};

// Middleware to authorize multiple roles (e.g., admin OR agent)
export const authorizeMultipleRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.error("[AuthMiddleware] No authenticated user found in request");
      return res.status(401).json({ message: "Unauthorized access" });
    }

    if (allowedRoles.includes(req.user.role)) {
      console.log(`[AuthMiddleware] Access granted to ${req.user.role}`);
      next();
    } else {
      console.error(`[AuthMiddleware] Forbidden: Allowed roles ${allowedRoles}, found ${req.user.role}`);
      return res.status(403).json({ message: "Forbidden. Insufficient privileges." });
    }
  };
};