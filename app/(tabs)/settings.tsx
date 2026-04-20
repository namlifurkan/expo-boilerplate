import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/ui/Screen";
import { useTranslation } from "@/hooks/useTranslation";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAppStore } from "@/store/appStore";
import { useAuth } from "@/providers/AuthProvider";
import { SUPPORTED_LANGUAGES, SupportedLanguage } from "@/lib/i18n";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-8">
      <Text className="text-content-tertiary text-xs uppercase tracking-wider mb-3 px-2">
        {title}
      </Text>
      <View className="bg-surface-card rounded-2xl overflow-hidden border border-stroke-secondary">
        {children}
      </View>
    </View>
  );
}

function Row({
  label,
  active,
  onPress,
  destructive,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  destructive?: boolean;
}) {
  const colors = useThemeColors();
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between px-4 py-4 border-b border-stroke-secondary"
    >
      <Text
        className="text-base"
        style={{
          color: destructive ? "#FF5252" : colors.text.primary,
          fontWeight: active ? "600" : "400",
        }}
      >
        {label}
      </Text>
      {active && (
        <Ionicons name="checkmark" size={20} color={colors.accent.primary} />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { t, language, setLanguage } = useTranslation();
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const { signOut } = useAuth();

  return (
    <Screen>
      <ScrollView className="flex-1 px-4 pt-6">
        <Text className="text-content-primary text-3xl font-bold mb-8 px-2">
          {t("settings.title")}
        </Text>

        <Section title={t("settings.appearance")}>
          <Row
            label={t("settings.themeDark")}
            active={themeMode === "dark"}
            onPress={() => setThemeMode("dark")}
          />
          <Row
            label={t("settings.themeLight")}
            active={themeMode === "light"}
            onPress={() => setThemeMode("light")}
          />
        </Section>

        <Section title={t("settings.language")}>
          {(Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[]).map(
            (code) => (
              <Row
                key={code}
                label={SUPPORTED_LANGUAGES[code].nativeName}
                active={language === code}
                onPress={() => setLanguage(code)}
              />
            )
          )}
        </Section>

        <Section title={t("settings.account")}>
          <Row
            label={t("auth.signOut")}
            destructive
            onPress={() => signOut()}
          />
        </Section>
      </ScrollView>
    </Screen>
  );
}
