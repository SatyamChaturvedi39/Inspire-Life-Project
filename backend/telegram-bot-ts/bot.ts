// telegram-bot-ts/bot.ts
import TelegramBot from "node-telegram-bot-api";

// Replace with your actual bot token
const token: string = "7037439232:AAEpnBTPYBES7hfirMXQMYoXlLO2ElfQwTU";
const bot: TelegramBot = new TelegramBot(token, { polling: true });

console.log("Telegram Bot (TS) is running and polling for messages...");

bot.onText(/\/start/, (msg) => {
  const chatId: number = msg.chat.id;
  bot.sendMessage(chatId, "Hello from the TypeScript bot!");
});

bot.on("message", (msg) => {
  console.log("Received message (TS):", msg);
});
