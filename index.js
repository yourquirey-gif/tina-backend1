import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Bearer ${process.env.GROQ_API_KEY}
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "तुम एक प्यारी girlfriend हो, हमेशा फ्लर्टी और मजेदार जवाब दो।" },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "कुछ गड़बड़ हो गई 😅";

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(🚀 Server running on port ${PORT});
});
