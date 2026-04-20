# CLAUDE.md — Project Instructions for Claude Code

This file is loaded into every Claude Code session in this repo. Follow it strictly. These rules OVERRIDE any default behavior.

---

## ⚠️ NON-NEGOTIABLE: File Size & Component Split

**Bu projenin en kritik kuralı: KOD DOSYALARI KISA OLACAK. UZUN MONOLİTİK DOSYA YAZMA.**

### Hard limits

- **Tek dosya en fazla ~200 satır.** 200'ü aşan dosya = sub-component'lere bölünmemiş demektir.
- **Tek component en fazla ~120 satır.** Daha uzunsa parçala.
- **Tek fonksiyon en fazla ~40 satır.** Daha uzunsa helper'lara böl.
- **`return ( ... )` JSX'i en fazla ~50 satır.** Daha uzunsa sub-component çıkar.

Eğer mevcut bir dosya bu sınırları aşıyorsa, ona dokunan ilk PR'da **refactor önerisi** sun veya küçük adımlarla bölmeye başla. Yeni dosya yazarken bu sınırlar kesin.

### Component bölme kuralı

İskelet ekran (örnek `app/(tabs)/settings.tsx`):

```
SettingsScreen          → orchestrator + state
  ├── Section          → reusable
  ├── Row              → reusable
  ├── ThemeSection     → feature-specific composition
  ├── LanguageSection  → feature-specific composition
  └── AccountSection   → feature-specific composition
```

**ASLA tek dosyada 5 ekran logic'i + tüm UI + tüm state + tüm handler**. Her şey tek dosyada → kötü kod, geri dönüşü yok.

### Reuse zorunluluğu

Yeni UI elementi yazmadan **ÖNCE** kontrol et:
- `src/components/ui/` — generic primitives (Screen, Button, Card, Row…)
- `src/components/<feature>/` — feature-specific composition

Eğer 3 yerde tekrar eden bir pattern varsa → component'e çıkar. Tekrar yazma.

### Single responsibility

Bir dosya = bir sorumluluk. `useUserSignals.ts` sadece sinyal hook'u olmalı; içine başka feature'in cache invalidation logic'i girmesin.

Bir fonksiyon = bir iş. `handleSubmit` 80 satırsa içinde gizli 3 fonksiyon var demektir; çıkar.

### Maintainable + scalable test

Yeni dosya yazmadan önce kendine sor:
1. Bu dosya 6 ay sonra başka biri tarafından okunduğunda anlaşılır mı?
2. Bu component'i başka bir ekranda yeniden kullanabilir miyim?
3. Bu logic'in test edilebilmesi için 5 tane mock kurmam mı gerekiyor?

Cevap "hayır / hayır / evet" ise tasarımı yeniden gözden geçir.

### Anti-patterns (RED FLAGS)

