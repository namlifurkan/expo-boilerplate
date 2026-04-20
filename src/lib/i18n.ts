import { I18n } from "i18n-js";
import * as Localization from "expo-localization";

import en from "@/locales/en.json";
import tr from "@/locales/tr.json";

export const SUPPORTED_LANGUAGES = {
  en: { name: "English", nativeName: "English" },
  tr: { name: "Turkish", nativeName: "Türkçe" },
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

const i18n = new I18n({ en, tr });

const deviceLocale = Localization.getLocales()[0]?.languageCode ?? "en";
i18n.locale = deviceLocale in SUPPORTED_LANGUAGES ? deviceLocale : "en";
i18n.enableFallback = true;
i18n.defaultLocale = "en";

export function getDeviceLocale(): SupportedLanguage {
  const locale = Localization.getLocales()[0]?.languageCode ?? "en";
  return locale in SUPPORTED_LANGUAGES
    ? (locale as SupportedLanguage)
    : "en";
}

export function getDeviceRegion(): string {
  return Localization.getLocales()[0]?.regionCode ?? "";
}

export function isRTL(language: SupportedLanguage): boolean {
  const rtlLanguages: string[] = [];
  return rtlLanguages.includes(language);
}

export { i18n };
