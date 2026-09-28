const { createClient } = require('@supabase/supabase-js');
const config = require('./env');

let supabase = null;

if (config.isSupabaseConfigured()) {
  const key = config.supabase.serviceRoleKey || config.supabase.anonKey;
  supabase = createClient(config.supabase.url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  console.log('[Database] Connected to Supabase PostgreSQL at:', config.supabase.url);
} else {
  console.log('[Database] Notice: Live Supabase credentials not found in backend/.env.');
  console.log('[Database] Running in local development mode with seed data.');
  console.log('[Database] To connect your live Supabase database, set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env');
}

module.exports = supabase;
