import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useTheme } from "../theme/useTheme";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    emoji: "💸",
    title: "Track Every Rupee",
    subtitle:
      "Log expenses in seconds. See where your money goes with beautiful charts and insights.",
    bg: "#6C63FF",
  },
  {
    emoji: "🤖",
    title: "AI Knows Your Habits",
    subtitle:
      "Claude AI analyzes your spending and gives you personalized tips to save more every month.",
    bg: "#FF6B6B",
  },
  {
    emoji: "🎯",
    title: "Hit Your Budget Goals",
    subtitle:
      "Set a monthly budget, track your progress, and get alerts before you overspend.",
    bg: "#2ECC71",
  },
];

export default function Onboarding() {
  const { colors } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);

  const s = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    slide: {
      width,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 40,
      paddingVertical: 60,
    },
    emojiCircle: {
      width: 140,
      height: 140,
      borderRadius: 70,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 40,
    },
    emoji: { fontSize: 64 },
    slideTitle: {
      fontSize: 30,
      fontWeight: "900",
      color: colors.text,
      textAlign: "center",
      lineHeight: 38,
      marginBottom: 16,
    },
    slideSubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 26,
    },
    dotsRow: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 40,
      justifyContent: "center",
    },
    dot: { width: 8, height: 8, borderRadius: 4 },
    bottomSection: { paddingHorizontal: 24, paddingBottom: 50 },
    primaryBtn: {
      backgroundColor: colors.primary,
      borderRadius: 18,
      paddingVertical: 18,
      alignItems: "center",
      marginBottom: 12,
    },
    primaryBtnText: { color: "#FFFFFF", fontSize: 17, fontWeight: "800" },
    skipBtn: { alignItems: "center", paddingVertical: 10 },
    skipBtnText: {
      color: colors.textSecondary,
      fontSize: 15,
      fontWeight: "500",
    },
  });

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.replace("/(tabs)/");
    }
  };

  return (
    <View style={s.container}>
      <ScrollView
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        contentOffset={{ x: currentSlide * width, y: 0 }}
      >
        {SLIDES.map((slide, index) => (
          <View key={index} style={s.slide}>
            <View style={[s.emojiCircle, { backgroundColor: slide.bg + "20" }]}>
              <Text style={s.emoji}>{slide.emoji}</Text>
            </View>
            <Text style={s.slideTitle}>{slide.title}</Text>
            <Text style={s.slideSubtitle}>{slide.subtitle}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={s.dotsRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              s.dot,
              {
                backgroundColor:
                  i === currentSlide ? colors.primary : colors.border,
                width: i === currentSlide ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={s.bottomSection}>
        <TouchableOpacity style={s.primaryBtn} onPress={handleNext}>
          <Text style={s.primaryBtnText}>
            {currentSlide === SLIDES.length - 1 ? "Get Started 🚀" : "Next →"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.skipBtn}
          onPress={() => router.replace("/(tabs)/")}
        >
          <Text style={s.skipBtnText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
