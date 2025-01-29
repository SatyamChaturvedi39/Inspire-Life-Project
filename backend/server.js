import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";

import clientRoutes from './routes/clientRoutes.js';

dotenv.config(); // Load environment variables

const app = express();

connectDB(); // Connect to the database

// Middleware
app.use(cors());
app.use(express.json()); //allows us to accept JSON data in the req.body

// Routes
app.use("/api/clients", clientRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log('Server is running on http://localhost:'+ PORT));