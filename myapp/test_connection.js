#!/usr/bin/env node

/**
 * Supabase Connection Test
 * 
 * This script tests the connection to Supabase by:
 * 1. Attempting to connect to the Supabase client
 * 2. Querying the test_items table
 * 3. Testing insert capability
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

// Main function to run all tests
async function runTests() {
  log.info('Starting Supabase connection tests...');
  log.info(`URL: ${supabaseUrl}`);
  
  const results = {
    query: false,
    insert: false
  };
  
  try {
    // Run the tests
    results.query = await testTableQuery();
    results.insert = await testInsert();
    
    // Summary
    log.info('\n==== Test Summary ====');
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(result => result).length;
    
    console.log(`Table Query: ${results.query ? '✅' : '❌'}`);
    console.log(`Data Insert: ${results.insert ? '✅' : '❌'}`);
    console.log(`\nPassed ${passedTests}/${totalTests} tests`);
    
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

// Run the tests
runTests(); 