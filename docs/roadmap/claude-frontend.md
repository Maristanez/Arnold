# Arnold MVP — Frontend Tasks (Claude Code)

_Assigned to: Claude Code_
_Last updated: 2026-03-18_

---

## Scope
Everything that renders UI: design system, navigation shell, screens, and screen-specific components. All data comes from hooks (`src/hooks/`) — screens never import services or stores directly.

## On shadcn / Magic UI
These are **web-only** libraries (React DOM + Tailwind CSS). They cannot be installed in a React Native / Expo project. The **shadcn MCP** is available as a design pattern and API reference tool, but all components are built using React Native primitives (`View`, `Text`, `Pressable`, `StyleSheet`) styled to match the dark premium aesthetic. Magic UI animations are replicated using `react-native-reanimated`.

---

## Status Legend
- `[ ]` Not started
- `[~]` In progress
- `[x]` Done
- `[!]` Blocked / needs decision

---

## Phase 0 — Bootstrap (Frontend portion)
> Must be done before any screen renders correctly.

- [x] `app.json` updated (dark mode, dark splash)
- [x] `app.config.ts` created
- [ ] Delete `app.json` — having both causes an Expo conflict ⚠️
- [ ] Create `babel.config.js` 🔴 BLOCKING — without this, path aliases and Reanimated crash at runtime

```js
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: { '@': './src' },
        },
      ],
      'react-native-reanimated/plugin', // must be last
    ],
  };
};
```

- [ ] Install `babel-plugin-module-resolver` as a devDependency

---

## Phase 1 — Design System Foundation
> Completed. Listed for reference.

### Constants
- [x] `src/constants/Colors.ts`
- [x] `src/constants/Typography.ts`
- [x] `src/constants/Spacing.ts`
- [x] `src/constants/index.ts`

### Base Components
- [x] `src/components/Button.tsx` — primary/secondary/ghost, Animated scale, loading state
- [x] `src/components/Card.tsx` — optional onPress with scale animation
- [x] `src/components/Input.tsx` — focus/error border states
- [x] `src/components/ScreenContainer.tsx` — SafeAreaView, optional scroll + padding
- [x] `src/components/Typography.tsx` — H1, H2, H3, Body, BodySmall, Caption, Label
- [x] `src/components/Spacer.tsx`
- [x] `src/components/LoadingScreen.tsx`
- [x] `src/components/ErrorBanner.tsx`
- [x] `src/components/index.ts`

### Remaining Base Components
- [ ] `src/components/OnboardingProgress.tsx`
  - 5 dots: filled green = complete, green outline = current, gray = upcoming
  - Animated transition between states (Reanimated scale/opacity)

- [ ] `src/components/SelectionCard.tsx`
  - Card with title, optional subtitle, optional icon
  - `selected` prop → green border (`#4CAF50`), subtle green background tint
  - Pressable with scale animation

---

## Phase 4 — Navigation Shell
> Depends on: `src/types/navigation.ts` from Codex backend

### App Entry
- [ ] `App.tsx` — replace boilerplate:
  ```tsx
  import { GestureHandlerRootView } from 'react-native-gesture-handler';
  import { NavigationContainer } from '@react-navigation/native';
  import { StatusBar } from 'expo-status-bar';
  import { RootNavigator } from '@/navigation/RootNavigator';
  import { useAuth } from '@/hooks/useAuth';

  export default function App() {
    const { isBootstrapping } = useAuth();
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <StatusBar style="light" />
          <RootNavigator isBootstrapping={isBootstrapping} />
        </NavigationContainer>
      </GestureHandlerRootView>
    );
  }
  ```

