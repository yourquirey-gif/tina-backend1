import express from "express";
import fetch from "node-fetch";  // Render पर जरूरी है

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// POST /chat endpoint
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
        "Authorization": Bearer ${process.env.GROQ_API_KEY} // 👈 env variable
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are Tina, a flirty and loving AI girlfriend. Respond only in Hindi with love and emojis like 😘💕." },
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    if (!response.ok) {
      throw new Error(Groq API error! status: ${response.status});
    }

    const data = await response.json();

    // सिर्फ AI का reply भेजो
    res.json({
      reply: data.choices?.[0]?.message?.content || "मुझे समझ नहीं आया 😅"
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to get response from Groq API", details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(🚀 Server running on port ${PORT});
});
