import { createClient } from '@supabase/supabase-js';

// Supabase project credentials
const SUPABASE_URL = 'https://onmcwrrtfwsprwkaogkg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ubWN3cnJ0ZndzcHJ3a2FvZ2tnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3MzIzNTMsImV4cCI6MjA4NjMwODM1M30.rkyCQAaSAC7WAzgbOT7Ab93fU741XoiXHVXxFCWZIu0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
