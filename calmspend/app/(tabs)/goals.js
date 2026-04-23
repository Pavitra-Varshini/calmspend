import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// 🌿 LIGHT THEME
const colors = {
  primary: "#6B983F",
  background: "#F2F6E4",
  card: "#E3EDC4",
  cardSoft: "#F7FAED",
  textPrimary: "#2F3E1F",
  textSecondary: "#6B983F",
  accent: "#B2CD80",
  border: "#D6E2B3",
  shadow: "#6B983F33",
};

// 🌿 DEMO DATA
const GOALS = [
  { id: "1", name: "Emergency Fund", saved: 45000, target: 60000, pace: 5000 },
  { id: "2", name: "Goa Trip", saved: 8500, target: 20000, pace: 2000 },
  { id: "3", name: "MacBook", saved: 32000, target: 120000, pace: 8000 },
];

// 🌿 Dynamic color
const getColor = (p) => {
  if (p < 0.3) return "#8AA06A";
  if (p < 0.7) return "#6B983F";
  return "#4CAF6A";
};

// 🍀 Animated Clover (soft + breathing)
const Clover = () => {
  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = withRepeat(
      withTiming(1, { duration: 7000, easing: Easing.linear }),
      -1,
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(rotate.value, [0, 1], [-3, 3])}deg`,
      },
    ],
  }));

  return (
    <Animated.Text style={[{ fontSize: 42, opacity: 0.9 }, style]}>
      🌿
    </Animated.Text>
  );
};

// 🌿 Goal Card
const GoalCard = ({ goal }) => {
  const progress = goal.saved / goal.target;
  const color = getColor(progress);
  const scale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const months = Math.ceil((goal.target - goal.saved) / goal.pace);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={() => (scale.value = withTiming(0.97))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    >
      <Animated.View style={[styles.card, pressStyle]}>
        <View style={styles.row}>
          <Clover />

          <View style={{ marginLeft: 12 }}>
            <Text style={styles.title}>{goal.name}</Text>
            <Text style={styles.amount}>
              ₹{goal.saved.toLocaleString("en-IN")} / ₹
              {goal.target.toLocaleString("en-IN")}
            </Text>

            <Text style={styles.insight}>
              🌿 You’ll bloom in {months} months
            </Text>
          </View>
        </View>

        <View style={styles.bar}>
          <View
            style={[
              styles.fill,
              {
                width: `${progress * 100}%`,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// 🌿 MAIN SCREEN
export default function goals() {
  const [goals] = useState(GOALS);

  const primary = goals.reduce((a, b) =>
    a.saved / a.target > b.saved / b.target ? a : b,
  );

  const progress = primary.saved / primary.target;

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* 🌫 Soft Glow Background */}
      <View style={styles.bgGlow} />

      <ScrollView contentContainerStyle={styles.container}>
        {/* 🌿 HEADER */}
        <Text style={styles.header}>Your Garden 🌿</Text>
        <Text style={styles.sub}>Watch your goals bloom beautifully</Text>

        {/* 🌟 HERO CARD */}
        <View style={styles.heroCard}>
          <Clover />
          <Text style={styles.heroTitle}>{primary.name}</Text>
          <Text style={styles.heroAmount}>
            ₹{primary.saved.toLocaleString("en-IN")} / ₹
            {primary.target.toLocaleString("en-IN")}
          </Text>

          <View style={styles.bar}>
            <View
              style={[
                styles.fill,
                {
                  width: `${progress * 100}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
        </View>

        {/* 🌿 GOALS LIST */}
        {goals.map((g) => (
          <GoalCard key={g.id} goal={g} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// 🌿 STYLES
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  bgGlow: {
    position: "absolute",
    top: 80,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.accent,
    opacity: 0.25,
  },

  header: {
    fontSize: 26,
    color: colors.textPrimary,
    marginBottom: 4,
  },

  sub: {
    color: "#8AA06A",
    marginBottom: 20,
  },

  heroCard: {
    backgroundColor: colors.cardSoft,
    padding: 22,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 20,

    shadowColor: colors.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },

  heroTitle: {
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 10,
  },

  heroAmount: {
    color: colors.textSecondary,
    marginTop: 4,
  },

  card: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,

    borderWidth: 1,
    borderColor: colors.border,

    shadowColor: colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    fontSize: 16,
    color: colors.textPrimary,
  },

  amount: {
    fontSize: 13,
    color: colors.textSecondary,
  },

  insight: {
    fontSize: 12,
    color: "#6B983F",
    marginTop: 4,
  },

  bar: {
    height: 6,
    backgroundColor: "#DCE7BE",
    borderRadius: 3,
    marginTop: 12,
    overflow: "hidden",
  },

  fill: {
    height: 6,
    borderRadius: 3,
  },
});
