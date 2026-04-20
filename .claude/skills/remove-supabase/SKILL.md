---
description: Strip Supabase out of the boilerplate cleanly so the project can run on AWS (Cognito/Amplify), Firebase, Clerk, a custom backend, or no backend at all. Use when the user says "Supabase'i kaldır", "AWS kullanacağım", "switch to Cognito", "remove Supabase", "no Supabase", or chooses a different backend during initial setup.
---

# Remove Supabase

This boilerplate ships with Supabase wired for auth + DB. When the user targets a different backend, rip it out cleanly — don't leave dead imports, empty files, or unused deps.

## Step 0 — Clarify the replacement

Before touching anything, ask:

> Supabase yerine ne kullanacaksın?
> 1. **AWS Cognito** (Amplify Auth ile) — sosyal login + user pool
> 2. **AWS'de custom backend** (API Gateway + Lambda + DynamoDB/RDS) — auth'u kendin yazacaksın
> 3. **Firebase Auth** — sosyal login + Firestore opsiyonel
> 4. **Clerk / Auth0 / Kinde** — managed auth
> 5. **Hiçbiri şimdilik** — stub bırak, sonra wire et

Don't guess. The replacement determines which `AuthProvider` pattern to scaffold.

## Step 1 — Remove Supabase files

Delete these files (they're 100% Supabase):
- `src/lib/supabase.ts`
- `src/types/database.ts`

Keep:
- `src/lib/secureStorage.ts` — the chunked Keychain/Keystore adapter is generic. Firebase/Amplify tokens may also exceed Android's 2 KB limit; keep it around. Remove only if the new backend provides its own secure storage.

## Step 2 — Strip `src/lib/index.ts`

Remove the `export { supabase }` line. If nothing else is exported, delete the file.

## Step 3 — Rewrite `src/services/auth.ts`

Currently imports `supabase` and calls `signInWithIdToken` + `signInWithOAuth`. Replace per the user's choice:

### If AWS Cognito + Amplify

```bash
npm install aws-amplify @aws-amplify/react-native @react-native-community/netinfo
```

Scaffold:
```ts
import { Amplify } from "aws-amplify";
import { signInWithRedirect, signOut as amplifySignOut } from "aws-amplify/auth";
// configure Amplify in app/_layout.tsx with the user's User Pool id + client id
export async function signInWithApple() {
  return signInWithRedirect({ provider: "Apple" });
}
export async function signInWithGoogle() {
  return signInWithRedirect({ provider: "Google" });
}
export async function signOut() {
  return amplifySignOut();
}
```

### If Firebase Auth

```bash
npm install @react-native-firebase/app @react-native-firebase/auth
```

Scaffold with `auth().signInWithCredential(...)` pattern — user must provide `GoogleService-Info.plist` + `google-services.json`.

### If Clerk

```bash
npm install @clerk/clerk-expo
```

Use `@clerk/clerk-expo`'s `useOAuth` hook. Wrap the app in `<ClerkProvider>`.

### If custom backend

Replace with stubs that throw:
```ts
export async function signInWithApple() {
  throw new Error("signInWithApple not implemented — wire to your backend");
}
// ...
```
Also scaffold `src/lib/apiClient.ts` with a basic fetch wrapper using `EXPO_PUBLIC_API_URL`.

### If "none for now"

Replace every exported function body with:
```ts
throw new Error("Auth not configured — pick a provider and wire it up");
```

## Step 4 — Rewrite `AuthProvider.tsx`

Currently subscribes to `supabase.auth.onAuthStateChange`. Replace with the backend's equivalent:

- **Amplify:** `Hub.listen('auth', ...)`
- **Firebase:** `auth().onAuthStateChanged(...)`
- **Clerk:** use Clerk's own `<ClerkProvider>` — can remove custom `AuthProvider` entirely and read via `useUser()` / `useAuth()` from Clerk
- **Custom:** read JWT from SecureStore on mount, set user state; provide `signOut` that clears SecureStore + resets state
- **None:** strip to a minimal context that just holds a fake `user: null` and a no-op `signOut` — login screen will be dead until wired

Preserve the **shape** of `useAuth()` return (`{ user, session, isLoading, signOut }`) so consumers (login screen, tabs layout, index redirect) don't need edits. Map the backend's user object to this shape.

## Step 5 — `package.json`

Remove:
- `@supabase/supabase-js` from `dependencies`
- `supabase` from `devDependencies` (the CLI — unused now)

Add whatever the new backend needs.

Run `npm install` to update lockfile.

## Step 6 — `.env.example`

Remove:
```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Add the new backend's vars. Examples:
- **Amplify:** `EXPO_PUBLIC_AWS_REGION`, `EXPO_PUBLIC_COGNITO_USER_POOL_ID`, `EXPO_PUBLIC_COGNITO_CLIENT_ID`, `EXPO_PUBLIC_COGNITO_DOMAIN`
- **Firebase:** `EXPO_PUBLIC_FIREBASE_API_KEY`, `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`, `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- **Clerk:** `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- **Custom:** `EXPO_PUBLIC_API_URL`

## Step 7 — `tsconfig.json`

Remove the `@/types/*` path mapping if `src/types/database.ts` is gone and no other types file exists. If keeping `src/types/` for app-level types, leave it.

## Step 8 — `CLAUDE.md` + `README.md`

Update these to reflect the new stack:
- `CLAUDE.md` Stack section: replace "Supabase auth + DB" with the chosen backend
- `CLAUDE.md` hard rules: if DB convention changes (e.g., Firestore rules instead of RLS), note it
- `README.md` Stack bullet + "Things to replace" section + Troubleshooting section

Don't forget the Quick Start env vars.

## Step 9 — `.env` sanity

If the user had a real `.env` (not just `.env.example`), ask if they want to archive it or wipe it. Never commit `.env`.

## Step 10 — Vault

If the project has a vault (`~/Desktop/vault-personal/Projects/<Name>/`), create `decisions/YYYY-MM-DD-supabase-yerine-<backend>.md` recording:
- Why the switch
- Trade-offs considered
- New auth/DB architecture

## Verification checklist

Before reporting done, grep the codebase for leftover references:

```bash
grep -r "supabase" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" --include="*.md" .
```

Should return zero hits outside of:
- This skill file
- Git history / changelog

Run `npm run ios` (or `npm start`) to catch type errors. The login screen should still render; buttons should either work (if backend wired) or throw a clear "not implemented" error.

## Do NOT

- Leave `import { supabase } from "@/lib/supabase"` commented out — delete the line
- Leave `database.ts` with an empty `Database` type "for later" — delete the whole file
- Assume the user wants Amplify just because they said "AWS" — clarify: Amplify? Cognito direct? Lambda auth? Each path is different
- Rewrite `AuthProvider` to throw everywhere unless user explicitly picked "none for now"
