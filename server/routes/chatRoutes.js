import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {

  try {

    const { message } = req.body;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          model: "llama-3.1-8b-instant",

          messages: [
            {
              role: "system",
              content:
                "You are a helpful AI assistant inside a project management application.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!data.choices) {
      return res.status(500).json({
        content: "AI unavailable",
      });
    }

    res.json(data.choices[0].message);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      content: "Something went wrong",
    });
  }
});

export default router;