import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://coopmbirrsayeelcjuzw.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvb3BtYmlycnNheWVlbGNqdXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NTYwNjksImV4cCI6MjA5NjUzMjA2OX0.aTO2HA3MvpMDVYrpJ8nCNyzeIc_hBwFBjO9rcCsf85M';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
