import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// User provided credentials
const SUPABASE_URL = 'https://yqoigziaqznsenpxkkwx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlxb2lnemlhcXpuc2VucHhra3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyODM0NDQsImV4cCI6MjA2MTg1OTQ0NH0.Z2FJgvja6KqXgJgXQHdJIhNon4xLxqVDmnS0fOWtnAQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// First, check if SQL file exists
const sqlFile = path.join(process.cwd(), 'create-test-table.sql');

// Function to read SQL file content
function readSqlFile() {
  try {
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    return sqlContent;
  } catch (error) {
    console.error(`❌ Error reading SQL file: ${error.message}`);
    process.exit(1);
  }
}

// Function to format SQL into blocks
function formatSqlBlocks(sql) {
  const formatted = sql
    .split(';')
    .map(block => block.trim())
    .filter(block => block.length > 0)
    .map(block => `${block};`);
  
  return formatted;
}

// Check if a table exists
async function checkTableExists(tableName) {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('count')
      .limit(1);
    
    return !error || !error.message.includes('does not exist');
  } catch (error) {
    return false;
  }
}

// Main function to process migration
async function processMigration() {
  console.log('🔄 SQL Migration Helper for Supabase');
  console.log(`\nChecking SQL file: ${sqlFile}\n`);
  
  if (!fs.existsSync(sqlFile)) {
    console.error(`❌ SQL file not found: ${sqlFile}`);
    return;
  }
  
  // Read SQL file
  const sqlContent = readSqlFile();
  console.log('✅ SQL file read successfully');
  
  // Format SQL into blocks
  const sqlBlocks = formatSqlBlocks(sqlContent);
  console.log(`📊 Found ${sqlBlocks.length} SQL statements\n`);
  
  // Check if test_items table already exists
  const tableExists = await checkTableExists('test_items');
  
  if (tableExists) {
    console.log('⚠️ The test_items table already exists in your Supabase database');
    
    // Ask if they want to drop and recreate
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    rl.question('Do you want to drop and recreate the test_items table? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        console.log('\n✨ Migration Information:');
        console.log('To drop and recreate the table, copy and run this SQL in the Supabase SQL Editor:');
        console.log('\n----------- COPY BELOW THIS LINE -----------\n');
        console.log('DROP TABLE IF EXISTS test_items CASCADE;');
        console.log('\n');
        console.log(sqlContent);
        console.log('\n----------- COPY ABOVE THIS LINE -----------\n');
      } else {
        console.log('\n✨ Migration skipped. Table already exists.');
      }
      rl.close();
    });
  } else {
    console.log('✅ The test_items table does not exist yet. Ready to create it.');
    console.log('\n✨ Migration Information:');
    console.log('To create the table, copy and run this SQL in the Supabase SQL Editor:');
    console.log('\n----------- COPY BELOW THIS LINE -----------\n');
    console.log(sqlContent);
    console.log('\n----------- COPY ABOVE THIS LINE -----------\n');
    console.log('After running the SQL, you can test the connection with:');
    console.log('node test-table-connection.js');
  }
}

// Run the migration process
processMigration(); 