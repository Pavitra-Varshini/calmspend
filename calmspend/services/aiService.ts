import { Expense } from "../store/useExpenseStore";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || "";

const buildSystemPrompt = (
  expenses: Expense[],
  budget: { monthly: number; currency: string },
) => {
  const totalThisMonth = expenses
    .filter((e) => {
      const now = new Date();
      const d = new Date(e.date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const categoryBreakdown = expenses.reduce(
    (acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  const recentExpenses = expenses.slice(0, 10).map((e) => ({
    amount: `${budget.currency}${e.amount}`,
    category: e.category,
    note: e.note,
    date: new Date(e.date).toLocaleDateString(),
  }));

  return `You are CalmSpend AI, a friendly and smart personal finance assistant.

USER'S FINANCIAL DATA:
- Monthly budget: ${budget.currency}${budget.monthly}
- Spent this month: ${budget.currency}${totalThisMonth}
- Remaining: ${budget.currency}${budget.monthly - totalThisMonth}
- Budget used: ${Math.round((totalThisMonth / budget.monthly) * 100)}%

SPENDING BY CATEGORY THIS MONTH:
${Object.entries(categoryBreakdown)
  .map(([cat, amt]) => `- ${cat}: ${budget.currency}${amt}`)
  .join("\n")}

RECENT EXPENSES:
${recentExpenses.map((e) => `- ${e.date}: ${e.amount} on ${e.category} (${e.note})`).join("\n")}

INSTRUCTIONS:
- Be conversational, warm and encouraging
- Give specific actionable advice based on their actual data
- Use their currency symbol (${budget.currency}) when mentioning amounts
- Keep responses concise (2-4 sentences unless asked for detail)
- If they ask about categories, reference their actual spending
- Suggest ways to save based on their highest spending categories`;
};

export const askAI = async (
  userMessage: string,
  expenses: Expense[],
  budget: { monthly: number; currency: string },
  history: { role: "user" | "assistant"; content: string }[],
): Promise<string> => {
  try {
    const systemPrompt = buildSystemPrompt(expenses, budget);

    const messages = [
      ...history.slice(-8), // keep last 8 messages for context
      { role: "user", content: userMessage },
    ];

    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
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
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error("AI error:", error);
    return "I'm having trouble connecting right now. Please check your internet connection and try again.";
  }
};

export const getQuickInsight = async (
  expenses: Expense[],
  budget: { monthly: number; currency: string },
): Promise<string> => {
  try {
    const systemPrompt = buildSystemPrompt(expenses, budget);

    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 150,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content:
              "Give me one short smart insight about my spending this month in 1-2 sentences. Be specific and actionable.",
          },
        ],
      }),
    });

    if (!response.ok) throw new Error("API error");
    const data = await response.json();
    return data.content[0].text;
  } catch {
    return "Track your expenses daily to get personalized AI insights about your spending patterns.";
  }
};
