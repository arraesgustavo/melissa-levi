-- Close the open-read gap: only the admin (via JWT) can list guests
drop policy if exists "anon read all" on public.rsvps;

-- REPLACE_WITH_ADMIN_UUID: paste the Auth UUID of the single admin user
-- (Supabase dashboard: Authentication -> Users) before running this migration.
create policy "admin read all" on public.rsvps
  for select
  to authenticated
  using ((select auth.uid()) = 'dc5da923-7e6b-4cef-8d31-3f7c83ed96e2'::uuid);