- 500+ satırlık screen dosyası (Gist'teki `signal/[id].tsx` kötü örnek — 1454 satır, parçalanması gereken)
- Tek component'te birden fazla `useState` + `useEffect` + form state + animation state + API state
- Inline tanımlanmış 100+ satırlık helper fonksiyon
- `View` içinde 8 seviye nesting
- Aynı JSX bloğunun copy-paste edilmiş 3 versiyonu

---

## Stack & Conventions

### Tech

- **Expo SDK 54** + React Native 0.81 (New Architecture)
- **Expo Router v6** typed routes
- **NativeWind v4** — semantic CSS-variable tokens
- **Supabase** auth + DB
- **Apple Sign-In** + **Google OAuth**
- **i18n** (en/tr) + **Zustand** persist + **TanStack Query**

### Project structure

```
app/                  # Expo Router file-based routing
src/
├── components/       # ErrorBoundary + ui/ (Screen, …)
├── constants/        # colors.ts (theme tokens)
├── hooks/            # useThemeColors, useTranslation, useOTAUpdate
├── lib/              # supabase, i18n, secureStorage
├── locales/          # en.json, tr.json
├── providers/        # AuthProvider, LanguageProvider, ThemeProvider
├── services/         # auth.ts (Apple + Google + signOut)
├── store/            # appStore (Zustand persist)
├── types/            # database.ts (Supabase types)
└── utils/            # generic helpers
```

Path alias: `import { x } from "@/lib/...";` — relative `../../../` ASLA yazma.

### Hard rules

1. **i18n:** UI'daki TÜM metin `t("key")`. Hardcoded TR/EN yasak. Her key hem `en.json` hem `tr.json`'a eklenir.
2. **Screen wrapper:** Her ekran `<Screen>` (veya `SafeAreaView`). Bare `<View>` ile başlama.
3. **Theme tokens:** `bg-surface-*`, `text-content-*`, `border-stroke-*`, `bg-accent-primary`. Hardcoded hex (`#000000`) yazma. Native style için `useThemeColors()`.
4. **Path alias:** `@/` kullan, relative import yazma.
5. **Persist store name:** `appStore.ts` `name: "boilerplate-store"` — yeni projede değiştirilmiş olmalı.
6. **EAS branches:** `production` → `--branch production`, vb. ASLA `--branch main`.

### Currency / formatting

Boilerplate'te şu an currency util yok. Eklendiğinde tüm fiyat gösterimi shared util'den geçecek; hardcoded `$` veya `₺` yasak.

---

## Project-local skills

Bu projede `.claude/skills/` altında beş özel skill var. İlgili task'ta otomatik tetikle:

- **`setup-new-project`** — Boilerplate'ten yeni proje açıldığında: identity rename, EAS init, Supabase wiring
- **`add-i18n-key`** — Yeni çeviri key'i eklerken: HER İKİ locale'e eş zamanlı ekleme
- **`new-screen`** — Yeni ekran/route oluştururken: Screen wrapper + i18n + token convention'lı template
- **`supabase-gen-types`** — Schema değişince `src/types/database.ts` regen
- **`remove-supabase`** — Kullanıcı Supabase yerine AWS/Firebase/Clerk/custom backend seçerse: client, types, auth service, provider, env, dep'leri temizleyip seçilen backend'e göre stub/scaffold kurar

---

## Working style

- **Kısa cevaplar.** Gereksiz özet ve narration yapma.
- **Türkçe konuş** (kullanıcı Türkçe yazıyor). Kod, terim, tool adı İngilizce kalır.
- **Plan önce, kod sonra.** Birden fazla dosyayı etkileyen iş için plan göster, onay al.
- **Test workflow:** Tek değişiklikle ilgili test çalıştır; full suite'i sadece tüm iş bittiğinde çalıştır.
- **Commit mesajları:** Açıklayıcı + kısa. "Why" odaklı, "what" değil. Claude attribution kullanma.

---

## Vault (kalıcı hafıza)

Bu projenin session'lar arası bağlamı:
`~/Desktop/vault-personal/Projects/Expo Boilerplate/`

**Session başında:** İlgili vault klasörünü oku — `README.md` + ilgili kategori (`architecture/`, `conventions/`, `decisions/`, vb).

**Kalıcı bilgi öğrendiğinde** (mimari karar, bug çözümü, domain bilgisi, konvansiyon, paydaş bilgisi) ilgili klasöre atomik markdown notu ekle. Her not en az 2 wikilink içermeli (proje + ilgili kardeş not).

<!-- VAULT-REF: ~/Desktop/vault-personal/Projects/Expo Boilerplate/ -->

---

## When in doubt

- Dosya 200 satıra yaklaşıyor → böl
- Component 120 satıra yaklaşıyor → sub-component çıkar
- Aynı JSX bloğu 3. kez yazılıyor → reusable component yap
- Hardcoded text görüyorsun → `t()` ile sar, locale'lere ekle
- Hardcoded hex görüyorsun → semantic token'a çevir, yoksa ekle

Bu kuralları takip etmek = kodun maintainable + scalable kalması. Atlamak = teknik borç biriktirmek.
