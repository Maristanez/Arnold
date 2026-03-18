create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  meal_type text not null,
  foods jsonb not null,
  macros_total jsonb not null,
  logged_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.meals enable row level security;

create index if not exists idx_meals_user_logged_at on public.meals(user_id, logged_at desc);

create policy "meals_select_own"
  on public.meals
  for select
  using (auth.uid() = user_id);

create policy "meals_insert_own"
  on public.meals
  for insert
  with check (auth.uid() = user_id);

create policy "meals_update_own"
  on public.meals
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "meals_delete_own"
  on public.meals
  for delete
  using (auth.uid() = user_id);

create trigger meals_set_updated_at
before update on public.meals
for each row
execute function public.update_updated_at_column();
