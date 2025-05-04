import { createClient } from '@supabase/supabase-js';

// User provided credentials
const SUPABASE_URL = 'https://yqoigziaqznsenpxkkwx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlxb2lnemlhcXpuc2VucHhra3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyODM0NDQsImV4cCI6MjA2MTg1OTQ0NH0.Z2FJgvja6KqXgJgXQHdJIhNon4xLxqVDmnS0fOWtnAQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkAuthConnection() {
  console.log('🔄 Testing Supabase authentication connection...');
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  
  try {
    // Test auth service
    console.log('\n🔐 Testing authentication service...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Auth service test failed:', error.message);
      return false;
    } else {
      console.log('✅ Auth service is working!');
      console.log('Session status:', data.session ? 'Active' : 'No active session');
      
      // Check auth config
      const { data: configData, error: configError } = await supabase.auth.getUser();
      
      if (configError) {
        console.log('❌ Error getting auth configuration:', configError.message);
      } else {
        console.log('✅ Auth configuration is accessible');
        console.log('User data:', configData.user ? 'Logged in' : 'Not logged in');
      }
      
      return true;
    }
  } catch (err) {
    console.error('❌ Unexpected error testing auth connection:', err);
    return false;
  }
}

// Check service status
async function checkServiceStatus() {
  console.log('\n🔍 Checking Supabase service health...');
  
  try {
    // Fetch Supabase status page (public endpoint)
    const response = await fetch('https://status.supabase.com/api/v2/status.json');
    
    if (!response.ok) {
      console.log('❌ Unable to fetch Supabase status');
      return;
    }
    
    const statusData = await response.json();
    console.log(`Status page indicates: ${statusData.status.description}`);
    console.log(`Status indicator: ${statusData.status.indicator}`);
    
    if (statusData.status.indicator !== 'none') {
      console.log('⚠️ Supabase might be experiencing issues. Check https://status.supabase.com/');
    } else {
      console.log('✅ Supabase services appear to be operating normally');
    }
  } catch (err) {
    console.log('❌ Error checking service status:', err.message);
  }
}

// Run tests
async function runTests() {
  const authConnected = await checkAuthConnection();
  await checkServiceStatus();
  
  console.log('\n✅ Connection testing complete!');
  console.log(`Overall connection status: ${authConnected ? 'CONNECTED' : 'CONNECTION ISSUES'}`);
  
  if (authConnected) {
    console.log('\n📝 Next steps:');
    console.log('1. Create the test_items table in Supabase SQL Editor using create-test-table.sql');
    console.log('2. Run test-table-connection.js to verify table functionality');
    console.log('3. Open the frontend test page at http://localhost:5173/supabase-test/');
  }
}

runTests(); 