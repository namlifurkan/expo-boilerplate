import { useEffect } from "react";
import { useColorScheme } from "nativewind";
import { useAppStore } from "@/store/appStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeMode = useAppStore((s) => s.themeMode);
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(themeMode);
  }, [themeMode, setColorScheme]);

  return <>{children}</>;
}
