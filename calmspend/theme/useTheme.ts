import { useColorScheme } from "react-native";
import { LightColors, DarkColors, AppColors } from "./colors";
import { useExpenseStore } from "../store/useExpenseStore";

export const useTheme = () => {
  const systemScheme = useColorScheme();
  const themePreference = useExpenseStore((s) => s.theme);

  const isDark =
    themePreference === "dark" ||
    (themePreference === "system" && systemScheme === "dark");

  const colors: AppColors = isDark ? DarkColors : LightColors;

  return { colors, isDark };
};
