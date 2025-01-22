import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { connectDB } from "./config/db.js";
import cors from "cors";

import routes from './routes/index.js'

dotenv.config(); // Load environment variables

const app = express();

connectDB(); // Connect to the database

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/", routes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log('Server is running on http://localhost:'+ PORT));