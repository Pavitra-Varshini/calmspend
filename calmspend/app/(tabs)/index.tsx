import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useTheme } from "../../theme/useTheme";
import { useExpenseStore } from "../../store/useExpenseStore";
import { getQuickInsight } from "../../services/aiService";
import { getCategoryById } from "../../constants/categories";
import { router } from "expo-router";

export default function Dashboard() {
  const { colors } = useTheme();
  const { budget, getTotalThisMonth, getExpensesThisMonth, expenses } =
    useExpenseStore();

  const [aiInsight, setAiInsight] = useState("Loading your AI insight...");
  const [refreshing, setRefreshing] = useState(false);

  const totalSpent = getTotalThisMonth();
  const remaining = budget.monthly - totalSpent;
  const percentUsed = Math.min((totalSpent / budget.monthly) * 100, 100);
  const recentExpenses = getExpensesThisMonth().slice(0, 5);

  const loadInsight = useCallback(async () => {
    const insight = await getQuickInsight(expenses, budget);
    setAiInsight(insight);
  }, [expenses, budget]);

  useEffect(() => {
    loadInsight();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInsight();
    setRefreshing(false);
  };

  const progressColor =
    percentUsed > 90
      ? colors.danger
      : percentUsed > 70
        ? colors.warning
        : colors.primary;

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 24,
    },
    greeting: { fontSize: 14, color: colors.textSecondary, fontWeight: "500" },
    appName: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.text,
      marginTop: 2,
    },
    balanceCard: {
      marginHorizontal: 24,
      borderRadius: 24,
      backgroundColor: colors.primary,
      padding: 24,
      marginBottom: 20,
    },
    balanceLabel: {
      fontSize: 13,
      color: "rgba(255,255,255,0.75)",
      fontWeight: "500",
    },
    balanceAmount: {
      fontSize: 40,
      fontWeight: "900",
      color: "#FFFFFF",
      marginTop: 4,
    },
    balanceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    balanceStat: { alignItems: "flex-start" },
    statLabel: {
      fontSize: 12,
      color: "rgba(255,255,255,0.65)",
      fontWeight: "500",
    },
    statValue: {
      fontSize: 18,
      fontWeight: "700",
      color: "#FFFFFF",
      marginTop: 2,
    },
    progressContainer: { marginTop: 16 },
    progressBar: {
      height: 6,
      backgroundColor: "rgba(255,255,255,0.25)",
      borderRadius: 3,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: "#FFFFFF",
      borderRadius: 3,
    },
    progressLabel: {
      fontSize: 11,
      color: "rgba(255,255,255,0.65)",
      marginTop: 6,
      fontWeight: "500",
    },
    aiCard: {
      marginHorizontal: 24,
      borderRadius: 20,
      backgroundColor: colors.surface,
      padding: 18,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    aiHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      gap: 8,
    },
    aiTitle: { fontSize: 13, fontWeight: "700", color: colors.primary },
    aiBadge: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
    },
    aiBadgeText: { fontSize: 10, color: colors.primary, fontWeight: "700" },
    aiText: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 22,
      fontWeight: "400",
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 24,
      marginBottom: 12,
    },
    sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
    seeAll: { fontSize: 13, color: colors.primary, fontWeight: "600" },
    expenseItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
      backgroundColor: colors.surface,
    },
    expenseIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
    },
    expenseIconText: { fontSize: 20 },
    expenseInfo: { flex: 1 },
    expenseNote: { fontSize: 15, fontWeight: "600", color: colors.text },
    expenseCategory: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    expenseAmount: { fontSize: 16, fontWeight: "700", color: colors.danger },
    expenseDate: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
    emptyState: {
      alignItems: "center",
      paddingVertical: 40,
      paddingHorizontal: 24,
    },
    emptyEmoji: { fontSize: 48, marginBottom: 12 },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
    },
    addButton: {
      marginHorizontal: 24,
      marginTop: 20,
      backgroundColor: colors.primary,
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
    },
    addButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  });

  return (
    <View style={s.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <Text style={s.greeting}>Good day 👋</Text>
          <Text style={s.appName}>CalmSpend AI</Text>
        </View>

        {/* Balance Card */}
        <View style={s.balanceCard}>
          <Text style={s.balanceLabel}>Spent this month</Text>
          <Text style={s.balanceAmount}>
            {budget.currency}
            {totalSpent.toLocaleString("en-IN")}
          </Text>

          <View style={s.balanceRow}>
            <View style={s.balanceStat}>
              <Text style={s.statLabel}>Budget</Text>
              <Text style={s.statValue}>
                {budget.currency}
                {budget.monthly.toLocaleString("en-IN")}
              </Text>
            </View>
            <View style={s.balanceStat}>
              <Text style={s.statLabel}>Remaining</Text>
              <Text style={s.statValue}>
                {budget.currency}
                {Math.max(remaining, 0).toLocaleString("en-IN")}
              </Text>
            </View>
            <View style={s.balanceStat}>
              <Text style={s.statLabel}>Used</Text>
              <Text style={s.statValue}>{Math.round(percentUsed)}%</Text>
            </View>
          </View>

          <View style={s.progressContainer}>
            <View style={s.progressBar}>
              <View style={[s.progressFill, { width: `${percentUsed}%` }]} />
            </View>
            <Text style={s.progressLabel}>
              {percentUsed > 90
                ? "⚠️ Budget almost exhausted"
                : percentUsed > 70
                  ? "📊 Watch your spending"
                  : "✅ On track this month"}
            </Text>
          </View>
        </View>

        {/* AI Insight Card */}
        <View style={s.aiCard}>
          <View style={s.aiHeader}>
            <Text style={{ fontSize: 18 }}>🤖</Text>
            <Text style={s.aiTitle}>AI Insight</Text>
            <View style={s.aiBadge}>
              <Text style={s.aiBadgeText}>CLAUDE</Text>
            </View>
          </View>
          <Text style={s.aiText}>{aiInsight}</Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/ai")}
            style={{ marginTop: 10 }}
          >
            <Text
              style={{ color: colors.primary, fontSize: 13, fontWeight: "600" }}
            >
              Ask more questions →
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Expenses */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Recent Expenses</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/analytics")}>
            <Text style={s.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {recentExpenses.length === 0 ? (
          <View style={s.emptyState}>
            <Text style={s.emptyEmoji}>💸</Text>
            <Text style={s.emptyText}>
              No expenses yet. Add your first one!
            </Text>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 20,
              marginHorizontal: 24,
              overflow: "hidden",
            }}
          >
            {recentExpenses.map((expense) => {
              const cat = getCategoryById(expense.category);
              return (
                <View key={expense.id} style={s.expenseItem}>
                  <View
                    style={[
                      s.expenseIcon,
                      { backgroundColor: colors.primaryLight },
                    ]}
                  >
                    <Text style={s.expenseIconText}>{cat.icon}</Text>
                  </View>
                  <View style={s.expenseInfo}>
                    <Text style={s.expenseNote} numberOfLines={1}>
                      {expense.note || cat.label}
                    </Text>
                    <Text style={s.expenseCategory}>{cat.label}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={s.expenseAmount}>
                      -{budget.currency}
                      {expense.amount.toLocaleString("en-IN")}
                    </Text>
                    <Text style={s.expenseDate}>
                      {new Date(expense.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Quick Add Button */}
        <TouchableOpacity
          style={s.addButton}
          onPress={() => router.push("/(tabs)/add")}
        >
          <Text style={s.addButtonText}>+ Add Expense</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
