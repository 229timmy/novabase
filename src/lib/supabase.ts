import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qqgqrrzjacfedcspkonn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxZ3FycnpqYWNmZWRjc3Brb25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwNjE0MzIsImV4cCI6MjA1NDYzNzQzMn0.HImGLeZyGDjUxQpLZbCdsEpUl4H9PsVK7G_HuZlLViY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'novabase_auth_token',
    storage: window.localStorage
  }
}); 