# IMAP Client README

This folder contains a simple IMAP client and SMTP sender for Poisha's bot backend. The IMAP client polls the INBOX for unseen messages and forwards them to your support webhook (or you can extend to create tickets / notify admins via Telegram).

Files:
- imap-client.js — IMAP polling client using imap-simple + mailparser
- email-sender.js — nodemailer helper to send outbound emails (OTP, replies)
- .env.example — example environment variables (DO NOT commit real secrets)

How to run (local / server)
1. Copy bot/.env.example to bot/.env and fill in values (IMAP/SMTP credentials). Use GitHub Secrets for CI.
2. Install dependencies in repo root:
   npm install imap-simple mailparser nodemailer axios
3. Start the IMAP client:
   node bot/imap-client.js

Notes & recommendations
- For Gmail: enable IMAP in Gmail settings and create an App Password (if you use 2FA). Prefer App Passwords or OAuth2.
- Production recommendation: use inbound webhooks from Mailgun/SendGrid instead of IMAP to receive emails (webhooks are faster and more reliable).
- Keep credentials in environment variables or GitHub Secrets — never commit them.

Extending
- Forward inbound messages to Telegram admin group using Telegram Bot API (use ADMIN_CHAT_ID and TELEGRAM_BOT_TOKEN).
- Create support tickets by forwarding to your internal API (set SUPPORT_WEBHOOK_URL).
- Add robust reconnects, rate-limiting, and proper logging/monitoring for production.
