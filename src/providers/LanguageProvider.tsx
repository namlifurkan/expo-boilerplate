import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  i18n,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  getDeviceLocale,
  isRTL,
} from "@/lib/i18n";
import { useAppStore } from "@/store/appStore";

const LANGUAGE_STORAGE_KEY = "@boilerplate/language";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  isRTL: boolean;
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: async () => {},
  isRTL: false,
  supportedLanguages: SUPPORTED_LANGUAGES,
  isLoading: true,
});

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const storeLanguage = useAppStore((s) => s.language);
  const setStoreLanguage = useAppStore((s) => s.setLanguage);
  const [language, setLanguageState] = useState<SupportedLanguage>(
    getDeviceLocale()
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const currentStoreLanguage = useAppStore.getState().language;
        if (currentStoreLanguage) {
          setLanguageState(currentStoreLanguage);
          i18n.locale = currentStoreLanguage;
          setIsLoading(false);
          return;
        }

        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (savedLanguage && savedLanguage in SUPPORTED_LANGUAGES) {
          const lang = savedLanguage as SupportedLanguage;
          setLanguageState(lang);
          i18n.locale = lang;
        }
      } catch (error) {
        console.error("Failed to load language preference:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, []);

  useEffect(() => {
    if (storeLanguage && storeLanguage !== language) {
      setLanguageState(storeLanguage);
      i18n.locale = storeLanguage;
    }
  }, [storeLanguage]);

  const setLanguage = useCallback(
    async (lang: SupportedLanguage) => {
      try {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
        setLanguageState(lang);
        i18n.locale = lang;
        setStoreLanguage(lang);
      } catch (error) {
        console.error("Failed to save language preference:", error);
        throw error;
      }
    },
    [setStoreLanguage]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isRTL: isRTL(language),
        supportedLanguages: SUPPORTED_LANGUAGES,
        isLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
