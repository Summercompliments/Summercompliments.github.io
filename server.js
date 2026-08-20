require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.warn('WARNING: TELEGRAM_BOT_TOKEN and/or TELEGRAM_CHAT_ID are not set. ' +
    'Set them as environment variables (see .env.example) before deploying.');
}

const app = express();
app.use(cors()); // allow requests from your GitHub Pages front-end

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 } // 8MB max
});

app.get('/', (req, res) => {
  res.send('Compliment & Fortune backend is running.');
});

app.post('/api/submit', upload.single('photo'), async (req, res) => {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return res.status(500).json({ ok: false, error: 'Server is missing Telegram credentials.' });
    }
    if (!req.file) {
      return res.status(400).json({ ok: false, error: 'No photo uploaded.' });
    }

    const caption = (req.body.caption || '').toString().slice(0, 300);
    const compliment = (req.body.compliment || '').toString().slice(0, 300);
    const fortune = (req.body.fortune || '').toString().slice(0, 300);

    const fullCaption = [
      caption,
      compliment ? `💬 ${compliment}` : '',
      fortune ? `🔮 ${fortune}` : ''
    ].filter(Boolean).join('\n\n').slice(0, 1000);

    const form = new FormData();
    form.append('chat_id', TELEGRAM_CHAT_ID);
    form.append('caption', fullCaption);
    form.append('photo', new Blob([req.file.buffer], { type: req.file.mimetype || 'image/jpeg' }), 'entry.jpg');

    const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: form
    });
    const data = await tgRes.json();
    if (!data.ok) {
      throw new Error(data.description || 'Telegram rejected the request');
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('Submit failed:', err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
