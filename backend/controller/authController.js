import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Agent from "../models/Agent.js";

// Generate a short-lived access token (expires in 45 minutes)
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

    if (!user) {
      console.error("[Login] No user found with email:", email);
      return res.status(401).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.error("[Login] Invalid password for email:", email);
      return res.status(401).json({ message: "Invalid password" });
    }

    const payload = { id: user._id, role, name: user.name };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    console.log("[Login] Generated access token:", accessToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("[Login] Login successful for:", email);
    // IMPORTANT: Return the user's id along with the other details.
    return res.json({ accessToken, role, name: user.name, id: user._id });
  } catch (error) {
    console.error("[Login] Error during login:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    console.log("[RefreshToken] Received refresh token from cookie:", refreshToken);
    
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }
    
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        console.error("[RefreshToken] Invalid refresh token:", err.message);
        return res.status(403).json({ message: "Invalid refresh token" });
      }
      const newAccessToken = generateAccessToken({ id: payload.id, role: payload.role });
      console.log("[RefreshToken] New access token generated:", newAccessToken);
      return res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("[RefreshToken] Error during token refresh:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/"
  });
  console.log("[Logout] Refresh token cookie cleared.");
  return res.json({ message: "Logged out successfully" });
};
