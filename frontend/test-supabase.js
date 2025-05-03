// Quick script to test Supabase connection
// Usage: 
// 1. npm install @supabase/supabase-js dotenv
// 2. node test-supabase.js

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Setup to handle ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config();

// Function to test basic connection to Supabase
async function testConnection() {
  console.log('🔄 Testing connection to Supabase...');
  
  // Get credentials from .env file
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;
  
  // Check if credentials are set and look valid
  console.log('🔍 Checking environment variables:');
  console.log(`  - PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Not set'}`);
  console.log(`  - PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey ? '✅ Set' : '❌ Not set'}`);
  
  if (!supabaseKey || supabaseKey === 'your-anon-key-from-api-settings') {
    console.error('❌ Error: Supabase anon key is not properly set in .env file');
    console.log('Please update your .env file with the actual anon key from your Supabase project');
    return;
  }
  
  if (!supabaseUrl) {
    console.error('❌ Error: Supabase URL is not set in .env file');
    return;
  }
  
  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test health endpoint
    console.log('🔄 Testing Supabase API access...');
    
    // Try to fetch a small amount of data to confirm connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection test failed:');
      console.error(`Error: ${error.message}`);
      
      if (error.message.includes('Service unavailable')) {
        console.log('The Supabase service might be down or the URL is incorrect.');
      } else if (error.message.includes('JWT')) {
        console.log('Your anon key appears to be invalid or malformed.');
      } else if (error.message.includes('permission denied')) {
        console.log('Your anon key does not have permission to access this table.');
        console.log('Check your Row Level Security (RLS) policies in Supabase.');
      } else if (error.message.includes('relation "profiles" does not exist')) {
        console.log('The "profiles" table does not exist. Try another table or create this one.');
      }
      
      return;
    }
    
    console.log('✅ Successfully connected to Supabase!');
    console.log('Data received:', data);
    
    // Test authentication service
    console.log('\n🔄 Testing Supabase Auth service...');
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