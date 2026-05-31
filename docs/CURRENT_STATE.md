# Current State & Next Steps

_Last updated: 2026-05-30_

This is the "pick up where we left off" note. Read this first.

## Where things stand

- **`main` is the version we ship.** It's the polished interest-picker flow
  ("What are you into?"). Cloudflare Pages auto-deploys from `main`.
- **Live:** https://discoveringmagic.com (custom domain) and
  https://mtgdeckmatch.pages.dev (Cloudflare Pages).
- **GitHub repo:** `david-steinbroner/mtgdeckmatch` (was renamed from
  `da6ds/...`; local `origin` already updated).
- **Local dev:** `npm run dev` → http://localhost:3000
- **Stack now:** pure static React + TS SPA. **No backend, no database, no API
  keys, no external services.** All data is static JSON in `src/data/`.

## Done recently (✅ shipped, commit `2a8ad7c`)

- **Fully divorced from Lovable** — removed `lovable-tagger`, the Lovable AI
  gateway, and all 3 Supabase edge functions.
- **Removed Supabase entirely** (client, types, dependency) — it only existed to
  run those AI functions.
- AI deck intros → static client-side templates (`src/utils/deckIntros.ts`);
  loading-screen text → static copy.
- Lovable GitHub app removed (it can no longer commit to the repo).
- Linear/ticket convention dropped from `CLAUDE.md`; version → `1.0.0`.

## Branches & tags

- `main` — live, the keeper.
- `feature/start-flow-v3` — **parked** (unfinished experiment). Preserved on
  origin and snapshotted as tag `archive/start-flow-v3`. Safe to ignore.
- `pre-cleanup/main` — tag snapshot of `main` before cleanup.
- `discovering-magic` — old, stale. Can be deleted.
- `origin` — a junk LOCAL branch (fat-fingered name). Delete it: `git branch -D origin`.

## Next steps (in priority order)

### 1. Collapse the two-folder mess (do this FIRST next session)
The real repo is currently nested awkwardly. Today it lives at:
`/Users/davidsteinbroner/Projects/mtg-deck-match-main/mtg-deck-match`
…inside a stale leftover folder (`mtg-deck-match-main`) that has **nothing
unique** (verified — its files are just an older copy already in `main`).

Collapse it to one clean folder. **Stop any dev server first**, make sure no
terminal/editor is cd'd inside, then:

```bash
cd /Users/davidsteinbroner/Projects
mv mtg-deck-match-main/mtg-deck-match ./mtg-deck-match.tmp   # lift real repo out
rm -rf mtg-deck-match-main                                   # delete the stale shell
mv mtg-deck-match.tmp mtg-deck-match                         # final clean location
cd mtg-deck-match && git status && git worktree list         # sanity check
```

End state: one clean repo at `/Users/davidsteinbroner/Projects/mtg-deck-match`.
**Reopen Claude Code in that new folder afterward.**

### 2. Confirm the Cloudflare Pages deploy
- Cloudflare dashboard → Workers & Pages → the Pages project → Settings → Git:
  confirm it's connected to **`david-steinbroner/mtgdeckmatch`** (the rename may
  have left it on the old name). Reconnect if the latest deploy didn't fire.

### 3. Delete the now-unused Supabase project
- The frontend no longer calls it. In the Supabase dashboard, delete the project
  (or at least the 3 edge functions) to remove dead weight.

### 4. Tidy git
```bash
git branch -D origin              # junk local branch
git branch -D discovering-magic   # optional: old stale branch
```

### 5. Add a visible version badge in the UI
- Per project convention, show `1.0.0` somewhere (footer/badge) so the deployed
  version is confirmable at a glance. Bump it on each meaningful change.

## Notes / gotchas

- An earlier multi-agent audit judged "dead code" against the parked v3 branch
  and was WRONG. On `main`, `Welcome.tsx`, `PowerQuestions.tsx` (`/power-questions`),
  and `Roadmap.tsx` (`/roadmap`) are all LIVE, routed pages — do not delete them.
- Known data bug to fix someday: `src/data/interest-mappings.ts` `curatedDeckIds`
  reference ~10 deck IDs that don't exist in `precons-data.json`, so the
  "Just Show Me Cool Stuff" path silently finds nothing.
