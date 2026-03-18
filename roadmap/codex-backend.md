# Arnold MVP — Backend Tasks (Codex)

_Assigned to: Codex_
_Last updated: 2026-03-18_

---

## Scope
Everything that does not render UI: types, database schema, services, state stores, and business logic hooks. The contract between backend and frontend is the types layer (`src/types/`) and the hooks layer (`src/hooks/`) — all screens consume hooks, never services directly.

---

## Status Legend
- `[ ]` Not started
- `[~]` In progress
- `[x]` Done
- `[!]` Blocked / needs external action

---

## Phase 0 — Bootstrap (Backend portion)
> Phase 0 is shared. These items are Codex's responsibility.

- [x] `src/` directory skeleton created
- [x] `supabase/migrations/` directory created
- [x] Core deps installed (`@react-navigation/*`, `zustand`, `react-native-reanimated`, `expo-constants`, `dotenv`, etc.)
- [ ] Install `@anthropic-ai/sdk` — verify it works in React Native / Hermes before Phase 3 ⚠️
  - Test: `messages.create` with a simple prompt, no streaming
  - Fallback: proxy through a Supabase Edge Function if it fails
- [ ] Move `dotenv` from `dependencies` to `devDependencies` in `package.json`

---

## Phase 2 — TypeScript Types
> Completed types are shared with the frontend. Do not break existing interfaces.

### Completed
- [x] `src/types/user.ts` — `FitnessIdentity`, `UserProfile`, `OnboardingData`, `TrainingHistory`, `UserPreferences`
- [x] `src/types/program.ts` — `Program`, `ProgramDay`, `ProgramExercise`
- [x] `src/types/session.ts` — `Session`, `SessionExercise`, `SessionSet`
- [x] `src/types/nutrition.ts` — `Meal`, `FoodEntry`, `Macros`, `FoodSearchResult`, `MealType`
- [x] `src/types/ai.ts` — `AICheckInResponse`, `ExerciseAdjustment`, `BackboardMemory`
- [x] `src/types/index.ts`

### Remaining
- [ ] `src/types/navigation.ts` — navigation param types consumed by both hooks and screens

```ts
// Required exports:
export type RootStackParamList = {
  Loading: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Main: NavigatorScreenParams<TabParamList>;
};

export type AuthStackParamList = {
  Welcome: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type OnboardingStackParamList = {
  OnboardingIdentity: undefined;
  OnboardingGoals: undefined;
  OnboardingHistory: undefined;
  OnboardingPreferences: undefined;
  OnboardingSummary: undefined;
};

export type TabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  WorkoutTab: NavigatorScreenParams<WorkoutStackParamList>;
  StartWorkout: undefined; // Center FAB — never actually navigates
  NutritionTab: NavigatorScreenParams<NutritionStackParamList>;
  ProfileTab: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  ProgramDetail: { programId: string };
};

export type WorkoutStackParamList = {
  WorkoutHistory: undefined;
  WorkoutActive: { dayNumber: number };
  WorkoutCheckIn: { sessionId: string };
};

export type NutritionStackParamList = {
  NutritionDashboard: undefined;
  FoodSearch: { mealType: MealType };
  MealDetail: { mealId: string };
};
```

---

## Phase 3 — Database Migrations

> Run in Supabase SQL editor in order. All tables: uuid PK, `created_at`, `updated_at`, RLS enabled, index on `user_id`.

### Prerequisites
- [!] Supabase project "arnold" must be created first — copy URL + anon key to `.env`
- [!] Email/password auth enabled in Supabase dashboard

### Migrations
- [ ] `supabase/migrations/001_create_fitness_identity_enum.sql`
  - `fitness_identity` enum: `bodybuilder`, `powerlifter`, `athlete`, `crossfitter`, `casual`, `beginner`
  - `update_updated_at_column()` trigger function

- [ ] `supabase/migrations/002_create_profiles_table.sql`
  - `profiles` table linked to `auth.users` (same uuid PK)
  - Columns: `email`, `fitness_identity`, `current_goals` (text[]), `experience_level`, `years_training`, `injuries` (text[]), `days_per_week`, `session_duration`, `equipment` (text[]), `is_onboarded` (bool default false)
  - RLS: users can only read/update their own row
  - Trigger: auto-insert profile row on `auth.users` INSERT

