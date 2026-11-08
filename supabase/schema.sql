-- Run this once in Supabase: SQL Editor > New query > paste > Run.
-- All tables are locked (Row Level Security on, no public policies).
-- The site reads and writes them only on the server with the service role key.

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  message text not null,
  source text not null default 'form',
  read boolean not null default false
);

create table if not exists chat_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text,
  question text not null,
  answer text,
  model text,
  rating smallint
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null,
  label text,
  meta jsonb
);

create table if not exists content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists rate_limits (
  key text primary key,
  count integer not null,
  reset_at timestamptz not null
);

alter table messages enable row level security;
alter table chat_logs enable row level security;
alter table events enable row level security;
alter table content enable row level security;
alter table rate_limits enable row level security;

create index if not exists events_created_idx on events (created_at desc);
create index if not exists messages_created_idx on messages (created_at desc);
create index if not exists chat_logs_created_idx on chat_logs (created_at desc);

-- Atomic rate limiter. Returns true when the caller is over the limit.
create or replace function hit_rate_limit(p_key text, p_window integer, p_limit integer)
returns boolean
language plpgsql
security definer
as $$
declare c integer;
begin
  insert into rate_limits (key, count, reset_at)
  values (p_key, 1, now() + make_interval(secs => p_window))
  on conflict (key) do update set
    count = case when rate_limits.reset_at < now() then 1 else rate_limits.count + 1 end,
    reset_at = case when rate_limits.reset_at < now() then now() + make_interval(secs => p_window) else rate_limits.reset_at end
  returning count into c;
  return c > p_limit;
end;
$$;

revoke all on function hit_rate_limit(text, integer, integer) from public, anon, authenticated;
