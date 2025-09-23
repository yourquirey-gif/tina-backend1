import 'dotenv/config';       // local testing ke liye (optional) - Render ignores .env
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // agar chaho to restrict origin
app.use(express.json());

// Optional auth: set SECRET_KEY in Render env if you want to protect the endpoint
const SECRET = process.env.SECRET_KEY || '';

// Simple health route for UptimeRobot / browser tests
app.get('/', (req, res) => res.send('✅ Tina backend - healthy'));

// Simple middleware to check optional secret token
function checkAuth(req, res, next) {
  if (!SECRET) return next(); // if SECRET not set, skip auth
  const auth = (req.headers['authorization'] || '').trim();
  if (auth === Bearer ${SECRET}) return next();
  return res.status(403).json({ error: 'Forbidden - invalid token' });
}

app.post('/chat', checkAuth, async (req, res) => {
  try {
    const userMessage = (req.body.message || '').toString().trim();
    if (!userMessage) return res.status(400).json({ error: 'Message is required' });

    const GROQ_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_KEY) return res.status(500).json({ error: 'GROQ_API_KEY not configured' });

    const payload = {
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: 'तुम एक प्यारी, फ्लर्टी girlfriend हो। हमेशा प्यार भरे और रोमांटिक जवाब दो।' },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 200
    };

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + GROQ_KEY
      },
      body: JSON.stringify(payload),
      // timeout handling can be added here if needed
    });

    if (!r.ok) {
      const txt = await r.text();
      console.error('Groq upstream error', r.status, txt);
      return res.status(502).json({ error: 'Upstream error', status: r.status, details: txt });
    }

    const data = await r.json();
    // return a simple object with assistant text
    const assistantText = data.choices?.[0]?.message?.content ?? (data.error ?? 'No reply');
    return res.json({ reply: assistantText });
  } catch (err) {
    console.error('Server error', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.listen(PORT, () => console.log(🚀 Tina backend listening on port ${PORT}));
