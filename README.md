# Expo Boilerplate

Opinionated, minimal starter for new mobile apps. Includes the stack and patterns I reuse so a new project can skip the setup tax.

## Stack

- **Expo SDK 54** + React Native 0.81 (New Architecture)
- **Expo Router v6** with typed routes
- **NativeWind v4** (Tailwind for RN) — light/dark via CSS variables
- **Supabase** auth + DB client (session in Keychain/Keystore via `secureStorage` adapter)
- **Apple Sign-In** + **Google OAuth** out of the box
- **i18n** (en/tr) with device locale auto-detect
- **Zustand** persisted store (theme + language)
- **TanStack Query** wired in the root layout
- **Error boundary**, **OTA update hook**, **typed paths** (`@/*`)

## Quick start

```bash
npm install
cp .env.example .env   # fill in EXPO_PUBLIC_SUPABASE_URL + ANON_KEY
npm start
```

Then press `i` for iOS simulator or scan the QR with Expo Go / a dev client.

## Project structure

```
app/                       # Expo Router (file-based routing)
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
└── types/database.ts      # Supabase types stub — replace with `supabase gen types`
```

Path alias: `import { x } from "@/lib/...";`

## Things to replace before shipping

- `app.config.js` — `name`, `slug`, `scheme`, `bundleIdentifier`, `package`, `owner`, EAS `projectId`, updates URL
- `eas.json` — submit credentials (Apple Team ID, Play Service Account)
- `src/services/auth.ts` — `APP_SCHEME` if you change the URL scheme
- `src/types/database.ts` — replace stub with your real Supabase schema (`supabase gen types typescript`)
- `src/store/appStore.ts` — `name: "boilerplate-store"` if you want a fresh persisted bucket
- `assets/*` — icons, splash

## Conventions

- All visible text goes through `t("key")`. Add to BOTH `en.json` and `tr.json`.
- Screens wrap content in `<Screen>` (or `SafeAreaView`) — never bare `View`.
- Use `formatPrice` / `formatDate` style utils when you add them — no hardcoded currency/locale.
- Match existing theme tokens (`bg-surface-primary`, `text-content-primary`) — don't hardcode hex.

## EAS branches

| Build profile | Channel       | Update branch                  |
| ------------- | ------------- | ------------------------------ |
| `production`  | `production`  | `eas update --branch production` |
| `preview`     | `preview`     | `eas update --branch preview`    |
| `development` | `development` | `eas update --branch development` |

**Never** use `--branch main`. No build listens to that channel.
