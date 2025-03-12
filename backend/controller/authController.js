import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Agent from "../models/Agent.js";

// Generate a short-lived access token (expires in 15 minutes)
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "45m" });
};

// Generate a long-lived refresh token (expires in 7 days)
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("[Login] Attempting login for email:", email);

    // Check if the user exists in the Admin collection
    let user = await Admin.findOne({ email });
    let role = "admin";
    if (user) {
      console.log("[Login] Admin found for email:", email);
    } else {
      // If not found in Admin, check the Agent collection
      user = await Agent.findOne({ email });
      role = "agent";
      if (user) {
        console.log("[Login] Agent found for email:", email);
      }
    }

    // If user is not found, send a 401 response
    if (!user) {
      console.error("[Login] No user found with email:", email);
      return res.status(401).json({ message: "User does not exist" });
    }

    // Compare provided password with the stored hash using bcrypt
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.error("[Login] Invalid password for email:", email);
      return res.status(401).json({ message: "Invalid password" });
    }

    // Prepare payload for token generation
    const payload = { id: user._id, role, name: user.name };

    // Generate the access token (expires in 45 minutes here)
    const accessToken = generateAccessToken(payload);
    // Generate the refresh token (expires in 7 days)
    const refreshToken = generateRefreshToken(payload);

    console.log("[Login] Generated access token:", accessToken);

    // Set the refresh token as an httpOnly cookie.
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // use false for local dev if not using https
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    console.log("[Login] Login successful for:", email);
    // Return the access token, role, and name so the frontend can use them.
    return res.json({ accessToken, role, name: user.name });
  } catch (error) {
    console.error("[Login] Error during login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    // Read the refresh token from the httpOnly cookie
    const { refreshToken } = req.cookies;
    console.log("[RefreshToken] Received refresh token from cookie:", refreshToken);
    
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    
    // Verify the refresh token
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        console.error("[RefreshToken] Invalid refresh token:", err.message);
        return res.status(403).json({ message: "Invalid refresh token" });
      }
      // If valid, generate a new access token using the payload from the refresh token
      const newAccessToken = generateAccessToken({ id: payload.id, role: payload.role });
      console.log("[RefreshToken] New access token generated:", newAccessToken);
      return res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("[RefreshToken] Error during token refresh:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// controllers/authController.js
export const logout = (req, res) => {
  // Clear the refresh token cookie with the correct options
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/" // Ensure this matches the path where the cookie was set
  });
  console.log("[Logout] Refresh token cookie cleared.");
  return res.json({ message: "Logged out successfully" });
};

