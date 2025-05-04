#!/usr/bin/env node

/**
 * Supabase Connection Test
 * 
 * This script tests the connection to Supabase by:
 * 1. Attempting to connect to the Supabase client
 * 2. Querying the test_items table
 * 3. Testing insert capability
 * 4. Testing server-side API functionality
 * 
 * Usage: 
 *   npm run test:supabase
 *   OR
 *   node test_connection.js
 */

import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import https from 'https';

// Constants and configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Supabase credentials
const supabaseUrl = 'https://yqoigziaqznsenpxkkwx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlxb2lnemlhcXpuc2VucHhra3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyODM0NDQsImV4cCI6MjA2MTg1OTQ0NH0.Z2FJgvja6KqXgJgXQHdJIhNon4xLxqVDmnS0fOWtnAQ';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions
const log = {
  info: (message) => console.log(`\x1b[36mINFO:\x1b[0m ${message}`),
  success: (message) => console.log(`\x1b[32mSUCCESS:\x1b[0m ${message}`),
  error: (message) => console.log(`\x1b[31mERROR:\x1b[0m ${message}`),
  warn: (message) => console.log(`\x1b[33mWARNING:\x1b[0m ${message}`),
  json: (label, data) => console.log(`\x1b[33m${label}:\x1b[0m`, JSON.stringify(data, null, 2))
};

// Test functions
async function testTableQuery() {
  log.info('Testing query on test_items table...');
  try {
    const { data, error } = await supabase
      .from('test_items')
      .select('*')
      .limit(5);
    
    if (error) throw error;
    
    log.success(`Successfully queried test_items table. Found ${data.length} items.`);
    log.json('Sample data', data);
    return true;
  } catch (err) {
    log.error(`Query test failed: ${err.message || 'Unknown error'}`);
    return false;
  }
}

async function testInsert() {
  log.info('Testing insert capability...');
  try {
    // Create a test item with timestamp to avoid duplicates
    const testItem = {
      name: `Test item ${new Date().toISOString()}`,
      description: 'This is a test item created by connection test script'
    };
    
    const { data, error } = await supabase
      .from('test_items')
      .insert(testItem)
      .select();
    
    if (error) throw error;
    
    log.success('Successfully inserted test item:');
    log.json('Inserted item', data);
    return true;
  } catch (err) {
    log.error(`Insert test failed: ${err.message || 'Unknown error'}`);
    return false;
  }
}

async function testServerAPI() {
  log.info('Testing Supabase REST API access...');
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'yqoigziaqznsenpxkkwx.supabase.co',
      port: 443,
      path: '/rest/v1/test_items?limit=1',
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          log.success('Successfully accessed Supabase REST API');
          try {
            const parsedData = JSON.parse(data);
            log.json('API response', parsedData);
            resolve(true);
          } catch (e) {
            log.error(`Error parsing API response: ${e.message}`);
            resolve(false);
          }
        } else {
          log.error(`API request failed with status code: ${res.statusCode}`);
          log.error(`Response: ${data}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (e) => {
      log.error(`API request error: ${e.message}`);
      resolve(false);
    });
    
    req.end();
  });
}

async function testTableSchema() {
  log.info('Testing table schema...');
  try {
    // Using a system table to get column information
    const { data, error } = await supabase
      .from('test_items')
      .select('id, name, description, created_at')
      .limit(1);
    
    if (error) throw error;
    
    // Get column names from the first row
    const item = data[0] || {};
    const columns = Object.keys(item);
    
    log.success(`Schema test successful. Table has columns: ${columns.join(', ')}`);
    return true;
  } catch (err) {
    log.error(`Schema test failed: ${err.message || 'Unknown error'}`);
    return false;
  }
}

// Main function to run all tests
async function runTests() {
  log.info('Starting Supabase connection tests...');
  log.info(`URL: ${supabaseUrl}`);
  
  const results = {
    query: false,
    insert: false,
    restAPI: false,
    schema: false
  };
  
  try {
    // Run the tests
    results.query = await testTableQuery();
    results.insert = await testInsert();
    results.restAPI = await testServerAPI();
    results.schema = await testTableSchema();
    
    // Summary
    log.info('\n==== Test Summary ====');
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(result => result).length;
    
    console.log(`Table Query: ${results.query ? '✅' : '❌'}`);
    console.log(`Data Insert: ${results.insert ? '✅' : '❌'}`);
    console.log(`REST API: ${results.restAPI ? '✅' : '❌'}`);
    console.log(`Schema Check: ${results.schema ? '✅' : '❌'}`);
    console.log(`\nPassed ${passedTests}/${totalTests} tests`);
    
    // Deployment readiness check
    checkDeploymentReadiness();
    
    if (passedTests === totalTests) {
      log.success('All tests passed! Supabase connection is working correctly.');
    } else if (passedTests > 0) {
      log.success('Some tests passed, but not all.');
    } else {
      log.error('Connection test failed. Please check your credentials and network connection.');
    }
  } catch (error) {
    log.error(`Unexpected error: ${error.message}`);
    console.error(error);
  }
}

function checkDeploymentReadiness() {
  log.info('\n==== Deployment Readiness Check ====');
  
  // Check if all required configuration is available
  if (!supabaseUrl || !supabaseAnonKey) {
    log.error('Missing Supabase credentials. These must be set before deployment.');
  } else {
    log.success('Supabase credentials are configured.');
  }
  
  // Check for hardcoded credentials (this is just a warning in this context)
  log.warn('Credentials are currently hardcoded in the test script.');
  log.info('For production, use environment variables:');
  log.info('  SUPABASE_URL=https://your-project.supabase.co');
  log.info('  SUPABASE_ANON_KEY=your-anon-key');
  
  // Check for proper database table
  log.info('Make sure your Supabase database has the required tables:');
  log.info('  - test_items (id, name, description, created_at)');
  
  // Vercel deployment tips
  log.info('\nFor Vercel deployment:');
  log.info('1. Add environment variables in the Vercel project settings');
  log.info('2. Enable Server Actions in your Vercel project settings');
  log.info('3. Make sure your Supabase project allows requests from your Vercel domain');
}

// Run the tests
runTests(); 