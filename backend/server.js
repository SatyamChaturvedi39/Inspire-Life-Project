import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import meetingRoutes from "./routes/meetingRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import policyRoutes from "./routes/policyRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import policymeetingsRoutes from "./routes/policymeetingsRoutes.js";
import telegramRoutes from "./routes/telegramRoutes.js"; // Import the Telegram routes

dotenv.config(); // Load environment variables

const app = express();

connectDB(); // Connect to the database

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend origin
    credentials: true,
  })
);
app.use(express.json()); // Accept JSON data in the req.body
app.use(cookieParser());

// Routes
app.use("/api/leads", leadRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/agents", adminRoutes);
app.use("/api/policymeetings", policymeetingsRoutes);
app.use("/api/telegram", telegramRoutes); // Add the new Telegram routes

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log("Server is running on http://localhost:" + PORT)
);
