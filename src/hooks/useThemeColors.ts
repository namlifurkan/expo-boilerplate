import { useAppStore } from "@/store/appStore";
import { DarkColors, LightColors, type ThemeColors } from "@/constants/colors";

export function useThemeColors(): ThemeColors {
  const themeMode = useAppStore((s) => s.themeMode);
  return themeMode === "dark" ? DarkColors : LightColors;
}
