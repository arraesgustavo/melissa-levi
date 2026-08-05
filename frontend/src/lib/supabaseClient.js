import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://coopmbirrsayeelcjuzw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvb3BtYmlycnNheWVlbGNqdXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NTYwNjksImV4cCI6MjA5NjUzMjA2OX0.aTO2HA3MvpMDVYrpJ8nCNyzeIc_hBwFBjO9rcCsf85M'
);
