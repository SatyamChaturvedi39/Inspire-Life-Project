// middlewares/authMiddleware.js

import jwt from "jsonwebtoken";

// Middleware to verify the access token from the Authorization header.
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  // The header should be in the format "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied. Token not found." });
  }

  try {
    // Verify the token using the secret from the environment variable.
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // If the token does not contain a role, assign "agent" as default.
    if (!payload.role) {
      payload.role = "agent";
    }
    
    // Attach the decoded payload (which includes the user's ID and role) to the request.
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token." });
  }
};

// Middleware to authorize access based on a single required role.
export const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    if (req.user.role === requiredRole) {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden. Insufficient privileges." });
    }
  };
};

// Middleware to authorize access for multiple allowed roles.
export const authorizeMultipleRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json({ message: "Forbidden. Insufficient privileges." });
    }
  };
};