- [ ] `supabase/migrations/003_create_programs_and_sessions.sql`
  - `programs` table: `user_id` (FK auth.users), `name`, `description`, `fitness_identity`, `days` (jsonb), `is_active` (bool), `week_number` (int)
  - `sessions` table: `user_id`, `program_id` (FK programs), `day_number`, `day_name`, `exercises` (jsonb), `started_at`, `completed_at`, `duration_seconds`, `ai_feedback`, `ai_assessment`
  - RLS on both: users own their rows
  - Index: `programs(user_id, is_active)`, `sessions(user_id, started_at DESC)`

- [ ] `supabase/migrations/004_create_meals_table.sql`
  - `meals` table: `user_id`, `meal_type` (text), `foods` (jsonb), `macros_total` (jsonb), `logged_at` (timestamptz)
  - RLS: users own their rows
  - Index: `meals(user_id, logged_at DESC)`

> **Note (accepted flaw):** Exercises stored as JSONB — no cross-session queryability. Relational tables post-MVP.

---

## Phase 3 — Service Modules

> All services return `Promise<{ data: T | null; error: string | null }>`. Never throw to callers. Never import directly in components — only in hooks.

- [ ] `src/services/supabase.ts`
  - Typed `createClient<Database>` using generated types
  - AsyncStorage session adapter: `storage: AsyncStorage`
  - Export single `supabase` client instance

- [ ] `src/services/authService.ts`
  - `signUp(email, password)` → `{ data: User, error }`
  - `signIn(email, password)` → `{ data: Session, error }`
  - `signOut()` → `{ data: null, error }`
  - `getSession()` → `{ data: Session | null, error }`
  - `onAuthStateChange(callback)` → unsubscribe function

- [ ] `src/services/profileService.ts`
  - `getProfile(userId)` → `{ data: UserProfile, error }`
  - `updateProfile(userId, partial)` → `{ data: UserProfile, error }`
  - `completeOnboarding(userId, onboardingData)` → `{ data: UserProfile, error }`

- [ ] `src/services/programService.ts`
  - `getCurrentProgram(userId)` → `{ data: Program | null, error }`
  - `createProgram(userId, program)` → `{ data: Program, error }`
  - `getProgramHistory(userId)` → `{ data: Program[], error }`

- [ ] `src/services/sessionService.ts`
  - `startSession(userId, programId, dayNumber, dayName, exercises)` → `{ data: Session, error }`
  - `updateSessionExercise(sessionId, exercises)` → `{ data: Session, error }`
  - `completeSession(sessionId, durationSeconds)` → `{ data: Session, error }`
  - `updateSessionAIFeedback(sessionId, feedback, assessment)` → `{ data: Session, error }`
  - `getSessionHistory(userId, limit?)` → `{ data: Session[], error }`

