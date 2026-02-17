import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sextbflfplnsqwbpindf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNleHRiZmxmcGxuc3F3YnBpbmRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNDQwMTcsImV4cCI6MjA4NjkyMDAxN30.FDaOOarriP7oLArBa_dEmJ5iv6svh3PBifBuY6Q9RYw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
