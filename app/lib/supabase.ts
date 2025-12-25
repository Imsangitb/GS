import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// Default fallback values that are definitely valid URLs and keys
const FALLBACK_URL = 'https://placeholder-project.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-key';

// Get environment variables with strong fallbacks
const getSupabaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!envUrl || envUrl.trim() === '') {
    console.warn('No Supabase URL found in environment variables, using fallback');
    return FALLBACK_URL;
  }
  
  // Validate URL format
  try {
    new URL(envUrl);
    return envUrl;
  } catch (error) {
    console.error('Invalid Supabase URL format:', envUrl);
    return FALLBACK_URL;
  }
};

const getSupabaseAnonKey = () => {
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!envKey || envKey.trim() === '') {
    console.warn('No Supabase anonymous key found in environment variables, using fallback');
    return FALLBACK_KEY;
  }
  return envKey;
};

// Safe values for URLs and keys
const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();

// Server-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  }
});

// Client-side Supabase client creator
export const createSupabaseClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};