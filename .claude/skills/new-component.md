---
name: new-component
description: Scaffold a reusable UI component with typed props and design system tokens
user_invocable: true
arguments:
  - name: component_name
    description: "PascalCase name of the component (e.g. Button, WorkoutCard, MacroRing)"
    required: true
---

# New Component Skill

Create a reusable UI component for the Arnold app.

## Steps

1. **Read design conventions** from `docs/UI_GUIDELINES.md` and check existing components in `src/components/` to avoid duplication.

2. **Create the component file** at `src/components/{component_name}.tsx`.

3. **The component** must:
   - Be a functional component with TypeScript
   - Export a typed `{component_name}Props` interface
   - Use `StyleSheet.create` for all styles
   - Import colors from `src/constants/Colors.ts`
   - Import typography from `src/constants/Typography.ts`
   - Use spacing intervals: 4, 8, 12, 16, 24, 32
   - Follow these UI rules:
     - Buttons: min 48px height, borderRadius 8 or 12
     - Inputs: minimal borders, active state uses brand color `#4CAF50`
     - Cards: subtle shadow in light mode, background separation (`#1E1E1E`) in dark mode
     - Icons: 24x24 default size
   - Use `Pressable` over `TouchableOpacity` for press interactions
   - Include micro-animation feedback on press where appropriate (scale)

4. **Export from barrel**: If `src/components/index.ts` exists, add the export there.

## Template

```typescript
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Colors from '../constants/Colors';

export interface {component_name}Props {
  // Define props
}

export default function {component_name}({}: {component_name}Props) {
  return (
    <View style={styles.container}>
      {/* Component content */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
```

## Checklist before finishing
- [ ] Props interface is exported and fully typed (no `any`)
- [ ] Uses design tokens, not hardcoded colors/fonts
- [ ] Meets tap target minimums (48px) for interactive elements
- [ ] Works in both light and dark mode if Colors supports it
