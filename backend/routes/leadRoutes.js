import express from 'express';
import { createLead, getLead, getRecentLeads } from '../controller/leadController.js';
import { authenticateToken, authorizeMultipleRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Have to make this secure once admin dashboard is done
// admin and agents' routes
router.get('/',  getLead);
router.get('/recent',  getRecentLeads);

// public route
router.post('/', createLead);

export default router;