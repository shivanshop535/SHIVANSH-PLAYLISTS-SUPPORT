-- Run this once in your Supabase project's SQL Editor (Supabase Dashboard
-- > SQL Editor > New query), then click "Run".

create extension if not exists "pgcrypto";

create table if not exists public.supports (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  status text not null default 'pending' check (status in ('pending', 'verified')),
  support_date date,                 -- set only once verified (IST day)
  created_at timestamptz not null default now(),
  verified_at timestamptz
);

create index if not exists supports_username_idx on public.supports (username);
create index if not exists supports_status_idx on public.supports (status);
create index if not exists supports_support_date_idx on public.supports (support_date);

-- Row Level Security: the site only ever talks to Supabase from the /api
-- serverless functions using the service role key, which bypasses RLS.
-- RLS is still enabled with no public policies, so the anon key (if ever
-- leaked) cannot read or write anything.
alter table public.supports enable row level security;
