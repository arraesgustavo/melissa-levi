-- Create RSVPs table
create table if not exists public.rsvps (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  attending    text not null check (attending in ('yes','no')),
  guests       int default 1,
  meal         text,
  dietary      text,
  song         text,
  note         text,
  created_at   timestamptz default now()
);

-- Create index on email for quick lookups
create index if not exists idx_rsvps_email on public.rsvps(email);

-- Row Level Security: enable for security
alter table public.rsvps enable row level security;

-- Drop existing policies if they exist
drop policy if exists "service_role full access" on public.rsvps;
drop policy if exists "anon read all" on public.rsvps;
drop policy if exists "anon insert rsvp" on public.rsvps;

-- Policy: allow anon to INSERT (create new RSVPs)
create policy "anon insert rsvp" on public.rsvps
  for insert
  with check (true);

-- Policy: allow anon to SELECT (read RSVPs)
create policy "anon read all" on public.rsvps
  for select
  using (true);

-- Policy: allow service_role (backend) full access
create policy "service_role full access" on public.rsvps
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Grant permissions
grant all on public.rsvps to anon;
grant all on public.rsvps to authenticated;
grant all on public.rsvps to service_role;
