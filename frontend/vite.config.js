import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...process.env };

  const SUPABASE_URL = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

  if (mode === 'production' && (!SUPABASE_URL || !SUPABASE_ANON_KEY)) {
    console.warn(
      '\x1b[33m%s\x1b[0m',
      'WARNING: Supabase env vars not found. The app will fail at runtime on pages that use the Supabase client. ' +
      'Set SUPABASE_URL & SUPABASE_ANON_KEY (Vercel) or VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY (local .env).'
    );
  }

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(SUPABASE_ANON_KEY),
    },
    server: {
      proxy: {
        '/api': 'http://localhost:8000',
      },
    },
  };
})
