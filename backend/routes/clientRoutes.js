import express from 'express';
import { createClient, getClient } from '../controller/clientController.js';

const router = express.Router();

router.get('/', getClient);
router.post('/', createClient);

export default router;