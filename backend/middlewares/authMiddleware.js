// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

// Middleware to verify the access token from the Authorization header.
export const authenticateToken = (req, res, next) => {
  // Retrieve the Authorization header value
  const authHeader = req.headers["authorization"];
  console.log("[AuthMiddleware] Authorization header:", req.headers["authorization"]);
  
  if (!authHeader) {
    console.error("[AuthMiddleware] No Authorization header provided.");
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  // The header should be in the format "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    console.error("[AuthMiddleware] Token not found after 'Bearer'.");
    return res.status(401).json({ message: "Access denied. Token not found." });
  }

  try {
    // Verify the token using the secret from the environment variable.
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // If the token does not contain a role, assign "agent" as default.
    if (!payload.role) {
      payload.role = "agent";
    }
    
    // Attach the decoded payload (which should include the user's ID and role) to the request.
    req.user = payload;
    console.log("[AuthMiddleware] Token verified:", req.user);
    next(); // Token is valid, so move to the next middleware or route handler.
  } catch (err) {
    console.error("[AuthMiddleware] Token verification failed:", err.message);
    return res.status(403).json({ message: "Invalid token." });
  }
};

// Middleware to authorize access based on a single required role.
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

// Middleware to authorize access for multiple allowed roles.
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
