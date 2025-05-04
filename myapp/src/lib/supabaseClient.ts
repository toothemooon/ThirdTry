import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in a .env file
const supabaseUrl = 'https://yqoigziaqznsenpxkkwx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlxb2lnemlhcXpuc2VucHhra3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyODM0NDQsImV4cCI6MjA2MTg1OTQ0NH0.Z2FJgvja6KqXgJgXQHdJIhNon4xLxqVDmnS0fOWtnAQ';

// For better type safety, you can import the Database types
// Example: import type { Database } from '$lib/types/database.types';
// and pass it as a generic to createClient<Database>()
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 