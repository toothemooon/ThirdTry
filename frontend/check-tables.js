// Script to check which tables exist in Supabase
import { createClient } from '@supabase/supabase-js';

// User provided credentials
const SUPABASE_URL = 'https://yqoigziaqznsenpxkkwx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlxb2lnemlhcXpuc2VucHhra3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyODM0NDQsImV4cCI6MjA2MTg1OTQ0NH0.Z2FJgvja6KqXgJgXQHdJIhNon4xLxqVDmnS0fOWtnAQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function listTables() {
  console.log('🔍 Checking available tables in Supabase...');
  
  try {
    // Query to list all tables in the public schema
    const { data, error } = await supabase.rpc('list_tables');
    
    if (error) {
      console.error('❌ Failed to list tables:', error.message);
      
      // Try an alternative approach - query todos table which is often created by default
      console.log('\n🔄 Trying alternative approach - checking if todos table exists...');
      const todosCheck = await supabase.from('todos').select('count').limit(1);
      
      if (todosCheck.error) {
        if (todosCheck.error.message.includes('does not exist')) {
          console.log('❌ todos table does not exist');
        } else {
          console.log('❓ Different error with todos check:', todosCheck.error.message);
        }
      } else {
        console.log('✅ todos table exists!');
        console.log('This confirms database connection is working');
      }
      
    } else {
      console.log('✅ Successfully retrieved table list!');
      console.log('Tables in your database:');
      console.log(data);
    }
    
    // Check storage buckets as another connection test
    console.log('\n🔄 Testing storage service...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Storage service test failed:', bucketsError.message);
    } else {
      console.log('✅ Storage service is accessible');
      console.log(`Number of storage buckets: ${buckets.length}`);
      if (buckets.length > 0) {
        console.log('Bucket names:', buckets.map(b => b.name).join(', '));
      }
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

listTables(); 