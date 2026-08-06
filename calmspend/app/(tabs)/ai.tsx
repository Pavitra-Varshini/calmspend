import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useState, useRef } from "react";
import { useTheme } from "../../theme/useTheme";
import { useExpenseStore } from "../../store/useExpenseStore";
import { askAI } from "../../services/aiService";

const QUICK_QUESTIONS = [
  "Where did I spend most?",
  "How's my budget looking?",
  "Tips to save money?",
  "What's my biggest expense?",
];

export default function AIChat() {
  const { colors } = useTheme();
  const { expenses, budget, aiHistory, addAiMessage, clearAiHistory } =
    useExpenseStore();

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async (message?: string) => {
    const text = (message || input).trim();
    if (!text || loading) return;

    setInput("");
    addAiMessage({ role: "user", content: text });
    setLoading(true);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    const response = await askAI(text, expenses, budget, aiHistory);
    addAiMessage({ role: "assistant", content: response });
    setLoading(false);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
    },
    title: { fontSize: 28, fontWeight: "800", color: colors.text },
    subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
    clearBtn: {
      fontSize: 13,
      color: colors.danger,
      fontWeight: "600",
    },
    quickRow: {
      paddingHorizontal: 24,
      paddingBottom: 12,
    },
    quickLabel: {
      fontSize: 12,
      color: colors.textMuted,
      fontWeight: "600",
      marginBottom: 8,
      textTransform: "uppercase",
    },
    quickScroll: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
    quickChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.primaryLight,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    quickChipText: { fontSize: 12, color: colors.primary, fontWeight: "600" },
    messageList: { flex: 1, paddingHorizontal: 16 },
    messageBubble: {
      maxWidth: "80%",
      borderRadius: 18,
      padding: 14,
      marginVertical: 4,
    },
    userBubble: {
      alignSelf: "flex-end",
      backgroundColor: colors.primary,
      borderBottomRightRadius: 4,
    },
    aiBubble: {
      alignSelf: "flex-start",
      backgroundColor: colors.surface,
      borderBottomLeftRadius: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    userText: { color: "#FFFFFF", fontSize: 15, lineHeight: 22 },
    aiText: { color: colors.text, fontSize: 15, lineHeight: 22 },
    aiBadgeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 6,
    },
    aiBadge: {
      fontSize: 10,
      color: colors.primary,
      fontWeight: "700",
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    typingDots: {
      flexDirection: "row",
      gap: 4,
      padding: 4,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      paddingHorizontal: 40,
    },
    emptyEmoji: { fontSize: 56, marginBottom: 16 },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    emptySubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: 10,
    },
    input: {
      flex: 1,
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 22,
      paddingHorizontal: 18,
      paddingVertical: 12,
      fontSize: 15,
      color: colors.text,
      maxHeight: 100,
    },
    sendBtn: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    sendBtnText: { fontSize: 20 },
  });

  const renderMessage = ({
    item,
    index,
  }: {
    item: { role: string; content: string };
    index: number;
  }) => {
    const isUser = item.role === "user";
    return (
      <View style={[s.messageBubble, isUser ? s.userBubble : s.aiBubble]}>
        {!isUser && (
          <View style={s.aiBadgeRow}>
            <Text>🤖</Text>
            <Text style={s.aiBadge}>CalmSpend AI</Text>
          </View>
        )}
        <Text style={isUser ? s.userText : s.aiText}>{item.content}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.title}>AI Assistant</Text>
          <Text style={s.subtitle}>Powered by Claude</Text>
        </View>
        {aiHistory.length > 0 && (
          <TouchableOpacity onPress={clearAiHistory}>
            <Text style={s.clearBtn}>Clear chat</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick questions */}
      {aiHistory.length === 0 && (
        <View style={s.quickRow}>
          <Text style={s.quickLabel}>Ask me anything</Text>
          <View style={s.quickScroll}>
            {QUICK_QUESTIONS.map((q) => (
              <TouchableOpacity
                key={q}
                style={s.quickChip}
                onPress={() => handleSend(q)}
              >
                <Text style={s.quickChipText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Messages */}
      {aiHistory.length === 0 ? (
        <View style={s.emptyState}>
          <Text style={s.emptyEmoji}>🤖</Text>
          <Text style={s.emptyTitle}>Your AI Finance Coach</Text>
          <Text style={s.emptySubtitle}>
            Ask me anything about your spending, budget, or how to save money. I
            have full context of your expenses.
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={aiHistory}
          renderItem={renderMessage}
          keyExtractor={(_, i) => i.toString()}
          style={s.messageList}
          contentContainerStyle={{ paddingVertical: 12 }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            loading ? (
              <View style={[s.messageBubble, s.aiBubble]}>
                <View style={s.aiBadgeRow}>
                  <Text>🤖</Text>
                  <Text style={s.aiBadge}>CalmSpend AI</Text>
                </View>
                <ActivityIndicator color={colors.primary} size="small" />
              </View>
            ) : null
          }
        />
      )}

      {/* Input */}
      <View style={s.inputRow}>
        <TextInput
          style={s.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about your spending..."
          placeholderTextColor={colors.textMuted}
          multiline
          onSubmitEditing={() => handleSend()}
        />
        <TouchableOpacity
          style={[s.sendBtn, { opacity: !input.trim() || loading ? 0.5 : 1 }]}
          onPress={() => handleSend()}
          disabled={!input.trim() || loading}
        >
          <Text style={s.sendBtnText}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
