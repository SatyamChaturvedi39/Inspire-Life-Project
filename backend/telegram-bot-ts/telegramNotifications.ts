// routes/telegramRoutes.ts

import { Request, Response, Router } from "express";
import TelegramBot from "node-telegram-bot-api";

const router = Router();

// Replace with your actual bot token from BotFather
const BOT_TOKEN: string = "7037439232:AAEpnBTPYBES7hfirMXQMYoXlLO2ElfQwTU";
// Replace with your Telegram group chat ID (should be negative)
const GROUP_CHAT_ID: string = "-4740071168";

// Create a TelegramBot instance. Polling is not needed for sending messages only.
const bot = new TelegramBot(BOT_TOKEN, { polling: false });

// POST endpoint to send a Telegram notification
router.post("/send-telegram-notification", async (req: Request, res: Response) => {
  try {
    const { name, date, time, phoneNumber, email } = req.body;

    // Compose a message with booking details
    const message = `New Slot Booking:
Name: ${name}
Phone: ${phoneNumber}
Email: ${email || "N/A"}
Date: ${date}
Time: ${time}`;

    // Send the message to the Telegram group
    await bot.sendMessage(GROUP_CHAT_ID, message);
    res.status(200).json({ message: "Telegram notification sent." });
  } catch (error) {
    console.error("Telegram notification error:", error);
    res.status(500).json({ error: "Failed to send Telegram notification." });
  }
});

export default router;
