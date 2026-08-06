import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useState } from "react";
import { useTheme } from "../../theme/useTheme";
import { useExpenseStore } from "../../store/useExpenseStore";
import { getCategoryById, CATEGORIES } from "../../constants/categories";

const { width } = Dimensions.get("window");

export default function Analytics() {
  const { colors } = useTheme();
  const { budget, getTotalByCategory, getWeeklyTotals, getExpensesThisMonth } =
    useExpenseStore();

  const [activeTab, setActiveTab] = useState<"weekly" | "category">("weekly");

  const categoryTotals = getTotalByCategory();
  const weeklyTotals = getWeeklyTotals();
  const monthlyExpenses = getExpensesThisMonth();
  const totalSpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  const maxWeekly = Math.max(...weeklyTotals.map((w) => w.total), 1);
  const maxCategory = Math.max(...Object.values(categoryTotals), 1);

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
    title: { fontSize: 28, fontWeight: "800", color: colors.text },
    subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
    summaryRow: {
      flexDirection: "row",
      gap: 12,
      marginHorizontal: 24,
      marginBottom: 24,
    },
    summaryCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    summaryLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    summaryValue: {
      fontSize: 20,
      fontWeight: "800",
      color: colors.text,
      marginTop: 4,
    },
    summarySubtext: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
    tabRow: {
      flexDirection: "row",
      marginHorizontal: 24,
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 14,
      padding: 4,
      marginBottom: 20,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: "center",
    },
    tabText: { fontSize: 14, fontWeight: "600" },
    chartCard: {
      marginHorizontal: 24,
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 24,
    },
    chartTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 20,
    },
    barRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      height: 140,
      marginBottom: 8,
    },
    barContainer: { alignItems: "center", flex: 1 },
    bar: { width: 28, borderRadius: 8, minHeight: 4 },
    barLabel: {
      fontSize: 10,
      color: colors.textMuted,
      marginTop: 6,
      fontWeight: "500",
    },
    barAmount: { fontSize: 9, color: colors.textSecondary, marginTop: 2 },
    categoryRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    categoryEmoji: { fontSize: 22, width: 36 },
    categoryInfo: { flex: 1, marginLeft: 8 },
    categoryName: { fontSize: 14, fontWeight: "600", color: colors.text },
    categoryBar: {
      height: 6,
      borderRadius: 3,
      marginTop: 4,
    },
    categoryAmount: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.text,
      marginLeft: 8,
    },
    categoryPercent: { fontSize: 11, color: colors.textMuted, marginLeft: 4 },
    emptyChart: {
      alignItems: "center",
      paddingVertical: 40,
    },
    emptyEmoji: { fontSize: 36, marginBottom: 8 },
    emptyText: { fontSize: 14, color: colors.textSecondary },
  });

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={s.title}>Analytics</Text>
          <Text style={s.subtitle}>Your spending breakdown</Text>
        </View>

        {/* Summary Cards */}
        <View style={s.summaryRow}>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>THIS MONTH</Text>
            <Text style={s.summaryValue}>
              {budget.currency}
              {totalSpent.toLocaleString("en-IN")}
            </Text>
            <Text style={s.summarySubtext}>
              {monthlyExpenses.length} transactions
            </Text>
          </View>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>BUDGET LEFT</Text>
            <Text
              style={[
                s.summaryValue,
                {
                  color:
                    budget.monthly - totalSpent < 0
                      ? colors.danger
                      : colors.success,
                },
              ]}
            >
              {budget.currency}
              {Math.max(budget.monthly - totalSpent, 0).toLocaleString("en-IN")}
            </Text>
            <Text style={s.summarySubtext}>
              of {budget.currency}
              {budget.monthly.toLocaleString("en-IN")}
            </Text>
          </View>
        </View>

        {/* Tab switcher */}
        <View style={s.tabRow}>
          {(["weekly", "category"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                s.tab,
                {
                  backgroundColor:
                    activeTab === tab ? colors.primary : "transparent",
                },
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  s.tabText,
                  {
                    color: activeTab === tab ? "#FFFFFF" : colors.textSecondary,
                  },
                ]}
              >
                {tab === "weekly" ? "📅 This Week" : "🏷️ By Category"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Weekly Bar Chart */}
        {activeTab === "weekly" && (
          <View style={s.chartCard}>
            <Text style={s.chartTitle}>Daily spending this week</Text>
            {weeklyTotals.every((w) => w.total === 0) ? (
              <View style={s.emptyChart}>
                <Text style={s.emptyEmoji}>📊</Text>
                <Text style={s.emptyText}>No expenses this week yet</Text>
              </View>
            ) : (
              <>
                <View style={s.barRow}>
                  {weeklyTotals.map((item) => {
                    const height = (item.total / maxWeekly) * 120;
                    const isToday =
                      item.day ===
                      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                        new Date().getDay()
                      ];
                    return (
                      <View key={item.day} style={s.barContainer}>
                        <View
                          style={[
                            s.bar,
                            {
                              height: Math.max(height, 4),
                              backgroundColor: isToday
                                ? colors.primary
                                : colors.primaryLight,
                            },
                          ]}
                        />
                        <Text
                          style={[
                            s.barLabel,
                            {
                              color: isToday
                                ? colors.primary
                                : colors.textMuted,
                            },
                          ]}
                        >
                          {item.day}
                        </Text>
                        {item.total > 0 && (
                          <Text style={s.barAmount}>
                            {budget.currency}
                            {(item.total / 1000).toFixed(1)}k
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              </>
            )}
          </View>
        )}

        {/* Category Breakdown */}
        {activeTab === "category" && (
          <View style={s.chartCard}>
            <Text style={s.chartTitle}>Spending by category</Text>
            {Object.keys(categoryTotals).length === 0 ? (
              <View style={s.emptyChart}>
                <Text style={s.emptyEmoji}>🏷️</Text>
                <Text style={s.emptyText}>No category data yet</Text>
              </View>
            ) : (
              CATEGORIES.filter((c) => categoryTotals[c.id] > 0)
                .sort(
                  (a, b) =>
                    (categoryTotals[b.id] || 0) - (categoryTotals[a.id] || 0),
                )
                .map((cat) => {
                  const amount = categoryTotals[cat.id] || 0;
                  const percent = Math.round((amount / totalSpent) * 100);
                  const barWidth = (amount / maxCategory) * (width - 120);
                  return (
                    <View key={cat.id} style={s.categoryRow}>
                      <Text style={s.categoryEmoji}>{cat.icon}</Text>
                      <View style={s.categoryInfo}>
                        <Text style={s.categoryName}>{cat.label}</Text>
                        <View
                          style={[
                            s.categoryBar,
                            {
                              width: barWidth,
                              backgroundColor:
                                (colors[
                                  cat.colorKey as keyof typeof colors
                                ] as string) || colors.primary,
                            },
                          ]}
                        />
                      </View>
                      <Text style={s.categoryAmount}>
                        {budget.currency}
                        {amount.toLocaleString("en-IN")}
                      </Text>
                      <Text style={s.categoryPercent}>{percent}%</Text>
                    </View>
                  );
                })
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
