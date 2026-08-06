import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Expense {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string; // ISO string
  createdAt: number;
}

export interface Budget {
  monthly: number;
  currency: string;
}

interface ExpenseStore {
  expenses: Expense[];
  budget: Budget;
  theme: "light" | "dark" | "system";
  aiHistory: { role: "user" | "assistant"; content: string }[];

  addExpense: (expense: Omit<Expense, "id" | "createdAt">) => void;
  deleteExpense: (id: string) => void;
  updateBudget: (budget: Budget) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  addAiMessage: (msg: { role: "user" | "assistant"; content: string }) => void;
  clearAiHistory: () => void;

  // Computed helpers
  getTotalThisMonth: () => number;
  getTotalByCategory: () => Record<string, number>;
  getExpensesThisMonth: () => Expense[];
  getWeeklyTotals: () => { day: string; total: number }[];
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      expenses: [],
      budget: { monthly: 50000, currency: "₹" },
      theme: "system",
      aiHistory: [],

      addExpense: (expense) => {
        const newExpense: Expense = {
          ...expense,
          id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
        };
        set((s) => ({ expenses: [newExpense, ...s.expenses] }));
      },

      deleteExpense: (id) =>
        set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),

      updateBudget: (budget) => set({ budget }),

      setTheme: (theme) => set({ theme }),

      addAiMessage: (msg) => set((s) => ({ aiHistory: [...s.aiHistory, msg] })),

      clearAiHistory: () => set({ aiHistory: [] }),

      getTotalThisMonth: () => {
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        return get()
          .expenses.filter((e) => {
            const d = new Date(e.date);
            return d.getMonth() === month && d.getFullYear() === year;
          })
          .reduce((sum, e) => sum + e.amount, 0);
      },

      getTotalByCategory: () => {
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        return get()
          .expenses.filter((e) => {
            const d = new Date(e.date);
            return d.getMonth() === month && d.getFullYear() === year;
          })
          .reduce(
            (acc, e) => ({
              ...acc,
              [e.category]: (acc[e.category] || 0) + e.amount,
            }),
            {} as Record<string, number>,
          );
      },

      getExpensesThisMonth: () => {
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        return get().expenses.filter((e) => {
          const d = new Date(e.date);
          return d.getMonth() === month && d.getFullYear() === year;
        });
      },

      getWeeklyTotals: () => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);

        const totals: Record<string, number> = {};
        days.forEach((d) => (totals[d] = 0));

        get().expenses.forEach((e) => {
          const d = new Date(e.date);
          if (d >= startOfWeek) {
            const day = days[d.getDay()];
            totals[day] = (totals[day] || 0) + e.amount;
          }
        });

        return days.map((d) => ({ day: d, total: totals[d] }));
      },
    }),
    {
      name: "calmspend-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
