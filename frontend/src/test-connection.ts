import { createClient } from '@supabase/supabase-js';

// Replace these with your actual values when running the test
const SUPABASE_URL = 'https://yqoigziaqznsenpxkkwx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlxb2lnemlhcXpuc2VucHhra3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyODM0NDQsImV4cCI6MjA2MTg1OTQ0NH0.Z2FJgvja6KqXgJgXQHdJIhNon4xLxqVDmnS0fOWtnAQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  try {
    // Simple test query - fetching Supabase system health
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return;
    }
    
    console.log('✅ Successfully connected to Supabase!');
    console.log('Data:', data);
  } catch (err) {
    console.error('❌ Error testing connection:', err);
  }
}

testConnection(); 