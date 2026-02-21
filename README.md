# Deposit Silent Failure Detector

🚨 Detects silent deposit failures in payment systems.

When a deposit is detected but not credited in time, this service sends automatic Telegram alerts.

Built for crypto & fintech backends.
Webhook-based service that detects silent failures.

---

## ❓ What problem does it solve?

In payment systems, deposits may be detected
but silently fail to be credited to user balances.

This leads to:
- users waiting indefinitely
- missing alerts
- delayed support reaction

---

## ✅ What does this service do?

- Listens for deposit events
- Tracks each deposit by deposit_id
- Sends Telegram alerts if a deposit is not credited in time
- Cancels alerts once the deposit is credited

---

## 🔌 API

### POST /deposit-detected

Request body:
```json
{
  "deposit_id": "abc123",
  "credited": false
}

---

## ⚙️ Environment variables

The service requires a .env file with Telegram and Redis configuration.

---

## 🧪 Status

MVP. Actively developed.
