import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppState {
  themeMode: "dark" | "light";
  language: "en" | "tr";
  setThemeMode: (mode: "dark" | "light") => void;
  setLanguage: (lang: "en" | "tr") => void;
  reset: () => void;
}

const initialState = {
  themeMode: "dark" as const,
  language: "en" as const,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,
      setThemeMode: (mode) => set({ themeMode: mode }),
      setLanguage: (lang) => set({ language: lang }),
      reset: () => set({ ...initialState }),
    }),
    {
      name: "boilerplate-store",
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState) => persistedState as Partial<AppState>,
    }
  )
);
