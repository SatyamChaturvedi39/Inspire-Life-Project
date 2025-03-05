import express from 'express';
import { createLead, getLead } from '../controller/leadController.js';

const router = express.Router();

router.get('/', getLead);
router.post('/', createLead);

export default router;