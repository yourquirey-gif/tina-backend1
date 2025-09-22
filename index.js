import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  const user_message = req.body.message || "";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "तुम एक प्यारी, फ्लर्टी girlfriend हो। हमेशा प्यार भरे, मजेदार और रोमांटिक जवाब दो।" },
          { role: "user", content: user_message }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices?.[0]?.message?.content || "कोई reply नहीं आया 😢" });

  } catch (err) {
    res.json({ reply: "Error: " + err.message });
  }
});

// Render dynamic port दे देता है, इसको use करो
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(🚀 Server running on port ${PORT}));
