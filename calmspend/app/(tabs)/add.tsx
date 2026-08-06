import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useState } from "react";
import { useTheme } from "../../theme/useTheme";
import { useExpenseStore } from "../../store/useExpenseStore";
import { CATEGORIES } from "../../constants/categories";
import { router } from "expo-router";

export default function AddExpense() {
  const { colors } = useTheme();
  const { addExpense, budget } = useExpenseStore();

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid amount.");
      return;
    }

    addExpense({
      amount: parsedAmount,
      category: selectedCategory,
      note: note.trim(),
      date: new Date(date).toISOString(),
    });

    Alert.alert("✅ Saved!", "Expense added successfully.", [
      {
        text: "Add Another",
        onPress: () => {
          setAmount("");
          setNote("");
        },
      },
      { text: "Go Home", onPress: () => router.push("/(tabs)/") },
    ]);
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 24,
    },
    title: { fontSize: 28, fontWeight: "800", color: colors.text },
    subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
    amountCard: {
      marginHorizontal: 24,
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 24,
      marginBottom: 20,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    amountLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    amountRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
    currency: { fontSize: 32, fontWeight: "800", color: colors.primary },
    amountInput: {
      fontSize: 48,
      fontWeight: "900",
      color: colors.text,
      minWidth: 120,
      textAlign: "center",
    },
    section: { marginHorizontal: 24, marginBottom: 20 },
    sectionLabel: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textSecondary,
      marginBottom: 12,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    categoryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    categoryChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1.5,
    },
    categoryEmoji: { fontSize: 16 },
    categoryLabel: { fontSize: 13, fontWeight: "600" },
    noteInput: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      fontSize: 15,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      minHeight: 80,
    },
    dateInput: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      fontSize: 15,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    saveButton: {
      marginHorizontal: 24,
      backgroundColor: colors.primary,
      borderRadius: 18,
      paddingVertical: 18,
      alignItems: "center",
      marginBottom: 40,
    },
    saveButtonText: { color: "#FFFFFF", fontSize: 17, fontWeight: "800" },
  });

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={s.title}>Add Expense</Text>
          <Text style={s.subtitle}>Track where your money goes</Text>
        </View>

        {/* Amount Input */}
        <View style={s.amountCard}>
          <Text style={s.amountLabel}>How much did you spend?</Text>
          <View style={s.amountRow}>
            <Text style={s.currency}>{budget.currency}</Text>
            <TextInput
              style={s.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              autoFocus
            />
          </View>
        </View>

        {/* Category */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Category</Text>
          <View style={s.categoryGrid}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    s.categoryChip,
                    {
                      backgroundColor: isSelected
                        ? colors.primaryLight
                        : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Text style={s.categoryEmoji}>{cat.icon}</Text>
                  <Text
                    style={[
                      s.categoryLabel,
                      {
                        color: isSelected
                          ? colors.primary
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Note */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Note (optional)</Text>
          <TextInput
            style={s.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="What was this for?"
            placeholderTextColor={colors.textMuted}
            multiline
          />
        </View>

        {/* Date */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Date</Text>
          <TextInput
            style={s.dateInput}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={s.saveButton} onPress={handleSave}>
          <Text style={s.saveButtonText}>Save Expense</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
