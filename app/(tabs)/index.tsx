import { View, Text } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { useTranslation } from "@/hooks/useTranslation";

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <Screen>
      <View className="flex-1 px-6 pt-6">
        <Text className="text-content-primary text-3xl font-bold mb-2">
          {t("home.title")}
        </Text>
        <Text className="text-content-secondary text-base">
          {t("home.subtitle")}
        </Text>
      </View>
    </Screen>
  );
}
