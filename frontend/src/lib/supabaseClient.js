import { createClient } from '@supabase/supabase-js';

let _client = null;

function getSupabaseClient() {
  if (_client) return _client;

  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Supabase env vars not set. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your deployment environment.'
    );
  }

  _client = createClient(url, key);
  return _client;
}

export const supabase = new Proxy({}, {
  get(_, prop) {
    return getSupabaseClient()[prop];
  },
  apply(_, __, args) {
    return getSupabaseClient()(...args);
  },
});
