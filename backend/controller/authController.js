// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Agent from "../models/Agent.js";

// Generate an access token that expires in 15 minutes
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
};

// Generate a refresh token that expires in 7 days
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user;
    let role;
    
    // Check admin first, then agent
    user = await Admin.findOne({ email });
    if (user) {
      role = "admin";
    } else {
      user = await Agent.findOne({ email });
      role = "agent";
    }
    
    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    
    const payload = { id: user._id, role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
    
    // Set refresh token as httpOnly cookie (for development, secure: false)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    res.json({ accessToken, role });
  } catch (error) {
    console.error("[Login] Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// controllers/authController.js (refreshToken function)
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    console.log("[RefreshToken] Refresh token from cookie:", refreshToken);
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        console.error("[RefreshToken] Invalid refresh token:", err.message);
        return res.status(403).json({ message: "Invalid refresh token" });
      }
      const newAccessToken = jwt.sign({ id: payload.id, role: payload.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("[RefreshToken] Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
