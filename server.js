console.log("REDIS_URL:", process.env.REDIS_URL);
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const Redis = require('ioredis');

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL); // REDIS_URL = redis://127.0.0.1:6379

redis.on('error', (err) => {
  console.error('Redis Client Error:', err.message);
  // Не падаем, просто логируем
});

redis.on('connect', () => {
  console.log('✅ Successfully connected to Redis');
});

redis.on('ready', () => {
  console.log('✅ Redis is ready');
});

const ESCALATION = [
  { level: 1, delay: 10 }, // через 10 сек
  { level: 2, delay: 40 }  // через 40 сек после webhook
];

app.post('/deposit-detected', async (req, res) => {
  const { deposit_id, credited } = req.body;
  if (!deposit_id) return res.status(400).json({ error: 'deposit_id required' });

  const key = `deposit:${deposit_id}`;

  if (credited === true) {
    await redis.del(key); // отменяем escalation
    return res.json({ ok: true });
  }

  const exists = await redis.exists(key);
  if (!exists) {
    const nextAlert = Date.now() + ESCALATION[0].delay * 1000;
    await redis.set(
      key,
      JSON.stringify({ status: 'pending', level: 1, next_alert: nextAlert })
    );
  }

  res.json({ scheduled: true });
});

// Worker, проверяющий депозиты каждые 5 секунд
setInterval(async () => {
  try {
    const keys = await redis.keys('deposit:*');
    const now = Date.now();

    for (const key of keys) {
      const val = await redis.get(key);
      if (!val) continue;

      const data = JSON.parse(val);
      if (data.status !== 'pending') continue;

      if (data.next_alert <= now) {
        await sendAlert(key.replace('deposit:', ''), data.level);

        const nextLevel = data.level + 1;
        if (nextLevel > ESCALATION.length) {
          await redis.del(key); // последний alert отправлен
        } else {
          const nextAlert =
            Date.now() +
            (ESCALATION[nextLevel - 1].delay - ESCALATION[data.level - 1].delay) * 1000;
          await redis.set(
            key,
            JSON.stringify({ ...data, level: nextLevel, next_alert: nextAlert })
          );
        }
      }
    }
  } catch (err) {
    console.error('Worker error:', err);
  }
}, 5000);

async function sendAlert(deposit_id, level) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!token) {
    console.error('❌ TELEGRAM_BOT_TOKEN is missing or empty');
    return;
  }
  if (!chatId) {
    console.error('❌ TELEGRAM_CHAT_ID is missing or empty');
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text: `🔴 Silent failure detected (level ${level})\n\n` +
            `Deposit not credited in time\n` +
            `Deposit ID: ${deposit_id}`,
      parse_mode: 'HTML'
    });

    console.log(`✅ Telegram alert level ${level} sent for deposit ${deposit_id}`);
  } catch (error) {
    const errorData = error.response?.data || error.message;
    console.error('Telegram alert failed:', JSON.stringify(errorData));
  }
}

// === ЗАПУСК СЕРВЕРА ===
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 MVP silent failure detector running on port ${PORT}`);
});
