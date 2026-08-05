-- Close the open-read gap: only the admin (via JWT) can list guests
drop policy if exists "anon read all" on public.rsvps;

-- REPLACE_WITH_ADMIN_UUID: paste the Auth UUID of the single admin user
-- (Supabase dashboard: Authentication -> Users) before running this migration.
create policy "admin read all" on public.rsvps
  for select
  to authenticated
  using ((select auth.uid()) = 'b20dc951-b872-4123-991a-df1e2fb12f01'::uuid);
