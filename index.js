import express from "express";
import fetch from "node-fetch";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for JSON
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully!");
});

// Chat API route
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: "❌ GROQ_API_KEY missing in env" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Bearer ${process.env.GROQ_API_KEY}
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: message }],
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error("❌ Error in /chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log('🚀 Server running on port ${PORT}');
});
