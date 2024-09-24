// index.js
const express = require("express");
// const dotenv = require("dotenv");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const client = new Client({
  authStrategy: new LocalAuth(), // This saves session, so you don't need to scan QR every time
});
const puppeteerExtra = require("puppeteer-extra");
const stealthPlugin = require("puppeteer-extra-plugin-stealth");
const chromium = require("@sparticuz/chromium");

puppeteerExtra.use(stealthPlugin());

// Generate and log the QR code to authenticate the session
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("Scan the QR code above with WhatsApp to log in.");
});

// Log when the client is ready
client.on("ready", () => {
  console.log("WhatsApp bot is ready!");
});

// Message event handler
client.on("message", (message) => {
  console.log(`Received message: ${message.body}`);

  // Reply if the message contains "Hi" or "Hello"
  if (
    message.body.toLowerCase().includes("hi") ||
    message.body.toLowerCase().includes("hello")
  ) {
    message.reply("Hello! How can I help you?");
  }
});

// Start the WhatsApp client
client.initialize();

// Load environment variables from .env file
// dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
// A basic route
app.get("/", async (req, res) => {
  const browser = await puppeteerExtra.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
  res.send("Hello, World!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
