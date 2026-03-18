---
name: supabase-migration
description: Generate a Supabase SQL migration file for schema changes
user_invocable: true
arguments:
  - name: migration_name
    description: "snake_case name describing the change (e.g. create_users_table, add_sessions_table)"
    required: true
---

# Supabase Migration Skill

Generate a SQL migration file for the Arnold app's Supabase database.

## Steps

1. **Read existing migrations** in `supabase/migrations/` to understand current schema state. If the directory doesn't exist, create `supabase/migrations/`.

2. **Read the data models** from `README.md` (Key Data Models section) to understand the intended schema.

3. **Generate the migration file** at `supabase/migrations/{timestamp}_{migration_name}.sql` where timestamp is `YYYYMMDDHHMMSS` format using the current time.

4. **The migration SQL** must:
   - Use `CREATE TABLE IF NOT EXISTS` for new tables
   - Use `ALTER TABLE` for modifications to existing tables
   - Include appropriate column types:
     - `uuid` for IDs, with `DEFAULT gen_random_uuid()`
     - `timestamptz` for all timestamps, with `DEFAULT now()` where appropriate
     - `text` for strings (not `varchar` unless there's a hard constraint)
     - `jsonb` for flexible nested data (e.g., foods in meals, exercise details)
     - Proper enums using `CREATE TYPE` for fixed sets (e.g., fitness_identity)
   - Add foreign key constraints with `REFERENCES` and appropriate `ON DELETE` behavior
   - Add `created_at` and `updated_at` columns to every table
   - Include indexes on frequently queried columns (foreign keys, dates)

5. **Row Level Security** — every table must have:
   ```sql
   ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Users can view own data" ON table_name
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own data" ON table_name
     FOR INSERT WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update own data" ON table_name
     FOR UPDATE USING (auth.uid() = user_id);
   ```

6. **Add a comment block** at the top of the file explaining what the migration does.

## Template

```sql
-- Migration: {migration_name}
-- Description: Brief description of what this migration does
-- Date: {current_date}

-- Create enum types (if needed)
DO $$ BEGIN
  CREATE TYPE fitness_identity AS ENUM (
    'beginner', 'general', 'bodybuilder', 'powerlifter', 'athletic', 'weight_loss'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create table
CREATE TABLE IF NOT EXISTS table_name (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_table_name_user_id ON table_name(user_id);

-- RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON table_name
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON table_name
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON table_name
  FOR UPDATE USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_table_name_updated_at
  BEFORE UPDATE ON table_name
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Checklist before finishing
- [ ] All tables have `id`, `created_at`, `updated_at`
- [ ] Foreign keys reference correct tables with proper ON DELETE
- [ ] RLS enabled with policies for SELECT, INSERT, UPDATE
- [ ] Indexes on user_id and other frequently queried columns
- [ ] Enums created with IF NOT EXISTS safety
- [ ] updated_at trigger included
