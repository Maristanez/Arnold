# Arnold MVP — Roadmap Index

_Last updated: 2026-03-18_

---

## Ownership

| File | Owner | Scope |
|---|---|---|
| [`codex-backend.md`](./codex-backend.md) | Codex | Types, migrations, services, stores, hooks |
| [`claude-frontend.md`](./claude-frontend.md) | Claude Code | Design system, navigation, screens, components |

---

## Dependency Graph

```
Phase 0 — Bootstrap (shared)
  babel.config.js ← BLOCKING for all frontend work
  Supabase project created ← BLOCKING for all backend work

Phase 2 — Types (Codex)
  └─ navigation.ts ← frontend unblocked after this

Phase 3 — Migrations + Services (Codex)
  └─ Supabase schema live + all 8 service modules

Phase 4 — Stores + Hooks (Codex)
  └─ useAuth, useUser, useProgram, useWorkout, useNutrition

Phase 1 — Design System (Claude Code) ← can run parallel with Phase 2–4
Phase 4 — Navigation Shell (Claude Code) ← needs navigation.ts

Phase 5 — Auth + Onboarding (both)
  Codex: onboardingStore
  Claude Code: all screens

Phase 6 — Workout Flow ──┐
Phase 7 — Nutrition ──────┼── parallel, Claude Code screens / Codex hooks
Phase 8 — Profile + Polish ┘
```

---

## Known Flaws Summary

### 🔴 Critical
| # | Flaw | Owner |
|---|---|---|
| 1 | Missing `babel.config.js` — path aliases + Reanimated break at runtime | Claude Code |
| 2 | `app.json` + `app.config.ts` conflict | Claude Code |
| 3 | `@anthropic-ai/sdk` untested on React Native / Hermes | Codex |
| 4 | Backboard.io API unverified — no public docs | Codex |

### 🟠 High
| # | Flaw | Owner |
|---|---|---|
| 5 | Onboarding nav params anti-pattern → replaced with `onboardingStore` | Codex |
| 6 | Center FAB not natively supported in bottom tab bar | Claude Code |
| 7 | Navigation param types missing — needs `src/types/navigation.ts` | Codex |
| 8 | Auth cold start flashes Welcome screen — needs loading state in RootNavigator | Claude Code |
| 9 | WorkoutCheckIn was modal + screen — resolved as full-screen push | Claude Code |
| 10 | `completeWorkout` error paths undefined — error matrix defined in backend.md | Codex |

### 🟡 Medium
| # | Flaw | Owner |
|---|---|---|
| 11 | Background timer — use timestamp delta + AppState | Claude Code |
| 12 | KeyboardAvoidingView platform behavior | Claude Code |
| 13 | Open Food Facts data quality | Codex |
| 14 | Meal macro recalculation on food add | Codex |
| 15 | Onboarding goals undefined per identity — defined in backend.md | Codex |
| 16 | No React error boundary | Claude Code |
| 17 | expo-font installed but no font chosen | Claude Code |

### ⚪ Low
| # | Flaw | Resolution |
|---|---|---|
| 18 | JSONB exercises — not queryable | Accepted for MVP |
| 19 | dotenv in runtime deps | Move to devDependencies |
| 20 | No offline strategy | Accepted for MVP |
