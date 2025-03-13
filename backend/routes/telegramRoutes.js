// routes/telegramRoutes.js

import express from 'express';
import { sendTelegramNotification } from '../controller/telegramController.js';

const router = express.Router();

// POST endpoint to send a Telegram notification
router.post('/send-telegram-notification', sendTelegramNotification);

export default router;
