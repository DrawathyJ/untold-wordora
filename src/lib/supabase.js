import { createClient } from '@supabase/supabase-js';

// Retrieve credentials either from environment variables or runtime settings
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const localUrl = typeof window !== 'undefined' ? localStorage.getItem('unfiltered_sb_url') : null;
const localKey = typeof window !== 'undefined' ? localStorage.getItem('unfiltered_sb_anon_key') : null;

export const SUPABASE_URL = localUrl || envUrl || '';
export const SUPABASE_ANON_KEY = localKey || envAnonKey || '';

export const isSupabaseConfigured = () => {
  return (
    typeof SUPABASE_URL === 'string' &&
    SUPABASE_URL.trim().length > 0 &&
    SUPABASE_URL.startsWith('https://') &&
    !SUPABASE_URL.includes('your-project') &&
    typeof SUPABASE_ANON_KEY === 'string' &&
    SUPABASE_ANON_KEY.trim().length > 20 &&
    !SUPABASE_ANON_KEY.includes('your-anon-key')
  );
};

// Create client if configured, otherwise null
export const supabase = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Save runtime credentials to localStorage so users can test live Supabase directly from browser
 */
export const saveRuntimeSupabaseCredentials = (url, anonKey) => {
  if (url && anonKey) {
    localStorage.setItem('unfiltered_sb_url', url.trim());
    localStorage.setItem('unfiltered_sb_anon_key', anonKey.trim());
    window.location.reload();
  }
};

export const clearRuntimeSupabaseCredentials = () => {
  localStorage.removeItem('unfiltered_sb_url');
  localStorage.removeItem('unfiltered_sb_anon_key');
  window.location.reload();
};
