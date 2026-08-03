import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dzolyrcatbjofpgdgmfr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6b2x5cmNhdGJqb2ZwZ2RnbWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3ODg2NDUsImV4cCI6MjEwMTM2NDY0NX0.PXLoTLLGSqvim3_mm0ECNv6nkKQ3du6cfKGfTZNsuLk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);