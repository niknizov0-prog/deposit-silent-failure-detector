# 🛡️ Silent Failure Detector

A minimal monitoring service that detects **silent failures** in operational workflows  
and notifies humans when expected actions do not occur within a defined time window.

This tool answers a simple but critical question:

> “Something was expected to happen. It didn’t. Should a human take a look?”

---

## 🚨 What problem does it solve?

In many systems, failures are **silent**:

- no error is thrown  
- no exception is raised  
- no alert is triggered  

An event is detected — but the follow-up action never happens.

Examples:

- 💳 a deposit is detected, but never credited  
- 🧾 a job is created, but never completed  
- 📥 a request is accepted, but never processed  
- ⚙️ an operation starts, but never finishes  

This tool monitors such situations and raises a signal  
**only if the silence lasts too long.**

---

## ⚙️ How it works

1. An event is reported (e.g. “deposit detected”)  
2. A timer starts  
3. If confirmation arrives in time → nothing happens  
4. If confirmation does not arrive → a human is notified  

No polling.  
No guessing.  
No heuristics.  

Just explicit signals and explicit timeouts.

---

## 🧠 Design principles

This tool is intentionally **non-autonomous**.

It:

- ❌ does NOT retry operations  
- ❌ does NOT modify external systems  
- ❌ does NOT make decisions for humans  
- ❌ performs NO irreversible actions  

Its only responsibility is to:

> 🔔 Signal potential risk early  
> 👤 Keep control in human hands  

This avoids the risks of fully autonomous agents  
in financial and operational workflows.

---

## ❌ What this tool is NOT

- not an auto-healing system  
- not a workflow engine  
- not an AI agent  
- not a business process manager  

It is a **monitoring primitive** — meant to be composed with other systems.

---

## 🧩 Typical use cases

- Financial operations monitoring  
- Background job supervision  
- SLA enforcement  
- Human-in-the-loop workflows  
- Early warning systems  
- Internal tooling & MVPs  

---

## 🛠 Tech stack

- Node.js  
- Express  
- Redis (timers / TTL)  
- Telegram Bot API (notifications)  
- PM2 (process management)  

---

## 🔧 Configuration

Environment variables (`.env`):

```env
PORT=3000
REDIS_URL=redis://127.0.0.1:6379
TG_BOT_TOKEN=your_bot_token
TG_CHAT_ID=your_chat_id
```

---

## 🔌 API Example

### Schedule monitoring

```http
POST /deposit-detected
Content-Type: application/json
```

```json
{
  "deposit_id": "abc123",
  "credited": false
}
```

### Cancel monitoring (success case)

```http
POST /deposit-detected
Content-Type: application/json
```

```json
{
  "deposit_id": "abc123",
  "credited": true
}
```

If confirmation does not arrive within the configured time window,  
a notification is sent.

---

## 🤔 Why this approach?

Because in real operations:

- not every delay is an error  
- not every error should be auto-fixed  
- human context still matters  

This tool respects that boundary.

It does not compete with autonomous systems or AI agents.  
It complements them by making **silent failures visible**.

---

## 📄 License

MIT License  

Copyright (c) 2026 Your Name  

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.

