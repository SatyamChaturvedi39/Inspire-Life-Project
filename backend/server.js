import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";
import meetingRoutes from './routes/meetingRoutes.js';

import clientRoutes from './routes/clientRoutes.js';
import policyRoutes from './routes/policyRoutes.js';

dotenv.config(); // Load environment variables

const app = express();

connectDB(); // Connect to the database

// Middleware
app.use(cors());
app.use(express.json()); //allows us to accept JSON data in the req.body

// Routes
app.use("/api/clients", clientRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/meetings", meetingRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log('Server is running on http://localhost:'+ PORT));