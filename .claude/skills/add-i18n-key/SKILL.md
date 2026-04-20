---
description: Add a translation key to BOTH src/locales/en.json and src/locales/tr.json simultaneously, preserving existing structure. Use whenever the user adds visible UI text, says "yeni i18n key ekle", "çeviri ekle", "add translation", or when a `t("...")` call references a key that doesn't exist yet.
---

# Add i18n Key

Boilerplate convention (HARD RULE): every visible UI string must come from `t("key")`, and every key must exist in BOTH `en.json` and `tr.json`. Missing one → fallback to EN, but the inconsistency is a bug.

## Process

1. **Identify the key path.** Top-level namespace is feature/area: `auth.*`, `home.*`, `settings.*`, `common.*`, `errorBoundary.*`, etc. New feature → new namespace (e.g., `profile.*`).

2. **Confirm both translations.** Ask the user for:
   - English string (production wording, not a placeholder)
   - Turkish string (Turkish-native phrasing, not a literal translation)

   If the user only provides one, ask for the other. Do NOT machine-translate silently. Do NOT use a placeholder like "TODO: translate" — boilerplate convention is no missing strings shipped.

3. **Read both files in parallel** to see the existing structure:
   - `src/locales/en.json`
   - `src/locales/tr.json`

4. **Insert the key in the same position in both files.** If adding under an existing namespace, use `Edit` with old_string showing the surrounding keys to ensure correct placement and trailing-comma handling. If adding a new namespace, place it alphabetically among siblings.

5. **Verify JSON is valid** in both files (no trailing comma, balanced braces).

6. **If the key is referenced in code,** check that the call site uses the exact key path (`t("settings.title")` not `t("Settings.title")`).

## Conventions

- Keys are camelCase: `signInWithApple`, not `sign_in_with_apple` or `SignInWithApple`.
- Interpolation uses `{{var}}` syntax: `"viewNewSignals": "View {{count}} New Signals"`.
- Don't duplicate strings across namespaces. Common reusable text (Cancel, OK, Save, Loading) lives in `common.*`.
- Punctuation matches locale: TR usually no period at end of short labels; EN follows sentence case.

## Anti-patterns to refuse

- Adding only to `en.json` "to fix it later"
- Hardcoding TR text in code with intent to "extract later"
- Using English as the TR value with a TODO

If the user asks for any of these, push back: explain that the boilerplate has a hard rule against partial i18n, and offer to add both translations now.
