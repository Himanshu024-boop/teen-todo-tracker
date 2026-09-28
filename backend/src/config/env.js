const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-dev-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  isSupabaseConfigured() {
    return Boolean(
      this.supabase.url &&
      this.supabase.url.startsWith('https://') &&
      !this.supabase.url.includes('your-project-id') &&
      (this.supabase.serviceRoleKey || this.supabase.anonKey)
    );
  }
};

module.exports = config;
