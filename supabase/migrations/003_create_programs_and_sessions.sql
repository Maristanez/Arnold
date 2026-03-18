create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text not null,
  fitness_identity fitness_identity not null,
  days jsonb not null,
  is_active boolean not null default true,
  week_number integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_id uuid not null references public.programs(id) on delete cascade,
  day_number integer not null,
  day_name text not null,
  exercises jsonb not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  duration_seconds integer,
  ai_feedback text,
  ai_assessment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.programs enable row level security;
alter table public.sessions enable row level security;

create index if not exists idx_programs_user_active on public.programs(user_id, is_active);
create index if not exists idx_sessions_user_started_at on public.sessions(user_id, started_at desc);

create policy "programs_select_own"
  on public.programs
  for select
  using (auth.uid() = user_id);

create policy "programs_insert_own"
  on public.programs
  for insert
  with check (auth.uid() = user_id);

create policy "programs_update_own"
  on public.programs
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "programs_delete_own"
  on public.programs
  for delete
  using (auth.uid() = user_id);

create policy "sessions_select_own"
  on public.sessions
  for select
  using (auth.uid() = user_id);

create policy "sessions_insert_own"
  on public.sessions
  for insert
  with check (auth.uid() = user_id);

create policy "sessions_update_own"
  on public.sessions
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "sessions_delete_own"
  on public.sessions
  for delete
  using (auth.uid() = user_id);

create trigger programs_set_updated_at
before update on public.programs
for each row
execute function public.update_updated_at_column();

create trigger sessions_set_updated_at
before update on public.sessions
for each row
execute function public.update_updated_at_column();
