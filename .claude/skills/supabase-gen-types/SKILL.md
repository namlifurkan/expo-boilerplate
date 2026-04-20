---
description: Regenerate src/types/database.ts from the live Supabase schema using `supabase gen types`. Use when the user says "supabase tipleri güncelle", "regen types", "schema değişti", or after they've added/changed tables in Supabase.
---

# Regen Supabase Types

`src/types/database.ts` ships as a stub. Once a real Supabase schema exists it should be replaced with the CLI-generated types so `supabase.from("table").select()` is fully typed.

## Prerequisites

Confirm before running:
- Supabase project id (the user knows it; ask if not in conversation context)
- `supabase` CLI available — if not, advise: `npm install --save-dev supabase` or `brew install supabase/tap/supabase`
- User is logged in: `supabase login` (interactive — user must run themselves, not from this session)

## Command

```bash
npx supabase gen types typescript --project-id <PROJECT_ID> > src/types/database.ts
```

For a local Supabase instance:
```bash
npx supabase gen types typescript --local > src/types/database.ts
```

## After running

1. Open the file and skim — confirm tables match expectations (no missing schemas, no auth.* tables leaked unless intended).
2. The `Database` type generic is what `createClient<Database>(...)` in `src/lib/supabase.ts` consumes — no further wiring needed.
3. If new tables appeared, suggest adding row-level security policies if not already in place. Don't write SQL unprompted.

## Common issues

- **Empty types file** → user not authenticated, or project id wrong. Run `supabase projects list` to verify.
- **Missing tables** → schema other than `public` not included by default. Use `--schema public,storage` to widen.
- **Permission errors** → user lacks access to the project. Not a code issue.

Do not commit `src/types/database.ts` changes alongside unrelated work — keep schema regen as its own commit so diff review is clean.
