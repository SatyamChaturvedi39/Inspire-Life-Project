import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser"; // read cookies for credientials
import leadRoutes from "./routes/leadRoutes.js";
import policyRoutes from "./routes/policyRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import telegramRoutes from "./routes/telegramRoutes.js"; 
import appointmentRoutes from "./routes/appointmentRoutes.js";
import freeSlotRoutes from "./routes/freeSlotRoutes.js";
import dummyRoutes from "./routes/dummyRoutes.js";
import statsRoutes from "./routes/statsRoutes.js"

dotenv.config(); // Load environment variables

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
connectDB(); // Connect to the database

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL, // Frontend origin
    credentials: true,
  })
);
app.use(express.json()); // Accept JSON data in the req.body or server
app.use(cookieParser());

// Routes
app.use("/api/leads", leadRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/agents", adminRoutes);
app.use("/api/telegram", telegramRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/freeslots", freeSlotRoutes);
app.use("/api/dummy", dummyRoutes);
app.use("/api/stats", statsRoutes);

// Start the server
const PORT = process.env.PORT || 5001; //listening to port
app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);