export const CATEGORIES = [
  { id: "food", label: "Food & Drink", icon: "🍔", colorKey: "food" },
  { id: "transport", label: "Transport", icon: "🚗", colorKey: "transport" },
  { id: "shopping", label: "Shopping", icon: "🛍️", colorKey: "shopping" },
  { id: "health", label: "Health", icon: "💊", colorKey: "health" },
  {
    id: "entertainment",
    label: "Entertainment",
    icon: "🎬",
    colorKey: "entertainment",
  },
  { id: "bills", label: "Bills", icon: "📄", colorKey: "bills" },
  { id: "savings", label: "Savings", icon: "💰", colorKey: "savings" },
  { id: "other", label: "Other", icon: "📦", colorKey: "other" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const getCategoryById = (id: string) =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