- [ ] `src/services/nutritionService.ts`
  - `logMeal(userId, mealType, foods)` → creates meal with calculated `macros_total` → `{ data: Meal, error }`
  - `addFoodToMeal(mealId, food)` → fetch meal, push food, recalculate `macros_total`, upsert → `{ data: Meal, error }`
  - `getTodayMeals(userId)` → `{ data: Meal[], error }` (filter by today's date range)
  - `getDailyMacros(userId)` → `{ data: Macros, error }` (sum `macros_total` across today's meals)
  - `searchFood(query)` → Open Food Facts API → `{ data: FoodSearchResult[], error }`
    - Endpoint: `https://world.openfoodfacts.org/cgi/search.pl?search_terms={query}&json=true&page_size=20`
    - Map: `product_name`, `brands`, `serving_size`, `nutriments` → `FoodSearchResult`
    - Show "N/A" (null) for any missing nutriment values

- [ ] `src/services/claudeService.ts` ⚠️ (verify SDK in RN first)
  - `generateProgram(onboardingData, memories)` → `{ data: Program, error }`
    - System prompt: fitness coach AI generating a structured weekly program
    - Use structured JSON output (tool_use or JSON mode)
    - Validate response matches `Program` type before returning
  - `generateCheckIn(session, program)` → `{ data: AICheckInResponse, error }`
    - System prompt: post-workout coach giving feedback
    - Parse into `AICheckInResponse`

- [ ] `src/services/backboardService.ts` ⚠️ (API unverified — confirm before building)
  - If Backboard.io API is confirmed: implement per their API docs
  - If not confirmed: implement a Supabase-based fallback:
    - Table `ai_memories`: `user_id`, `type`, `content`, `metadata` (jsonb), `created_at`
    - `storeMemory(userId, type, content, metadata)` → `{ data: BackboardMemory, error }`
    - `retrieveMemories(userId, type?, limit?)` → `{ data: BackboardMemory[], error }`
    - `storeSessionMemory(userId, session)` → wraps `storeMemory` with session summary
    - `storeNutritionMemory(userId, macros)` → wraps `storeMemory` with daily nutrition summary

---

## Phase 4 — Zustand Stores

> Stores hold UI-reactive state derived from service calls. Hooks read stores and call services.

- [ ] `src/store/authStore.ts`
  ```ts
  interface AuthState {
    session: Session | null;
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    setSession: (session: Session | null) => void;
    setLoading: (v: boolean) => void;
  }
  ```

- [ ] `src/store/userStore.ts`
  ```ts
  interface UserState {
    profile: UserProfile | null;
    isOnboarded: boolean;
    isLoading: boolean;
    setProfile: (profile: UserProfile | null) => void;
    setLoading: (v: boolean) => void;
  }
  ```

- [ ] `src/store/programStore.ts`
  ```ts
  interface ProgramState {
    currentProgram: Program | null;
    isLoading: boolean;
    isGenerating: boolean;
    setProgram: (program: Program | null) => void;
    setLoading: (v: boolean) => void;
    setGenerating: (v: boolean) => void;
  }
  ```

- [ ] `src/store/onboardingStore.ts` *(replaces navigation params anti-pattern)*
  ```ts
  interface OnboardingState {
    data: Partial<OnboardingData>;
    setField: <K extends keyof OnboardingData>(key: K, value: OnboardingData[K]) => void;
    reset: () => void;
  }
  ```

- [ ] `src/store/index.ts` — barrel export

---

## Phase 4 — Custom Hooks

> Hooks are the only thing screens import. They orchestrate stores + services.

- [ ] `src/hooks/useAuth.ts`
  - On mount: call `authService.getSession()` → populate `authStore`
  - Subscribe to `authService.onAuthStateChange()` → keep store in sync
  - Expose: `signIn(email, password)`, `signUp(email, password)`, `signOut()`
  - All methods set `isLoading` before/after and surface errors

- [ ] `src/hooks/useUser.ts`
  - On mount (when authenticated): call `profileService.getProfile(userId)`
  - Expose: `profile`, `isOnboarded`, `completeOnboarding(data)` → saves profile + sets `is_onboarded`

- [ ] `src/hooks/useProgram.ts`
  - On mount: call `programService.getCurrentProgram(userId)` → populate `programStore`
  - Expose: `currentProgram`, `isLoading`, `isGenerating`, `generateNewProgram(onboardingData)`
    - `generateNewProgram`: retrieve Backboard memories → call `claudeService.generateProgram` → save via `programService.createProgram`

- [ ] `src/hooks/useWorkout.ts`
  - Manages active session state locally (not in a store — ephemeral)
  - `startWorkout(dayNumber)` → `sessionService.startSession` → start timer
  - `logSet(exerciseId, setNumber, weight, reps)` → update local state → `sessionService.updateSessionExercise`
  - `completeExercise(exerciseId)` → mark exercise done in local state
  - `completeWorkout()` → execute error matrix:
    1. `sessionService.completeSession()` — if fails: set error, abort
    2. `claudeService.generateCheckIn()` — if fails: set `aiSkipped: true`, continue
    3. `sessionService.updateSessionAIFeedback()` — if fails: silent
    4. `backboardService.storeSessionMemory()` — if fails: silent

- [ ] `src/hooks/useNutrition.ts`
  - On mount: `nutritionService.getTodayMeals()` + `getDailyMacros()`
  - `searchFood(query)` → debounced (300ms), calls `nutritionService.searchFood`
  - `logMeal(mealType, foods)` → `nutritionService.logMeal` → refresh today's meals
  - `addFood(mealId, food)` → `nutritionService.addFoodToMeal` → refresh

---

## Interface Contract with Frontend

The frontend (Claude Code) will consume only:
- `src/types/*` — all type definitions
- `src/hooks/*` — all hooks
- `src/store/*` — read-only store access where needed

**Hooks must export clean, typed interfaces.** No service imports in screen files. No raw Supabase calls in components.

---

## Dependency Order
```
Phase 0 bootstrap
  → Phase 2 types (including navigation.ts)
    → Phase 3 migrations (external: Supabase + Backboard confirmed)
      → Phase 3 services
        → Phase 4 stores
          → Phase 4 hooks
            → ✅ Backend complete — Frontend unblocked
```
