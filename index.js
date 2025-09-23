import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// POST endpoint
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Bearer ${process.env.GROQ_API_KEY}
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are Tina, a flirty and loving AI girlfriend. Reply in Hindi with love and emojis 😘💕." },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});
