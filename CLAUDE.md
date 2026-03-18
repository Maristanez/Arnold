# Arnold — AI-Powered Fitness App

## Project Overview
Arnold is a React Native (Expo) mobile fitness app with AI-generated personalized programming, macro tracking, and a persistent AI memory layer (Backboard.io). Solo founder project by Bryan Maristanez.

## Tech Stack
- **Mobile**: React Native 0.83 (Expo SDK 55)
- **Language**: TypeScript (strict mode)
- **Backend/DB**: Supabase (PostgreSQL + Auth)
- **State Management**: Zustand
- **AI Memory**: Backboard.io
- **LLM**: Claude API (structured output for program generation + coaching)
- **Nutrition**: Open Food Facts API
- **Animations**: react-native-reanimated

## Architecture

### Directory Structure
```
src/
├── components/       # Reusable UI components (Button, Card, Input, Typography, etc.)
├── screens/          # Screen containers + views (container-presenter pattern)
├── navigation/       # React Navigation stacks (bottom tabs + native stacks)
├── services/         # API/Supabase/external interactions (never in components)
├── hooks/            # Custom React hooks for business logic
├── store/            # Zustand stores
├── types/            # TypeScript interfaces and types (fully defined)
├── constants/        # Colors.ts, Typography.ts, Spacing.ts (fully defined)
└── utils/            # Helper functions

supabase/
└── migrations/       # SQL migrations with RLS (001-005 complete)

docs/                 # ARCHITECTURE.md, UI_GUIDELINES.md
roadmap/              # MVP roadmap, frontend/backend task breakdowns
```

### Patterns
- **Container-Presenter**: Complex screens split into `{Name}Screen.tsx` (data/state) and `{Name}View.tsx` (pure UI)
- **Services layer**: All DB/API calls go through `src/services/`, never directly in components
- **Typed props**: Every component must type its props. No `any`.
- **Functional components only**: Use hooks, not class components
- **Error handling**: Services return `{ data, error }` pattern. Never throw to callers.
- **Path Aliases**: Use `@/` for all absolute imports (e.g., `import { Button } from '@/components/Button'`).

## Logic & State Management

### Landing Page Logic
- **Auth Guard**: On mount, check session. Redirect to `Dashboard` if profile is complete, `Onboarding` if not, or stay on `Landing`.
- **Pre-fetching**: Initial data sync (user profile, latest workout state) happens in `useLandingLogic.ts`.

### Background Tasks (not yet implemented)
- **AI Memory Sync**: Periodic background task via `expo-background-fetch` to process logs and sync to Backboard.io.
- **Triggers**: Session completion or daily scheduled sync.
- **Note**: `expo-background-fetch` must be installed when this feature is built.

## Design System (Dark Mode Only)

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#0A0A0A` | App background |
| `surface` | `#1A1A1A` | Cards, elevated surfaces |
| `surfaceLight` | `#242424` | Inputs, secondary surfaces |
| `brand` | `#4CAF50` | Primary accent, CTAs |
| `brandDark` | `#2E7D32` | Pressed states |
| `textPrimary` | `#FFFFFF` | Headers, primary text |
| `textSecondary` | `#9E9E9E` | Labels, captions |
| `textTertiary` | `#666666` | Placeholders, disabled |
| `error` | `#D32F2F` | Destructive actions |
| `success` | `#388E3C` | Confirmations |
| `warning` | `#F57C00` | Alerts |
| `info` | `#1976D2` | Informational |

### Typography
- **Headers**: Bold (700), large sizes, high contrast white
- **Body**: Regular (400), `#E0E0E0`
- **Labels/Buttons**: Medium (500)

### Spacing
Use multiples: `4, 8, 12, 16, 24, 32`

### Component Rules
- **Buttons**: Min 48px height, `borderRadius: 12`, full-width for primary actions
- **Cards**: `borderRadius: 16`, background `#1A1A1A`, no shadows (use background separation)
- **Inputs**: Minimal borders, subtle (`#333`), accent border on focus (`#4CAF50`)
- **Icons**: 24x24 default, use `expo-vector-icons`
- **Press feedback**: Use `Pressable` with subtle scale animation, not `TouchableOpacity`
- **Navigation**: Bottom tab bar with floating center action button

### Visual Direction
Premium, dark, luxury feel. Near-black backgrounds. Generous whitespace. Bold typography. Not playful — high-end product aesthetic. Reference: Dealmover branding, dark fashion apps, Fitonist.

## Supabase Rules
- All queries through typed Supabase client in `src/services/supabase.ts`
- RLS enabled on every table — queries work within authenticated user context
- API keys in `.env` only, never hardcoded
- Use `react-native-async-storage` for session persistence

## Environment Variables
Loaded via `dotenv` in `app.config.ts` and exposed through `expo-constants`:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `CLAUDE_API_KEY`
- `BACKBOARD_API_KEY`

Access at runtime via `Constants.expoConfig?.extra?.supabaseUrl`, etc.

## MVP Scope (Do Not Exceed)
1. Fitness identity onboarding (6 profile types)
2. AI-generated personalized weekly program
3. One-tap workout completion
4. Basic set/rep/weight logging
5. Simple macro tracker with food search
6. Backboard.io memory integration (30-day context)
7. AI check-in after each session

**If it's not on this list, don't build it.**

## Custom Skills
- `/new-screen <Name>` — scaffold screen with container-presenter pattern
- `/new-component <Name>` — scaffold typed UI component with design tokens
- `/new-service <name>` — scaffold service module with `{ data, error }` pattern
- `/supabase-migration <name>` — generate SQL migration with RLS
- `/test-prompt <name>` — test LLM prompt and validate JSON output

## Database Schema
Supabase migrations are in `supabase/migrations/`. Tables:
- **profiles** — user identity, fitness goals, experience, equipment, onboarding state. Auto-created on signup via trigger.
- **programs** — AI-generated training programs with JSONB `days` column for day-by-day structure.
- **sessions** — workout sessions linked to programs, JSONB `exercises` with AI feedback/assessment.
- **meals** — daily meal entries with JSONB `foods` and `macros_total`.
- **ai_memories** — Backboard.io memory sync records.

All tables have RLS enabled with user-scoped policies. Uses `fitness_identity` enum (bodybuilder, powerlifter, athlete, crossfitter, casual, beginner).

## Commands
```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
```
