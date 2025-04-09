{/* //routes/authRoutes.js */}

import express from 'express';
import { login, refreshToken, logout } from '../controller/authController.js';

const router = express.Router();

router.post('/login', login);
router.get('/refresh', refreshToken);
router.get('/logout', logout);

export default router;