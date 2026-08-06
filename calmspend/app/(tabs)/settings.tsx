import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Switch,
} from "react-native";
import { useState } from "react";
import { useTheme } from "../../theme/useTheme";
import { useExpenseStore } from "../../store/useExpenseStore";

export default function Settings() {
  const { colors, isDark } = useTheme();
  const { budget, updateBudget, theme, setTheme } = useExpenseStore();

  const [monthlyBudget, setMonthlyBudget] = useState(budget.monthly.toString());

  const handleSaveBudget = () => {
    const parsed = parseFloat(monthlyBudget);
    if (isNaN(parsed) || parsed <= 0) {
      Alert.alert("Invalid", "Please enter a valid budget amount.");
      return;
    }
    updateBudget({ ...budget, monthly: parsed });
    Alert.alert("✅ Saved!", "Your budget has been updated.");
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 24 },
    title: { fontSize: 28, fontWeight: "800", color: colors.text },
    subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
    section: { marginHorizontal: 24, marginBottom: 24 },
    sectionLabel: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 12,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    settingRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    settingEmoji: { fontSize: 22, width: 36 },
    settingInfo: { flex: 1, marginLeft: 8 },
    settingTitle: { fontSize: 15, fontWeight: "600", color: colors.text },
    settingSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    themeChipRow: { flexDirection: "row", gap: 10, marginTop: 4 },
    themeChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 1.5,
    },
    themeChipText: { fontSize: 13, fontWeight: "600" },
    budgetRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 18,
      paddingVertical: 16,
    },
    currencyLabel: { fontSize: 20, fontWeight: "800", color: colors.primary },
    budgetInput: {
      flex: 1,
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
    },
    saveBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 10,
    },
    saveBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
    aboutCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 20,
      alignItems: "center",
    },
    aboutEmoji: { fontSize: 48, marginBottom: 12 },
    aboutTitle: { fontSize: 18, fontWeight: "800", color: colors.text },
    aboutSub: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 6,
      lineHeight: 20,
    },
    badge: {
      marginTop: 10,
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 8,
    },
    badgeText: { fontSize: 12, color: colors.primary, fontWeight: "700" },
  });

  const themes = [
    { value: "light", label: "☀️ Light" },
    { value: "dark", label: "🌙 Dark" },
    { value: "system", label: "📱 System" },
  ] as const;

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={s.title}>Settings</Text>
          <Text style={s.subtitle}>Customize your experience</Text>
        </View>

        {/* Budget Section */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Monthly Budget</Text>
          <View style={s.card}>
            <View style={s.budgetRow}>
              <Text style={s.currencyLabel}>{budget.currency}</Text>
              <TextInput
                style={s.budgetInput}
                value={monthlyBudget}
                onChangeText={setMonthlyBudget}
                keyboardType="decimal-pad"
                placeholderTextColor={colors.textMuted}
              />
              <TouchableOpacity style={s.saveBtn} onPress={handleSaveBudget}>
                <Text style={s.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Appearance */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Appearance</Text>
          <View style={s.card}>
            <View style={[s.settingRow, { borderBottomWidth: 0 }]}>
              <Text style={s.settingEmoji}>🎨</Text>
              <View style={s.settingInfo}>
                <Text style={s.settingTitle}>Theme</Text>
                <Text style={s.settingSubtitle}>
                  Choose your preferred theme
                </Text>
                <View style={s.themeChipRow}>
                  {themes.map((t) => (
                    <TouchableOpacity
                      key={t.value}
                      style={[
                        s.themeChip,
                        {
                          backgroundColor:
                            theme === t.value
                              ? colors.primaryLight
                              : colors.surfaceSecondary,
                          borderColor:
                            theme === t.value ? colors.primary : colors.border,
                        },
                      ]}
                      onPress={() => setTheme(t.value)}
                    >
                      <Text
                        style={[
                          s.themeChipText,
                          {
                            color:
                              theme === t.value
                                ? colors.primary
                                : colors.textSecondary,
                          },
                        ]}
                      >
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* About */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>About</Text>
          <View style={s.aboutCard}>
            <Text style={s.aboutEmoji}>💸</Text>
            <Text style={s.aboutTitle}>CalmSpend AI</Text>
            <Text style={s.aboutSub}>
              Track expenses effortlessly and get AI-powered insights about your
              spending habits. Built with React Native + Claude AI.
            </Text>
            <View style={s.badge}>
              <Text style={s.badgeText}>Portfolio Project v1.0</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
