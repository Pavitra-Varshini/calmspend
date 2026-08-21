export const LightColors = {
  // ── Primary (Sage green) ──────────────────────────────
  primary: "#C2D491", // brand, buttons, progress bars
  primarySubtle: "#D6E7A8", // hover bg, chips
  primaryLight: "#F2F6E4", // tint bg, selected rows, tag fills
  primaryDark: "#6B983F", // text on light bg, icon fills
  primaryDeep: "#4A6B2A", // dark-mode pressed states

  // ── Accent (Blush coral) ─────────────────────────────
  accent: "#E88B8B", // overspend, alerts, danger indicators
  accentSubtle: "#F5CECE", // chip bg, badge fills
  accentLight: "#FFF0F0", // alert section bg
  accentDark: "#B83A3A", // text on light bg
  accentDeep: "#7A2020", // dark-mode fills

  // ── Neutral surfaces ──────────────────────────────────
  background: "#F7F8F4", // app canvas (sage-tinted white)
  surface: "#FFFFFF", // cards, sheets, modals
  surfaceTint: "#EDF1E6", // selected rows, elevated card
  border: "#D8DDD0", // dividers, outlines
  borderLight: "#EDF1E6", // subtle separators

  // ── Text ─────────────────────────────────────────────
  text: "#6B983F", // primary — deep forest, not pure black
  textSecondary: "#5A6B50", // supporting copy
  textMuted: "#9AA88C", // hints, placeholders, captions
  textInverse: "#FFFFFF",

  // ── Semantic ─────────────────────────────────────────
  success: "#6B983F", // reuse primaryDark for success
  successLight: "#F2F6E4",
  warning: "#F6C864",
  warningLight: "#FEF8E6",
  danger: "#E88B8B", // reuse accent for danger
  dangerLight: "#FFF0F0",

  // ── Category colors ───────────────────────────────────
  food: "#FF8A65",
  transport: "#4DB6AC",
  shopping: "#E88B8B", // accent — feels natural
  health: "#A8D8B0",
  entertainment: "#B39DDB",
  bills: "#F6C864",
  savings: "#C2D491", // primary — savings = calm growth
  other: "#B0B8A8",

  // ── Tab bar ───────────────────────────────────────────
  tabBar: "#EDF1E6",
  tabBarBorder: "#EDF1E6",
  tabBarActive: "#6B983F",
  tabBarInactive: "#555b50",

  card: "#FFFFFF",
  cardShadow: "rgba(107, 152, 63, 0.08)", // sage-tinted shadow
};

export const DarkColors: typeof LightColors = {
  primary: "#8FB85C",
  primarySubtle: "#2A4A1A",
  primaryLight: "#1A2A10",
  primaryDark: "#C2D491",
  primaryDeep: "#DDEABC",

  accent: "#E88B8B",
  accentSubtle: "#4A1C1C",
  accentLight: "#2D1515",
  accentDark: "#F5AEAE",
  accentDeep: "#FACCCC",

  background: "#0F1510",
  surface: "#1A2418",
  surfaceTint: "#233020",
  border: "#2E402A",
  borderLight: "#1A2A18",

  text: "#E8EFE0",
  textSecondary: "#8AA880",
  textMuted: "#5A7050",
  textInverse: "#1A2214",

  success: "#8FB85C",
  successLight: "#1A2A10",
  warning: "#F6C864",
  warningLight: "#2A200A",
  danger: "#E88B8B",
  dangerLight: "#2D1515",

  food: "#FF8A65",
  transport: "#4DB6AC",
  shopping: "#E88B8B",
  health: "#A8D8B0",
  entertainment: "#B39DDB",
  bills: "#F6C864",
  savings: "#8FB85C",
  other: "#6B7B60",

  tabBar: "#1A2418",
  tabBarBorder: "#2E402A",
  tabBarActive: "#C2D491",
  tabBarInactive: "#5A7050",

  card: "#1A2418",
  cardShadow: "rgba(0, 0, 0, 0.35)",
};

export type AppColors = typeof LightColors;
