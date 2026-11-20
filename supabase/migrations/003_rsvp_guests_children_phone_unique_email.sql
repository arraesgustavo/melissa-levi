-- Migration 003: Individual guests, children, phone number, unique email, and self-service manage token
-- Preserves all existing data in public.rsvps (keeps legacy meal/dietary/song columns nullable).

-- 1. Extend public.rsvps with new columns
alter table public.rsvps
  add column if not exists phone text,
  add column if not exists children_count int not null default 0 check (children_count >= 0),
  add column if not exists manage_token uuid not null default gen_random_uuid();

-- Ensure guests count allows 0..4 (for attending = 'no', removals, and max 4 guests > 7 years)
alter table public.rsvps
  alter column guests set default 0;

alter table public.rsvps
  drop constraint if exists chk_rsvps_guests_max_4;

alter table public.rsvps
  add constraint chk_rsvps_guests_max_4 check (guests >= 0 and guests <= 4);

-- Normalize existing emails to lowercase + trimmed before creating unique index
update public.rsvps
set email = lower(trim(email))
where email <> lower(trim(email));

-- Enforce one registration per email address (case-insensitive)
-- Note: If pre-existing test data contains duplicate emails, deduplicate those rows before running.
create unique index if not exists uq_rsvps_email_lower
  on public.rsvps (lower(trim(email)));

create unique index if not exists uq_rsvps_manage_token
  on public.rsvps (manage_token);

-- 2. Relational table for individual guests (> 7 years) and children (<= 7 years)
create table if not exists public.rsvp_guests (
  id          uuid primary key default gen_random_uuid(),
  rsvp_id     uuid not null references public.rsvps(id) on delete cascade,
  full_name   text not null check (length(trim(full_name)) > 0),
  guest_type  text not null default 'adult' check (guest_type in ('adult', 'child')),
  is_primary  boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists idx_rsvp_guests_rsvp_id
  on public.rsvp_guests (rsvp_id);

-- Backfill existing attending RSVPs that do not yet have individual guest rows
insert into public.rsvp_guests (rsvp_id, full_name, guest_type, is_primary)
select r.id, r.name, 'adult', true
from public.rsvps r
where r.attending = 'yes'
  and not exists (
    select 1 from public.rsvp_guests g where g.rsvp_id = r.id
  );

-- 3. Row Level Security on public.rsvp_guests & admin update policy on public.rsvps
alter table public.rsvp_guests enable row level security;

drop policy if exists "service_role full access" on public.rsvp_guests;
drop policy if exists "admin read all guests" on public.rsvp_guests;
drop policy if exists "admin delete guests" on public.rsvp_guests;

create policy "service_role full access" on public.rsvp_guests
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "admin read all guests" on public.rsvp_guests
  for select
  to authenticated
  using ((select auth.uid()) = 'b20dc951-b872-4123-991a-df1e2fb12f01'::uuid);

create policy "admin delete guests" on public.rsvp_guests
  for delete
  to authenticated
  using ((select auth.uid()) = 'b20dc951-b872-4123-991a-df1e2fb12f01'::uuid);

drop policy if exists "admin update rsvps" on public.rsvps;
create policy "admin update rsvps" on public.rsvps
  for update
  to authenticated
  using ((select auth.uid()) = 'b20dc951-b872-4123-991a-df1e2fb12f01'::uuid)
  with check ((select auth.uid()) = 'b20dc951-b872-4123-991a-df1e2fb12f01'::uuid);

-- Permissions
grant select, delete on public.rsvp_guests to authenticated;
grant all on public.rsvp_guests to service_role;
