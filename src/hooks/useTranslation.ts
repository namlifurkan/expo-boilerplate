import { useCallback } from "react";
import { i18n } from "@/lib/i18n";
import { useLanguage } from "@/providers/LanguageProvider";

type TranslationOptions = {
  count?: number;
  [key: string]: string | number | undefined;
};

export function useTranslation() {
  const { language, setLanguage, isRTL, supportedLanguages, isLoading } =
    useLanguage();

  const t = useCallback(
    (key: string, options?: TranslationOptions): string => i18n.t(key, options),
    [language]
  );

  const hasTranslation = useCallback(
    (key: string): boolean => {
      const result = i18n.t(key, { defaultValue: "__MISSING__" });
      return result !== "__MISSING__";
    },
    [language]
  );

  return {
    t,
    language,
    setLanguage,
    isRTL,
    supportedLanguages,
    isLoading,
    hasTranslation,
  };
}
