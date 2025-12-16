# Codebase Cleanup Report

Generated: 2025-12-16
Updated: 2025-12-16 (Phase 2 Complete)

---

## Cleanup Summary

### Build Status: ✅ PASSING
### TypeScript: ✅ NO ERRORS
### ESLint: ✅ 0 ERRORS (16 warnings - all expected)

---

## Phase 1: Dead Code Removal (commit d03fe43)

### 1. Bug Fix: Missing Route
- **Found:** `PowerQuestions.tsx` was referenced by `Results.tsx` but had no route
- **Fixed:** Added `/power-questions` route to `App.tsx`

### 2. Deleted Files (11 total)

**Pages (2 files):**
- `src/pages/Browse.tsx` - Dead code (route just redirects)
- `src/pages/Index.tsx` - Unused blank template

**Components (9 files):**
- `src/components/NavLink.tsx`
- `src/components/PageHeader.tsx`
- `src/components/TextInputQuestion.tsx`
- `src/components/ColorCheckboxQuestion.tsx`
- `src/components/HelpModal.tsx`
- `src/components/PathCards.tsx`
- `src/components/ShowcaseWall.tsx`
- `src/components/DeckDetailModal.tsx`
- `src/components/CardSetDetailModal.tsx`

### 3. Fixed `any` Types in Page Components
- `src/pages/Discover.tsx`
- `src/pages/DeckDetailPage.tsx`
- `src/pages/CardSetDetailPage.tsx`
- `src/pages/Results.tsx`
- `src/pages/LoadingScreen.tsx`
- `src/pages/VibesQuestions.tsx`
- `src/components/DeckCard.tsx`
- `src/components/ShowcaseCard.tsx`
- `src/components/ShowcaseCarouselCard.tsx`
- `src/components/SavedDecksDrawer.tsx`
- `src/data/curated-showcase.ts`
- `src/data/power-questions.ts`
- `src/data/vibes-questions.ts`

### 4. Fixed useMemo Dependency Warnings
- `src/pages/Discover.tsx` - Wrapped `selectedColors`, `selectedCardTypes`, `selectedFranchises` in useMemo

### 5. Removed Unused npm Packages
- `@hookform/resolvers`
- `zod`

### 6. Removed Dead Exports
- `trackQuizAbandoned` from `src/lib/analytics.ts`
- `initPostHog` from `src/lib/posthog.ts`

---

## Phase 2: Utility Files & Edge Functions (SKU-327)

### 1. Deleted Unused Script
- `extract-deck-ids.js` - Standalone utility script with parsing error, not referenced anywhere

### 2. Fixed `any` Types in Utility Files
- `src/utils/deckHelpers.ts` - Added Deck type import
- `src/utils/themeHelpers.ts` - Added Deck type for all deck parameters
- `src/utils/artPathHelpers.ts` - Added Deck type, changed `any` to `unknown`
- `src/utils/customInputParser.ts` - Added Deck type, ThemeMatchData interface, typed preconsData

### 3. Fixed `any` Types in Edge Functions
- `supabase/functions/generate-deck-intros/index.ts` - Added DeckMatch interface
- `supabase/functions/generate-match-reasons/index.ts` - Added DeckMatch interface

### 4. Fixed Other ESLint Errors
- `src/utils/deckDifficulty.ts` - Removed unnecessary escape characters
- `src/pages/VibesQuestions.tsx` - Added CreatureTypeImages type
- `tailwind.config.ts` - Changed `require()` to ESM import
- `src/components/ui/command.tsx` - Changed empty interface to type alias
- `src/components/ui/textarea.tsx` - Changed empty interface to type alias

---

## Remaining Warnings (16 total - all expected)

### shadcn/ui Fast Refresh Warnings (8)
Standard pattern for shadcn/ui components that export variants - safe to ignore:
- badge.tsx, button.tsx, form.tsx, navigation-menu.tsx
- sidebar.tsx, sonner.tsx, toggle.tsx, SavedDecksContext.tsx

### useEffect Dependency Warnings (8)
Intentional patterns in quiz flow pages where dependencies are omitted to prevent re-runs:
- LoadingScreen.tsx, PowerQuestions.tsx, Results.tsx, VibesQuestions.tsx

---

## Final Lint/Build Status

```
Build: ✅ SUCCESS (7.33s)
TypeScript: ✅ NO ERRORS
ESLint: ✅ 0 errors, 16 warnings (all expected)
```

---

## Total Files Changed

| Category | Phase 1 | Phase 2 | Total |
|----------|---------|---------|-------|
| Deleted | 11 | 1 | 12 |
| Modified | 18 | 11 | 29 |

## Bundle Size
- After Phase 2: 1,178.40 kB (336.46 kB gzip)
