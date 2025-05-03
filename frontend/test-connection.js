// Test script for Supabase connection
import { createClient } from '@supabase/supabase-js';

// User provided credentials
const SUPABASE_URL = 'https://yqoigziaqznsenpxkkwx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlxb2lnemlhcXpuc2VucHhra3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyODM0NDQsImV4cCI6MjA2MTg1OTQ0NH0.Z2FJgvja6KqXgJgXQHdJIhNon4xLxqVDmnS0fOWtnAQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  console.log('🔄 Testing connection to Supabase...');
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Anon Key: ${SUPABASE_ANON_KEY.substring(0, 15)}...`);
  
  try {
    // Test a simple query to check connection
    console.log('\n🔄 Testing database access...');
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:');
      console.error(`Error: ${error.message}`);
      
      // Provide guidance based on error message
      if (error.message.includes('relation "profiles" does not exist')) {
        console.log('The "profiles" table does not exist. Try another table or create this one.');
      }
      
    } else {
      console.log('✅ Successfully connected to Supabase database!');
      console.log('Data received:', data);
    }
    
    // Test authentication service
    console.log('\n🔄 Testing authentication service...');
    const authResponse = await supabase.auth.getSession();
    
    if (authResponse.error) {
      console.error('❌ Auth service test failed:');
      console.error(`Error: ${authResponse.error.message}`);
    } else {
      console.log('✅ Auth service is accessible');
      console.log(`Current session: ${authResponse.data.session ? 'Active' : 'None'}`);
    }
    
  } catch (err) {
    console.error('❌ Unexpected error testing connection:');
    console.error(err);
  }
}

testConnection(); 