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

-- Policy: allow service_role (backend) full access
create policy if not exists "service_role full access" on public.rsvps
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Policy: allow anonymous reads (for listing RSVPs via public endpoint if needed)
create policy if not exists "anon read all" on public.rsvps
  for select
  using (true);

-- Grant permissions
grant all on public.rsvps to anon;
grant all on public.rsvps to authenticated;
grant all on public.rsvps to service_role;
