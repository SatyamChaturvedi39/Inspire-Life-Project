{/* //routes/statsRoutes.js */}

import express from 'express';
import { trackVisitor, getVisitors } from '../controller/statsController.js';

const router = express.Router();

// Called when someone visits the site (e.g., home page)
router.post("/track", trackVisitor);

// Get total number of visitors
router.get("/visitors", getVisitors);

export default router;