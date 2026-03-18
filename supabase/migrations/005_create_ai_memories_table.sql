create table if not exists public.ai_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.ai_memories enable row level security;

create index if not exists idx_ai_memories_user_created_at on public.ai_memories(user_id, created_at desc);
create index if not exists idx_ai_memories_user_type on public.ai_memories(user_id, type);

create policy "ai_memories_select_own"
  on public.ai_memories
  for select
  using (auth.uid() = user_id);

create policy "ai_memories_insert_own"
  on public.ai_memories
  for insert
  with check (auth.uid() = user_id);

create policy "ai_memories_update_own"
  on public.ai_memories
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "ai_memories_delete_own"
  on public.ai_memories
  for delete
  using (auth.uid() = user_id);
