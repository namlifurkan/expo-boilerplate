---
description: Scaffold a new screen following boilerplate conventions — Screen wrapper, useTranslation, semantic NativeWind tokens, optional tab registration. Use when the user says "yeni ekran ekle", "new screen", "create page", or asks to add a route under app/.
---

# New Screen

Generate a new Expo Router screen file that follows all boilerplate conventions.

## Decisions to make first

Ask the user (in one message, batched):
1. **Where does it live?**
   - `app/<name>.tsx` → top-level stack screen (e.g., `/profile`)
   - `app/(tabs)/<name>.tsx` → tab — also requires registering in `app/(tabs)/_layout.tsx`
   - `app/(auth)/<name>.tsx` → auth flow screen
   - `app/<dir>/[id].tsx` → dynamic route (detail page)
2. **Auth-gated?** If yes (and not under `(tabs)/` which is already gated), add a redirect at the top of the file using `useAuth()`.
3. **i18n keys** — gather screen title + any visible text the user mentions. Use the `add-i18n-key` skill workflow to add them to both locales BEFORE writing the screen file.

## Template

```tsx
import { View, Text } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { useTranslation } from "@/hooks/useTranslation";

export default function <Name>Screen() {
  const { t } = useTranslation();

  return (
    <Screen>
      <View className="flex-1 px-6 pt-6">
        <Text className="text-content-primary text-3xl font-bold mb-2">
          {t("<namespace>.title")}
        </Text>
        <Text className="text-content-secondary text-base">
          {t("<namespace>.subtitle")}
        </Text>
      </View>
    </Screen>
  );
}
```

## Hard requirements

- **Root must be `<Screen>`** (or `SafeAreaView` if the screen needs custom header behavior). Never `<View>` as root.
- **Every visible string is `t("...")`.** No hardcoded EN/TR.
- **Use semantic Tailwind tokens** (`bg-surface-*`, `text-content-*`, `border-stroke-*`, `bg-accent-primary`). No `bg-black`, no `text-white`, no inline hex.
- **For native style props that need a real color** (e.g., `<ActivityIndicator color={...}>`, `<Ionicons color={...}>`), use `useThemeColors()` — never hardcode hex.

## If registering a new tab

Edit `app/(tabs)/_layout.tsx`:
```tsx
<Tabs.Screen
  name="<route-name>"
  options={{
    title: t("navigation.<routeName>"),
    tabBarIcon: ({ color, size }) => (
      <TabIcon name="<ionicon-name>" color={color} size={size} />
    ),
  }}
/>
```
Pick an Ionicons name from `@expo/vector-icons` Ionicons set (outline variants preferred for tabs).

## If creating a dynamic route

`app/<feature>/[id].tsx`:
```tsx
import { useLocalSearchParams } from "expo-router";

export default function <Feature>Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // ...
}
```
Then add a `<Stack.Screen name="<feature>/[id]" options={{...}} />` entry in `app/_layout.tsx` if the screen needs custom presentation (modal, slide-from-bottom, etc.).

## After scaffolding

- Run `npm start` and instruct the user to navigate to the new route to verify
- If typed routes are stale, restart Metro

Do NOT add navigation calls (`router.push("/...")`) speculatively — only add them when the user specifies the entry point.
