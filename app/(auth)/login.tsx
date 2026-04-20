import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { signInWithApple, signInWithGoogle } from "@/services/auth";
import { useTranslation } from "@/hooks/useTranslation";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function LoginScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [loading, setLoading] = useState<"apple" | "google" | null>(null);

  const handleApple = async () => {
    setLoading("apple");
    const { error } = await signInWithApple();
    setLoading(null);
    if (error) {
      Alert.alert(t("auth.errorTitle"), t("auth.errorMessage"));
    }
  };

  const handleGoogle = async () => {
    setLoading("google");
    const { error } = await signInWithGoogle();
    setLoading(null);
    if (error) {
      Alert.alert(t("auth.errorTitle"), t("auth.errorMessage"));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-primary">
      <View className="flex-1 px-6 justify-center">
        <View className="items-center mb-12">
          <View
            className="w-20 h-20 rounded-3xl items-center justify-center mb-6"
            style={{ backgroundColor: colors.accent.primary + "1A" }}
          >
            <Ionicons name="rocket" size={40} color={colors.accent.primary} />
          </View>
          <Text className="text-content-primary text-3xl font-bold mb-2">
            {t("auth.welcome")}
          </Text>
          <Text className="text-content-secondary text-base">
            {t("auth.tagline")}
          </Text>
        </View>

        <View className="gap-3">
          {Platform.OS === "ios" && (
            <TouchableOpacity
              onPress={handleApple}
              disabled={loading !== null}
              className="bg-content-primary rounded-2xl py-4 items-center justify-center flex-row"
              style={{ opacity: loading === "apple" ? 0.7 : 1 }}
            >
              {loading === "apple" ? (
                <ActivityIndicator color={colors.bg.primary} />
              ) : (
                <>
                  <Ionicons
                    name="logo-apple"
                    size={20}
                    color={colors.bg.primary}
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    className="font-semibold text-base"
                    style={{ color: colors.bg.primary }}
                  >
                    {t("auth.signInWithApple")}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleGoogle}
            disabled={loading !== null}
            className="border border-stroke-primary rounded-2xl py-4 items-center justify-center flex-row"
            style={{ opacity: loading === "google" ? 0.7 : 1 }}
          >
            {loading === "google" ? (
              <ActivityIndicator color={colors.text.primary} />
            ) : (
              <>
                <Ionicons
                  name="logo-google"
                  size={20}
                  color={colors.text.primary}
                  style={{ marginRight: 8 }}
                />
                <Text className="text-content-primary font-semibold text-base">
                  {t("auth.signInWithGoogle")}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
