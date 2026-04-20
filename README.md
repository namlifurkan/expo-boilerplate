# Expo Boilerplate

Opinionated, minimal starter for new mobile apps. Stack ve pattern'ler hazır geliyor — yeni projede config'le vakit kaybetmeden iş kodu yazmaya başlamak için.

## Stack

- **Expo SDK 54** + React Native 0.81 (New Architecture)
- **Expo Router v6** (typed routes)
- **NativeWind v4** — light/dark CSS variable üzerinden
- **Supabase** auth + DB client (session Keychain/Keystore'da, `secureStorage` adapter)
- **Apple Sign-In** + **Google OAuth** kutudan çıkıyor
- **i18n** (en/tr) — device locale otomatik
- **Zustand** persisted store (theme + language)
- **TanStack Query** root layout'ta wired
- **Error boundary**, **OTA update hook**, typed paths (`@/*`)

---

## Yeni proje açma

İki yol var. Hangisi rahat geliyorsa.

### Yol 1 — `gh` ile template'ten klonla (önerilen)

GitHub'da repo Settings → "Template repository" kutusunu işaretle. Sonra:

```bash
gh repo create my-new-app --template namlifurkan/expo-boilerplate --private --clone
cd my-new-app
```

### Yol 2 — `degit` ile git geçmişi olmadan klonla

Template kutusunu işaretlemeden de çalışır:

```bash
npx degit namlifurkan/expo-boilerplate my-new-app
cd my-new-app
git init && git add -A && git commit -m "Initial commit from boilerplate"
```

### Yol 3 — düz `git clone`

```bash
git clone https://github.com/namlifurkan/expo-boilerplate.git my-new-app
cd my-new-app
rm -rf .git && git init
```

---

## Setup (her yeni projede)

```bash
# 1. Bağımlılıklar
npm install

# 2. Env
cp .env.example .env
# .env içine EXPO_PUBLIC_SUPABASE_URL ve EXPO_PUBLIC_SUPABASE_ANON_KEY gir

# 3. Geliştirme sunucusu
npm start
```

Sonra `i` → iOS simulator, `a` → Android emulator, ya da QR'ı Expo Go / dev client ile tara.

İlk native build (Apple Sign-In + secure store native modülleri için Expo Go yetmez):

```bash
npm run ios       # local build (Xcode gerekir)
# veya
eas build --profile development --platform ios   # remote build
```

---

## Yeni projede değiştirilecekler (sırayla)

### 1. App identity — `app.config.js`

```js
expo: {
  name: "MyApp",                              // App Store / Play görünen ad
  slug: "my-app",                             // EAS slug
  scheme: "myapp",                            // deep link → myapp://...
  ios: { bundleIdentifier: "com.you.myapp" },
  android: { package: "com.you.myapp" },
  owner: "your-expo-username",
  extra: { eas: { projectId: "REPLACE_..." } },
  updates: { url: "https://u.expo.dev/REPLACE_..." },
}
```

`scheme` değişirse **`src/services/auth.ts` içindeki `APP_SCHEME` sabitini de güncelle** (Google OAuth redirect için).

### 2. EAS bağla

```bash
npm install -g eas-cli
eas login
eas init                    # projectId üretip app.config.js'e basar
eas update:configure        # OTA update URL'sini ayarlar
```

### 3. Supabase

- [supabase.com](https://supabase.com) → yeni proje aç → URL + anon key'i `.env`'e koy
- Apple/Google providers'ı Supabase Auth → Providers'tan aç
- Schema oluşturduktan sonra TypeScript tipleri:

```bash
npx supabase gen types typescript --project-id <id> > src/types/database.ts
```

### 4. Submit credentials — `eas.json`

```json
"submit": {
  "production": {
    "ios": {
      "appleId": "you@example.com",
      "ascAppId": "123456789",
      "appleTeamId": "ABCDEF1234"
    },
    "android": {
      "serviceAccountKeyPath": "./play-store-key.json",
      "track": "internal"
    }
  }
}
```

### 5. Persisted store ismi — `src/store/appStore.ts`

```ts
name: "myapp-store",   // "boilerplate-store" → kendi adın
```

(Aynı cihazda birden çok boilerplate-tabanlı app varsa store çakışmasın diye.)

### 6. Assets

`assets/` içindeki `icon.png` (1024×1024), `adaptive-icon.png`, `splash-icon.png`, `favicon.png` — kendi marka assetlerinle değiştir.

---

## Günlük kullanım

### Yeni ekran ekle

```bash
# app/profile.tsx → otomatik /profile route'u olur
```

```tsx
import { Screen } from "@/components/ui/Screen";
import { useTranslation } from "@/hooks/useTranslation";

export default function ProfileScreen() {
  const { t } = useTranslation();
  return (
    <Screen>
      <Text className="text-content-primary">{t("profile.title")}</Text>
    </Screen>
  );
}
```

Sonra `src/locales/en.json` ve `tr.json`'a `profile.title` key'ini ekle.

### Yeni tab ekle

`app/(tabs)/yeni-tab.tsx` oluştur, sonra `app/(tabs)/_layout.tsx` içine `<Tabs.Screen name="yeni-tab" .../>` ekle.

### Supabase çağrısı

```tsx
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

function useThings() {
  return useQuery({
    queryKey: ["things"],
    queryFn: async () => {
      const { data, error } = await supabase.from("things").select("*");
      if (error) throw error;
      return data;
    },
  });
}
```

### Auth state'e erişim

```tsx
import { useAuth } from "@/providers/AuthProvider";

const { user, session, isLoading, signOut } = useAuth();
```

### Theme/dil değiştir

```tsx
import { useAppStore } from "@/store/appStore";
import { useTranslation } from "@/hooks/useTranslation";

const setThemeMode = useAppStore((s) => s.setThemeMode);
const { setLanguage } = useTranslation();

setThemeMode("light");
setLanguage("tr");
```

---

## Convention'lar (ZORUNLU)

- **i18n:** Görünen TÜM metin `t("key")` ile. Hardcoded Türkçe/İngilizce yazma. Her key hem `en.json` hem `tr.json`'a eklenmeli.
- **Screen wrapper:** Her ekran `<Screen>` veya `SafeAreaView` ile sarılı. Bare `<View>` ile başlama.
- **Theme tokens:** `bg-surface-primary`, `text-content-primary`, `border-stroke-primary` gibi semantic class'lar kullan. `bg-black`, `text-white` gibi hardcoded renk yazma — light/dark otomatik bozulur.
- **Path alias:** `import { x } from "@/lib/..."` — relatif `../../../lib` yazma.
- **Reuse:** Yeni UI elementi yazmadan önce `src/components/ui/` kontrol et. Üç yerde tekrar eden pattern → component'e çıkar.

---

## Project structure

```
app/                       # Expo Router (file-based)
├── _layout.tsx            # Root: providers + Stack
├── index.tsx              # Auth gate redirect
├── (auth)/login.tsx       # Apple + Google sign-in
└── (tabs)/                # Home + Settings
src/
├── components/            # ErrorBoundary, ui/Screen
├── constants/colors.ts    # Light + dark theme tokens
├── hooks/                 # useThemeColors, useTranslation, useOTAUpdate
├── lib/                   # supabase, i18n, secureStorage
├── locales/{en,tr}.json   # Translation strings
├── providers/             # AuthProvider, LanguageProvider, ThemeProvider
├── services/auth.ts       # signInWithApple / signInWithGoogle / signOut
├── store/appStore.ts      # Zustand: theme + language
└── types/database.ts      # Supabase types stub
```

---

## EAS branch ↔ channel eşleşmesi (KRİTİK)

| Build profile | Channel       | Update komutu                       |
| ------------- | ------------- | ----------------------------------- |
| `production`  | `production`  | `eas update --branch production`    |
| `preview`     | `preview`     | `eas update --branch preview`       |
| `development` | `development` | `eas update --branch development`   |

**ASLA** `eas update --branch main` çalıştırma. Hiçbir build `main` channel'ini dinlemez, update hiçbir cihaza ulaşmaz, sessizce kaybolur.

---

## Troubleshooting

- **"No development build installed"** → `eas build --profile development --platform ios` ile dev client üret, simulator'a yükle. Apple Sign-In ve secure store native modüller, Expo Go ile çalışmaz.
- **Apple Sign-In butonu basılınca hiçbir şey olmuyor** → Bundle identifier'ın Apple Developer'da "Sign in with Apple" capability ile eşleştiğinden emin ol. Supabase → Auth → Providers → Apple → Service ID + Secret Key tanımlı mı?
- **Google OAuth callback geri dönmüyor** → `app.config.js` içindeki `scheme` ile `src/services/auth.ts` içindeki `APP_SCHEME` aynı mı? Supabase'deki redirect URL `myapp://auth/callback` formatında mı?
- **NativeWind class'ları görünmüyor** → `metro.config.js` `withNativeWind`'i sarıyor mu? `global.css` `app/_layout.tsx`'in en üstünde import edilmiş mi?
