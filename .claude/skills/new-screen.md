---
name: new-screen
description: Scaffold a new React Native screen with container-presenter pattern, typed props, and navigation wiring
user_invocable: true
arguments:
  - name: screen_name
    description: "PascalCase name of the screen (e.g. OnboardingGoals, WorkoutDetail)"
    required: true
---

# New Screen Skill

Create a new screen for the Arnold app following the container-presenter architecture.

## Steps

1. **Read the project conventions** from `docs/ARCHITECTURE.md` and `docs/UI_GUIDELINES.md` to ensure compliance.

2. **Create the screen directory** at `src/screens/{screen_name}/` with:
   - `{screen_name}Screen.tsx` — the container component (data fetching, state, hooks)
   - `{screen_name}View.tsx` — the presenter component (pure UI, receives props)
   - `index.ts` — barrel export

3. **Container (`{screen_name}Screen.tsx`)** must:
   - Be a functional component with TypeScript
   - Import and render the View component, passing all data as typed props
   - Handle loading/error states
   - Use custom hooks for business logic where appropriate
   - Wrap content in `SafeAreaView`

4. **Presenter (`{screen_name}View.tsx`)** must:
   - Define a typed `Props` interface for all incoming data
   - Use `StyleSheet.create` for all styles (no inline styles)
   - Use design tokens from `src/constants/Colors.ts` and `src/constants/Typography.ts`
   - Use spacing intervals: 4, 8, 12, 16, 24, 32
   - Buttons must be minimum 48px height with borderRadius 8 or 12

5. **Barrel export (`index.ts`)**:
   ```typescript
   export { default } from './{screen_name}Screen';
   ```

6. **Wire into navigation**: If `src/navigation/` exists, add the screen to the appropriate navigator stack. If navigation is not yet set up, note this in the output.

## Template Structure

```typescript
// {screen_name}Screen.tsx
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import {screen_name}View from './{screen_name}View';

export default function {screen_name}Screen() {
  // Container: state, data fetching, business logic here

  return (
    <SafeAreaView style={styles.container}>
      <{screen_name}View />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
```

```typescript
// {screen_name}View.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';

interface Props {
  // Define all props here
}

export default function {screen_name}View({}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{screen_name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { ...Typography.h1 },
});
```
