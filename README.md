# Silent Failure Detector

A minimal monitoring service that detects silent failures in operational workflows
and notifies humans when expected actions do not occur within a defined time window.

This tool is designed to answer a simple but critical question:

> “Something was expected to happen. It didn’t. Should a human take a look?”

---

## What problem does it solve?

In many systems and business processes, failures are silent:
- no error is thrown
- no exception is raised
- no alert is triggered

An event is detected, but the follow-up action never happens.

Examples:
- a deposit is detected, but never credited
- a job is created, but never completed
- a request is accepted, but never processed
- an operation starts, but never finishes

This tool monitors such situations and raises a signal only if the silence lasts too long.

---

## How it works (conceptually)

1. An event is reported (e.g. “deposit detected”)
2. The system starts a timer
3. If confirmation arrives in time → nothing happens
4. If confirmation does not arrive → an alert is sent

There is no polling, no guessing, no heuristics.  
Just explicit signals and explicit timeouts.

---

## Design principles

This tool is intentionally non-autonomous.

- It does not retry operations
- It does not fix or modify external systems
- It does not make decisions on behalf of humans
- It performs no irreversible actions

Its only responsibility is to signal potential risk early
and keep all decisions under explicit human control.

This design avoids risks inherent to fully autonomous agents
in financial and operational workflows.

---

## What this tool is NOT

- ❌ not an auto-healing system
- ❌ not a workflow engine
- ❌ not an AI agent
- ❌ not a business process manager

It is a monitoring primitive, meant to be composed with other systems.

---

## Typical use cases

- Financial operations monitoring
- Background job supervision
- Operational SLA enforcement
- Human-in-the-loop workflows
- Early warning systems
- Internal tooling and MVPs

---

## Tech stack

- Node.js
- Express
- Redis (timers / TTL)
- Telegram Bot API (notifications)
- PM2 (process management)

---
## API example

### Schedule monitoring

```http
POST /deposit-detected
Content-Type: application/json
{
  "deposit_id": "abc123",
  "credited": false
}


