// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    console.error("[AuthMiddleware] No token provided.");
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    console.log("[AuthMiddleware] Token verified:", req.user);
    next();
  } catch (err) {
    console.error("[AuthMiddleware] Token verification failed:", err.message);
    return res.status(403).json({ message: "Invalid token." });
  }
};

export const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      console.error("[AuthMiddleware] No authenticated user.");
      return res.status(401).json({ message: "Unauthorized access" });
    }
    if (req.user.role === requiredRole) {
      console.log(`[AuthMiddleware] Role authorized: ${req.user.role}`);
      next();
    } else {
      console.error(`[AuthMiddleware] Forbidden: Required ${requiredRole}, got ${req.user.role}`);
      return res.status(403).json({ message: "Forbidden. Insufficient privileges." });
    }
  };
};

export const authorizeMultipleRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.error("[AuthMiddleware] No authenticated user.");
      return res.status(401).json({ message: "Unauthorized access" });
    }
    if (allowedRoles.includes(req.user.role)) {
      console.log(`[AuthMiddleware] Access granted for role: ${req.user.role}`);
      next();
    } else {
      console.error(`[AuthMiddleware] Forbidden: Allowed roles ${allowedRoles}, got ${req.user.role}`);
      return res.status(403).json({ message: "Forbidden. Insufficient privileges." });
    }
  };
};
