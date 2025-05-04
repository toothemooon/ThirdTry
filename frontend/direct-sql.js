import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';
import readline from 'readline';

// Convert exec to promise-based
const execPromise = util.promisify(exec);

// Constants
const SUPABASE_URL = 'https://yqoigziaqznsenpxkkwx.supabase.co';
const SQL_FILE = path.join(process.cwd(), 'create-test-table.sql');

// Function to create readable interface
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

// Function to get user input
function question(rl, query) {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

// Function to run CLI commands
async function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    const { stdout, stderr } = await execPromise(command);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    return true;
  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    return false;
  }
}

// Main function to apply SQL
async function applySqlDirectly() {
  console.log('🔄 Direct SQL Application Helper');
  console.log('---------------------------------');

  // Check if SQL file exists
  if (!fs.existsSync(SQL_FILE)) {
    console.error(`❌ SQL file not found: ${SQL_FILE}`);
    return;
  }

  // Read SQL file
  const sqlContent = fs.readFileSync(SQL_FILE, 'utf8');
  
  // Show SQL to be applied
  console.log('\n📋 SQL to be applied:');
  console.log('-------------------');
  console.log(sqlContent);
  console.log('-------------------');
  
  // Create instruction file with CLI commands
  console.log('\n📝 Instructions:');
  console.log('1. Copy the commands below and run them one by one in your terminal');
  console.log('2. Follow any prompts or instructions from the Supabase CLI');
  
  // Extract the project ref from URL
  const projectRef = SUPABASE_URL.split('https://')[1].split('.')[0];
  
  console.log('\n🔑 Commands to run:');
  console.log(`-----------------`);
  console.log('# 1. Login to Supabase (only needed once)');
  console.log('supabase login');
  console.log('\n# 2. Link your project');
  console.log(`supabase link --project-ref ${projectRef}`);
  console.log('\n# 3. Apply SQL directly (copy the exact command including quotes)');
  console.log(`supabase db execute -f "${SQL_FILE}"`);
  console.log(`-----------------`);
  
  // Option to run automatically
  console.log('\n👉 Would you like to run these commands automatically? (y/n)');
  
  const rl = createInterface();
  const answer = await question(rl, 'Answer: ');
  
  if (answer.toLowerCase() === 'y') {
    console.log('\n🚀 Running commands automatically...');
    
    // Check if already logged in
    console.log('\n🔑 Checking login status...');
    await runCommand('supabase projects list');
    
    // Link project
    console.log('\n🔄 Linking Supabase project...');
    await runCommand(`supabase link --project-ref ${projectRef}`);
    
    // Apply SQL directly
    console.log('\n🔄 Applying SQL directly to database...');
    await runCommand(`supabase db execute -f "${SQL_FILE}"`);
    
    console.log('\n✅ SQL application process completed!');
  } else {
    console.log('\n🛑 Automatic execution cancelled. Please run the commands manually.');
  }
  
  rl.close();
  
  // Final instructions
  console.log('\n📝 Next steps:');
  console.log('1. Test the connection: node test-table-connection.js');
  console.log('2. Start your development server: cd frontend && npm run dev');
  console.log('3. Access the test page at: http://localhost:5173/supabase-test/');
}

// Run the SQL application process
applySqlDirectly(); 