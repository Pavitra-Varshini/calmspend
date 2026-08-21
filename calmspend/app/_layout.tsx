import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTheme } from "../theme/useTheme";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const { isDark } = useTheme();

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
