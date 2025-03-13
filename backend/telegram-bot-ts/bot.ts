import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

dotenv.config();

// Retrieve the bot token from environment variables
const token: string = process.env.BOT_TOKEN || "";
if (!token) {
  console.error("BOT_TOKEN is not set in environment variables.");
  process.exit(1);
}

const bot: TelegramBot = new TelegramBot(token, { polling: true });

console.log("Telegram Bot (TS) is running and polling for messages...");

bot.onText(/\/start/, (msg) => {
  const chatId: number = msg.chat.id;
  bot.sendMessage(chatId, "Hello from the TypeScript bot!");
});

bot.on("message", (msg) => {
  console.log("Received message (TS):", msg);
});