---
name: new-service
description: Scaffold a service module in src/services/ with typed inputs/outputs and error handling
user_invocable: true
arguments:
  - name: service_name
    description: "camelCase name of the service (e.g. auth, workout, profile, nutrition)"
    required: true
---

# New Service Skill

Create a service module for the Arnold app that abstracts API/database interactions.

## Steps

1. **Read existing services** in `src/services/` to understand patterns and avoid duplication.

2. **Read the data models** from `README.md` (Key Data Models section) and `src/types/` to understand the relevant types.

3. **Create the service file** at `src/services/{service_name}Service.ts`.

4. **The service** must:
   - Export typed async functions (never classes unless justified)
   - Define input and output types — import from `src/types/` or define locally if new
   - Import the Supabase client from `src/services/supabase.ts` (create if it doesn't exist)
   - Handle errors gracefully: return `{ data, error }` pattern matching Supabase conventions
   - Never expose raw database responses — map to typed app models
   - Keep functions focused: one operation per function

5. **If this service interacts with Supabase**, follow these rules:
   - All queries go through the typed Supabase client
   - Never bypass RLS — queries should work within the authenticated user's context
   - Use `.select()` to limit returned columns
   - Handle `null` returns explicitly

6. **If this service calls an external API** (Claude, Backboard.io, Open Food Facts):
   - API keys come from environment variables (never hardcoded)
   - Include request timeout handling
   - Type the API response and map to internal types
   - Add a brief JSDoc comment on the function explaining what API it hits

7. **Add types**: If new types are needed, create them in `src/types/{service_name}.ts` and export from `src/types/index.ts`.

## Template

```typescript
// src/services/{service_name}Service.ts
import { supabase } from './supabase';

export async function getSomething(id: string): Promise<{ data: SomeType | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('table_name')
      .select('id, name, created_at')
      .eq('id', id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err) {
    return { data: null, error: 'Unexpected error' };
  }
}
```

## Checklist before finishing
- [ ] All functions are typed (input params and return type)
- [ ] No `any` types
- [ ] Error handling returns `{ data, error }` — never throws to callers
- [ ] No hardcoded API keys or URLs
- [ ] Supabase client imported from shared module
