import { Request, Response, Router } from "express";
import TelegramBot from "node-telegram-bot-api";

const router = Router();

// Retrieve tokens from environment variables
const BOT_TOKEN: string = process.env.BOT_TOKEN || "";
const GROUP_CHAT_ID: string = process.env.GROUP_CHAT_ID || "";

if (!BOT_TOKEN || !GROUP_CHAT_ID) {
  console.error("Missing BOT_TOKEN or GROUP_CHAT_ID in environment variables.");
}

// Create a TelegramBot instance (polling not needed for sending messages only)
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