import TelegramBot from 'node-telegram-bot-api';

// Retrieve tokens from environment variables
const BOT_TOKEN = process.env.BOT_TOKEN || "";
const GROUP_CHAT_ID = process.env.GROUP_CHAT_ID || "";

if (!BOT_TOKEN || !GROUP_CHAT_ID) {
  console.error("Missing BOT_TOKEN or GROUP_CHAT_ID in environment variables.");
}

// Create a TelegramBot instance (polling not required for sending messages)
const bot = new TelegramBot(BOT_TOKEN, { polling: false });

export const sendTelegramNotification = async (req, res) => {
  try {
    // Destructure booking details from the request body
    const { name, date, time, phoneNumber, email } = req.body;
    console.log("Received booking for Telegram:", req.body);

    // Compose the notification message
    const message = `New Slot Booking:
Name: ${name}
Phone: ${phoneNumber}
Email: ${email || 'N/A'}
Date: ${date}
Time: ${time}`;

    console.log("Sending message to Telegram:", message);

    // Send the message to your Telegram group
    await bot.sendMessage(GROUP_CHAT_ID, message);
    console.log("Message sent to Telegram group");

    // Respond to the caller
    res.status(200).json({ message: 'Telegram notification sent.' });
  } catch (error) {
    console.error('Telegram notification error:', error);
    res.status(500).json({ error: 'Failed to send Telegram notification.' });
  }
};