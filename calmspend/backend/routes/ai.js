const express = require("express");
const router = express.Router();

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

router.post("/chat", async (req, res) => {
  try {
    const { message, expenses, budget, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const totalSpent = expenses
      .filter((e) => {
        const now = new Date();
        const d = new Date(e.date);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, e) => sum + e.amount, 0);

    const categoryBreakdown = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    const systemPrompt = `You are CalmSpend AI, a friendly personal finance assistant.

USER DATA:
- Monthly budget: ${budget.currency}${budget.monthly}
- Spent this month: ${budget.currency}${totalSpent}
- Remaining: ${budget.currency}${budget.monthly - totalSpent}

CATEGORY BREAKDOWN:
${Object.entries(categoryBreakdown)
  .map(([cat, amt]) => `- ${cat}: ${budget.currency}${amt}`)
  .join("\n")}

Be conversational, specific, and actionable. Keep responses concise.`;

    const messages = [
      ...(history || []).slice(-8),
      { role: "user", content: message },
    ];

    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    res.json({ reply: data.content[0].text });
  } catch (error) {
    console.error("AI route error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

router.post("/insight", async (req, res) => {
  try {
    const { expenses, budget } = req.body;

    const totalSpent = expenses
      .filter((e) => {
        const now = new Date();
        const d = new Date(e.date);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, e) => sum + e.amount, 0);

    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 150,
        system: `You are a finance assistant. Budget: ${budget.currency}${budget.monthly}, spent: ${budget.currency}${totalSpent}`,
        messages: [
          {
            role: "user",
            content:
              "Give one short smart insight about my spending in 1-2 sentences.",
          },
        ],
      }),
    });

    const data = await response.json();
    res.json({ insight: data.content[0].text });
  } catch (error) {
    res.status(500).json({ error: "Failed to get insight" });
  }
});

module.exports = router;
