# Deposit Silent Failure Detector

🚨 Detects silent deposit failures in payment systems.

When a deposit is detected but not credited in time, this service sends automatic Telegram alerts.

Built for crypto & fintech backends.

---

## ❓ Problem

In payment systems, deposits may be detected but silently fail to be credited to user balances.

This leads to:
- users waiting indefinitely
- missing alerts
- delayed support reaction

---

## ✅ Solution

This service:
- listens for deposit events via webhook
- tracks each deposit by `deposit_id`
- sends Telegram alerts if a deposit is not credited in time
- cancels alerts once the deposit is credited

---

## 🔌 API

### POST /deposit-detected

**Request body:**
```json
{
  "deposit_id": "abc123",
  "credited": false
}

credited = false → schedules alert

credited = true → cancels alert

⚙️ Environment variables

Create a .env file based on .env.example:

TG_BOT_TOKEN=your_telegram_bot_token
TG_CHAT_ID=your_chat_id
REDIS_URL=redis://localhost:6379
PORT=3000

🚀 Run locally

npm install
node server.js

🧪 Status

MVP. Actively developed.

This project was built as a minimal production-ready detector for silent failures.

Feedback and ideas are welcome.
