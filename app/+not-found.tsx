import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View className="flex-1 items-center justify-center bg-surface-primary px-6">
        <Text className="text-content-primary text-2xl font-bold mb-3">
          Screen not found
        </Text>
        <Link href="/" className="text-accent-primary text-base">
          Go back home
        </Link>
      </View>
    </>
  );
}
