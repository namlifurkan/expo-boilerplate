---
description: Post-clone checklist to rename identity, wire up EAS, and connect Supabase when bootstrapping a new app from this boilerplate. Use when the user says "boilerplate'ten yeni proje açtım", "bu template'i özelleştir", "setup new app", or after they've cloned/degit'd this repo.
---

# Setup New Project from Boilerplate

When a user has just cloned this boilerplate into a new project, walk through the identity rename + infrastructure wiring in this exact order. Do NOT skip steps — each step has downstream dependencies.

## 1. Collect the new identity

Ask the user for:
- **App display name** (e.g., "Sparkle")
- **Slug** (kebab-case, e.g., `sparkle`)
- **URL scheme** (lowercase, e.g., `sparkle` — becomes `sparkle://`)
- **iOS bundle identifier** (e.g., `com.example.sparkle`)
- **Android package** (usually matches bundle id)
- **Expo owner username**

If any is unclear, ask before touching files. Do not guess bundle identifiers.

## 2. Rename in `app.config.js`

Replace:
- `name: "ExpoBoilerplate"` → new display name
- `slug: "expo-boilerplate"` → new slug
- `scheme: "boilerplate"` → new scheme
- `bundleIdentifier`, `package`, `owner`
- `extra.eas.projectId` and `updates.url` — leave as `REPLACE_...` for now, EAS init will populate

## 3. Sync the URL scheme

**Critical.** Edit `src/services/auth.ts`:
```ts
const APP_SCHEME = "sparkle"; // must match app.config.js
```
Without this, Google OAuth callback redirect will fail silently.

## 4. Rename the persisted store bucket

`src/store/appStore.ts` — change `name: "boilerplate-store"` to `name: "sparkle-store"` (or similar). Prevents collision with other boilerplate-based apps installed on the same device.

## 5. Update `package.json`

- `name: "expo-boilerplate"` → new slug
- `version: "0.1.0"` — leave or reset

## 6. Init EAS

Run (or tell user to run):
```bash
eas login
eas init              # writes projectId into app.config.js
eas update:configure  # sets up the updates URL
```
After this, verify `app.config.js` no longer has `REPLACE_...` placeholders.

## 7. Supabase wiring

Ask if a Supabase project already exists or needs to be created.
- `.env` ← `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Supabase Dashboard → Auth → Providers → enable Apple + Google
- After schema exists, regenerate `src/types/database.ts` via the `supabase-gen-types` skill

## 8. Assets

Point the user to replace:
- `assets/icon.png` (1024×1024)
- `assets/adaptive-icon.png` (Android foreground)
- `assets/splash-icon.png`
- `assets/favicon.png` (web)

Do NOT generate these — ask the user to provide real brand assets.

## 9. Verify

- `npm install` (if not already run)
- `npm start` — boot with new identity, confirm splash + auth gate work
- Apple/Google sign-in requires a dev client build — if the user wants to test, point them at `eas build --profile development --platform ios`

## Done-criteria

All `REPLACE_...` strings gone from `app.config.js`, `APP_SCHEME` matches, store name changed, `.env` populated, assets swapped or explicitly deferred.

## What to update in the vault

If the user has a vault set up (`~/Desktop/vault-personal/Projects/<ProjectName>/`), create a `decisions/YYYY-MM-DD-app-identity.md` note recording the chosen slug, scheme, bundle id, and Supabase project id. Future sessions will need these.
