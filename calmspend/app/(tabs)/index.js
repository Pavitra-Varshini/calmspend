import React, { useEffect } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_W } = Dimensions.get("window");

// 🌿 LIGHT THEME
const T = {
  bg: "#F2F6E4",
  bgCard: "#FFFFFF",
  bgCardSoft: "#F6F9EA",
  accent: "#6b983f",
  accentLight: "#8FBF5A",
  accentDim: "#DDE8C5",

  gold: "#C8A94A",
  red: "#E57373",
  amber: "#E0A870",

  text: "#2F3E2E",
  textMuted: "#7A8F6B",
  textDim: "#A5B59C",

  border: "#E3EBD3",
  shadow: "#6b983f",
};

// 🌫 FLOATING PARTICLES
const FloatingParticles = ({ delay = 0, left = 50 }) => {
  const y = useSharedValue(0);

  useEffect(() => {
    y.value = withDelay(
      delay,
      withRepeat(withTiming(-30, { duration: 4000 }), -1, true),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
    opacity: 0.3,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 120,
          left,
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: T.accent,
        },
        style,
      ]}
    />
  );
};

// 🌿 SIMPLE ARC
const ArcChart = ({ progress }) => {
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: 32, color: T.accent }}>
        {Math.round(progress * 100)}%
      </Text>
      <Text style={{ color: T.textMuted }}>calm score</Text>
    </View>
  );
};

// 🌿 MAIN
export default function Index() {
  const fade = useSharedValue(0);

  useEffect(() => {
    fade.value = withTiming(1, { duration: 600 });
  }, []);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateY: interpolate(fade.value, [0, 1], [20, 0]) }],
  }));

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* 🌫 Particles */}
      <FloatingParticles delay={0} left={40} />
      <FloatingParticles delay={800} left={120} />
      <FloatingParticles delay={1600} left={200} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* HEADER */}
        <Animated.View style={[styles.header, fadeStyle]}>
          <View>
            <Text style={styles.greeting}>Good morning 🌿</Text>
            <Text style={styles.date}>Track your calm spending</Text>
          </View>
        </Animated.View>

        {/* BALANCE */}
        <Animated.View style={[styles.card, fadeStyle]}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balance}>₹1,24,850</Text>

          <View style={{ marginTop: 20 }}>
            <ArcChart progress={0.73} />
          </View>
        </Animated.View>

        {/* QUICK ACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.row}>
            {["➕", "💸", "🌱", "✨"].map((icon, i) => (
              <TouchableOpacity key={i} style={styles.quickBtn}>
                <Text style={{ fontSize: 22 }}>{icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Text style={{ color: "#fff", fontSize: 24 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// 🌿 STYLES
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: T.bg,
  },

  scroll: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
  },

  header: {
    marginBottom: 20,
  },

  greeting: {
    fontSize: 22,
    color: T.text,
    fontWeight: "600",
  },

  date: {
    color: T.textMuted,
    marginTop: 4,
  },

  card: {
    backgroundColor: T.bgCard,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,

    shadowColor: T.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },

  balanceLabel: {
    color: T.textMuted,
  },

  balance: {
    fontSize: 32,
    color: T.text,
    fontWeight: "bold",
    marginTop: 6,
  },

  section: {
    marginTop: 10,
  },

  sectionTitle: {
    color: T.text,
    fontWeight: "600",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  quickBtn: {
    width: 70,
    height: 70,
    backgroundColor: T.bgCardSoft,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: T.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: T.accent,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: T.accent,
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
});
