import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Checks if Supabase is properly configured in the environment variables.
 */
export const isSupabaseConfigured = (): boolean => {
  return !!supabaseUrl && !!supabaseAnonKey && 
         supabaseUrl !== 'YOUR_SUPABASE_URL' && 
         supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';
};

/**
 * Supabase Browser/Client Integration via @supabase/ssr
 */
export const supabase = createBrowserClient(
  supabaseUrl || 'https://placeholder-url-for-compilation.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