### Navigation Files
- [ ] `src/navigation/RootNavigator.tsx`
  - While `isBootstrapping`: render `<LoadingScreen />`
  - Not authenticated: render `<AuthStack />`
  - Authenticated + not onboarded: render `<OnboardingStack />`
  - Authenticated + onboarded: render `<MainTabs />`
  - ⚠️ The loading state prevents the Welcome screen flash (Flaw #8)

- [ ] `src/navigation/AuthStack.tsx`
  - `createNativeStackNavigator<AuthStackParamList>`
  - Screens: Welcome, SignIn, SignUp
  - Header hidden, dark background

- [ ] `src/navigation/OnboardingStack.tsx`
  - `createNativeStackNavigator<OnboardingStackParamList>`
  - Screens: OnboardingIdentity → Goals → History → Preferences → Summary
  - Header hidden

- [ ] `src/navigation/MainTabs.tsx` ⚠️ Complex (Flaw #6)
  - `createBottomTabNavigator<TabParamList>`
  - Custom `tabBar` prop — render a component with absolute-positioned FAB in center
  - Tab bar background: `#1A1A1A`, active icon: `#4CAF50`, inactive: `#666666`
  - FAB: 56×56px, `#4CAF50`, `borderRadius: 28`, absolute position centered, shadow
  - FAB onPress: navigate to `WorkoutActive` for today's program day
  - Tabs: Home, Workout, [FAB placeholder], Nutrition, Profile

  ```tsx
  // Custom tab bar pattern:
  function CustomTabBar({ state, descriptors, navigation }) {
    return (
      <View style={styles.tabBar}>
        {/* Left two tabs */}
        {/* Center FAB */}
        <Pressable style={styles.fab} onPress={startTodaysWorkout}>
          <Ionicons name="barbell" size={28} color="#fff" />
        </Pressable>
        {/* Right two tabs */}
      </View>
    );
  }
  ```

---

## Phase 5 — Auth Screens

### Welcome
- [ ] `src/screens/auth/WelcomeScreen.tsx` — bootstraps nothing, passes `navigation` to view
- [ ] `src/screens/auth/WelcomeView.tsx`
  - Full screen, background `#0A0A0A`
  - Arnold wordmark (bold, white, large)
  - Tagline: "Your AI-powered training partner"
  - `Button` (primary, full-width): "Create Account" → navigate to SignUp
  - `Button` (ghost, full-width): "Sign In" → navigate to SignIn
  - Generous vertical spacing, logo centered upper half

### Sign In
- [ ] `src/screens/auth/SignInScreen.tsx` — calls `useAuth().signIn`, handles loading + error
- [ ] `src/screens/auth/SignInView.tsx`
  - `Input` for email, `Input` for password (secureTextEntry)
  - `Button` (primary): "Sign In" — loading state while request in flight
  - `ErrorBanner` if `error` prop set
  - Link text: "Don't have an account? Create one" → navigate to SignUp
  - `KeyboardAvoidingView` with `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`

### Sign Up
- [ ] `src/screens/auth/SignUpScreen.tsx` — calls `useAuth().signUp`, handles loading + error
- [ ] `src/screens/auth/SignUpView.tsx`
  - `Input` for email
  - `Input` for password (secureTextEntry)
  - `Input` for confirm password (secureTextEntry)
  - Client-side validate: passwords match before calling signUp
  - `Button` (primary): "Create Account"
  - `ErrorBanner` if error
  - `KeyboardAvoidingView`

---

## Phase 5 — Onboarding Screens

> Data collected via `onboardingStore` (Zustand), not navigation params. All screens read/write `useOnboardingStore()`.

### Identity (Step 1)
- [ ] `src/screens/onboarding/OnboardingIdentityScreen.tsx`
- [ ] `src/screens/onboarding/OnboardingIdentityView.tsx`
  - `OnboardingProgress` at top (step 1 of 5)
  - H2: "What best describes you?"
  - 2-column grid of 6 `SelectionCard` components:
    - Bodybuilder, Powerlifter, Athlete, Crossfitter, Casual, Beginner
  - One selection at a time (radio behavior)
  - `Button` (primary, disabled until selection made): "Continue"

### Goals (Step 2)
- [ ] `src/screens/onboarding/OnboardingGoalsScreen.tsx`
- [ ] `src/screens/onboarding/OnboardingGoalsView.tsx`
  - `OnboardingProgress` (step 2 of 5)
  - H2: "What are your goals?"
  - Goals filtered by identity from store (see goals table in `mvp-roadmap.md`)
  - Multi-select `SelectionCard` (up to 3, disable others after 3 selected)
  - `Button`: "Continue"

### History (Step 3)
- [ ] `src/screens/onboarding/OnboardingHistoryScreen.tsx`
- [ ] `src/screens/onboarding/OnboardingHistoryView.tsx`
  - `OnboardingProgress` (step 3 of 5)
  - Experience level: 3 `SelectionCard` (Beginner / Intermediate / Advanced) — radio
  - Years training: numeric `Input` or stepper (0–30)
  - Injuries/limitations: multi-line `Input`, optional, placeholder "e.g. bad lower back"
  - `Button`: "Continue"

### Preferences (Step 4)
- [ ] `src/screens/onboarding/OnboardingPreferencesScreen.tsx`
- [ ] `src/screens/onboarding/OnboardingPreferencesView.tsx`
  - `OnboardingProgress` (step 4 of 5)
  - Days per week: 1–7 horizontal number selector (tappable circles)
  - Session duration: 4 `SelectionCard` options (30 / 45 / 60 / 90 min)
  - Equipment: multi-select chip list (Barbell, Dumbbells, Cables, Machines, Bodyweight, Kettlebells, Bands)
  - `Button`: "Continue"

### Summary (Step 5)
- [ ] `src/screens/onboarding/OnboardingSummaryScreen.tsx`
  - Reads from `onboardingStore`
  - On "Generate My Program": (1) save profile via `useUser().completeOnboarding(data)` → (2) generate program via `useProgram().generateNewProgram(data)` → (3) clear `onboardingStore` → (4) navigate to MainTabs
  - Set `isGenerating` state for loading UI
  - If step 1 (profile save) fails: show error, allow retry
  - If step 2 (program gen) fails: navigate to MainTabs anyway — program can be generated later
- [ ] `src/screens/onboarding/OnboardingSummaryView.tsx`
  - `OnboardingProgress` (step 5 of 5)
  - H2: "Here's your plan"
  - Summary cards: Identity badge, goals list, days/week, duration, equipment chips
  - `Button` (primary, full-width): "Generate My Program"
  - While generating: replace button with `LoadingScreen`-style spinner + "Building your program..."

---

## Phase 6 — Home + Workout Screens

### Home
- [ ] `src/screens/home/HomeScreen.tsx` — loads `useProgram()`, `useAuth()`
- [ ] `src/screens/home/HomeView.tsx`
  - Greeting: "Good morning, [first name]" (H2)
  - `WorkoutPreviewCard` for today's workout
  - 7-day indicator row (`DayIndicator` × 7)
  - Program name + week number

### Program Detail
- [ ] `src/screens/home/ProgramDetailScreen.tsx`
- [ ] `src/screens/home/ProgramDetailView.tsx`
  - Full week: collapsible day cards
  - Each day: `ExerciseRow` list with sets × reps

### Workout Active
- [ ] `src/screens/workout/WorkoutActiveScreen.tsx` — loads `useWorkout()`
- [ ] `src/screens/workout/WorkoutActiveView.tsx`
  - `WorkoutTimer` at top
  - `ScrollView` of `ExerciseCard` components
  - Each `ExerciseCard` expands to show `SetRow` list
  - "Complete Workout" button at bottom (requires ≥1 set logged)
  - On complete → navigate to WorkoutCheckIn

### Workout Check-In (full-screen push, not modal)
- [ ] `src/screens/workout/WorkoutCheckInScreen.tsx` — reads `aiSkipped` from `useWorkout()`
- [ ] `src/screens/workout/WorkoutCheckInView.tsx`
  - If `aiSkipped`: show "Workout saved!" + summary stats + "Back to Home"
  - If AI feedback available:
    - Assessment badge (Strong / Solid / Challenging / Needs Recovery)
    - AI summary text (body)
    - Encouragement line
    - Adjustments list (if any)
    - "Back to Home" button

### Workout History
- [ ] `src/screens/workout/WorkoutHistoryScreen.tsx`
- [ ] `src/screens/workout/WorkoutHistoryView.tsx`
  - `FlatList` of past sessions
  - Each row: date, day name, duration, assessment badge
  - Empty state: "No workouts logged yet"

### Workout-Specific Components
- [ ] `src/components/DayIndicator.tsx`
  - Circle with day letter (M/T/W/T/F/S/S)
  - Variants: `completed` (filled green), `today` (green border, white text), `upcoming` (gray)

- [ ] `src/components/WorkoutPreviewCard.tsx`
  - `Card` with today's day name, exercise count, "Start Workout" `Button`
  - If no program: "No program found" + "Generate Program" button

- [ ] `src/components/ExerciseRow.tsx`
  - `name` + `{sets} × {reps}` in a single row
  - Used in ProgramDetail (non-interactive)

- [ ] `src/components/ExerciseCard.tsx`
  - Expandable: shows exercise name + sets count collapsed
  - Expanded: `SetRow` for each planned set
  - Animated expand/collapse (Reanimated height animation)

- [ ] `src/components/SetRow.tsx`
  - Set number label
  - Weight `Input` (numeric, kg/lbs)
  - Reps `Input` (numeric)
  - Checkmark `Pressable` to mark complete (turns green)

- [ ] `src/components/WorkoutTimer.tsx`
  - Displays `MM:SS` elapsed time
  - Uses `startedAt` timestamp + `AppState` listener:
    ```ts
    // On foreground: recalculate elapsed from startedAt
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    ```
  - Updates every second via `setInterval` while in foreground

---

## Phase 7 — Nutrition Screens

### Dashboard
- [ ] `src/screens/nutrition/NutritionDashboardScreen.tsx` — loads `useNutrition()`
- [ ] `src/screens/nutrition/NutritionDashboardView.tsx`
  - `MacroSummaryCard` × 4 at top (Calories, Protein, Carbs, Fat)
  - `MealGroup` × 4 below (Breakfast, Lunch, Dinner, Snack)
  - FAB or button per meal group: "+ Add Food" → navigate to FoodSearch with `mealType`
  - Empty state per meal group: "Nothing logged yet"

### Food Search
- [ ] `src/screens/nutrition/FoodSearchScreen.tsx` — loads `useNutrition().searchFood`
- [ ] `src/screens/nutrition/FoodSearchView.tsx`
  - Search `Input` at top (debounced 300ms via hook)
  - Meal type shown as label (passed via nav params from Dashboard)
  - `FlatList` of `FoodResultRow` components
  - Loading indicator while searching
  - Empty state: "Search for a food above"
  - On `FoodResultRow` press: show serving size selector → confirm → `addFood(mealId, food)` → pop back

### Meal Detail
- [ ] `src/screens/nutrition/MealDetailScreen.tsx`
- [ ] `src/screens/nutrition/MealDetailView.tsx`
  - Meal type header
  - List of foods with individual macros
  - Meal total macros at bottom
  - Swipe-to-delete or trash icon per food item

### Nutrition-Specific Components
- [ ] `src/components/MacroSummaryCard.tsx`
  - Label (e.g. "Protein"), current amount, target (if set), progress bar
  - Progress bar: `#4CAF50` fill on `#333` background, `borderRadius: 4`
  - Shows `--` if target not set

- [ ] `src/components/MealGroup.tsx`
  - Section header with meal type name + total cals for that meal
  - List of food names + calorie counts
  - "+ Add Food" link at bottom

- [ ] `src/components/FoodResultRow.tsx`
  - Food name (Body), brand name (Caption, gray)
  - Calories per serving (right-aligned)
  - Pressable row with subtle press state

---

## Phase 8 — Profile + Polish

### Profile Screen
- [ ] `src/screens/profile/ProfileScreen.tsx` — loads `useAuth()`, `useUser()`
- [ ] `src/screens/profile/ProfileView.tsx`
  - Email address (Caption)
  - Fitness identity badge (`#4CAF50` pill)
  - Stats: member since date, total workouts logged
  - `Button` (secondary): "Sign Out" → `signOut()` → navigates to Auth automatically via `RootNavigator`

### Polish Checklist
- [ ] React error boundary wrapping `<NavigationContainer>` in `App.tsx`
- [ ] All `Button` components show spinner during async operations
- [ ] All service errors rendered in `ErrorBanner` — no silent failures
- [ ] `KeyboardAvoidingView` on: SignIn, SignUp, OnboardingHistory, FoodSearch
  - Always use: `behavior={Platform.OS === 'ios' ? 'padding' : 'height'}`
- [ ] Empty states implemented: no program (Home), no sessions (History), no meals (Dashboard)
- [ ] Tab bar shows correct active icon color
- [ ] Center FAB has press animation (scale down)
- [ ] Back navigation consistent across all stacks

---

## Component Reference: shadcn MCP

The shadcn MCP is available as a **reference tool only**. Use it to:
- Look up interaction patterns (e.g. how shadcn handles Select, Combobox, progress bars)
- Reference accessibility patterns for inputs and modals
- Understand animation timing values

Do **not** install shadcn components — they are React DOM only and will not render in React Native.

---

## Dependency Order
```
Phase 0 (babel.config.js) — BLOCKING
  → Phase 1 (design system) ✅
    → Phase 4 (navigation) — needs navigation.ts from Codex
      → Phase 5 (auth + onboarding screens)
        ├→ Phase 6 (workout screens) ← parallel with Phase 7
        ├→ Phase 7 (nutrition screens) ← parallel with Phase 6
        └→ Phase 8 (profile + polish)
```

**Frontend is unblocked from Phase 5 onward once:**
1. `babel.config.js` exists
2. `src/types/navigation.ts` is delivered by Codex
3. All hooks (`useAuth`, `useUser`, `useProgram`, `useWorkout`, `useNutrition`) are implemented by Codex
