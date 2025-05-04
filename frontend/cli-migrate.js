import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';

// Convert exec to promise-based
const execPromise = util.promisify(exec);

// Constants
const SUPABASE_URL = 'https://yqoigziaqznsenpxkkwx.supabase.co';
const SQL_FILE = path.join(process.cwd(), 'create-test-table.sql');
const MIGRATIONS_DIR = path.join(process.cwd(), 'migrations');

// Ensure migrations directory exists
if (!fs.existsSync(MIGRATIONS_DIR)) {
  fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
}

// Generate a timestamp for the migration
const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
const migrationFile = path.join(MIGRATIONS_DIR, `${timestamp}_create_test_table.sql`);

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

// Function to copy the SQL file to migrations directory
function copySqlToMigrations() {
  try {
    if (!fs.existsSync(SQL_FILE)) {
      console.error(`❌ SQL file not found: ${SQL_FILE}`);
      return false;
    }
    
    const sqlContent = fs.readFileSync(SQL_FILE, 'utf8');
    fs.writeFileSync(migrationFile, sqlContent);
    console.log(`✅ Created migration file: ${migrationFile}`);
    return true;
  } catch (error) {
    console.error(`❌ Error copying SQL file: ${error.message}`);
    return false;
  }
}

// Main function to run migrations
async function migrateWithCLI() {
  console.log('🔄 Supabase CLI Migration Helper');
  console.log('--------------------------------');
  
  // 1. Check if the Supabase CLI is initialized in the project
  const hasSupabaseDir = fs.existsSync(path.join(process.cwd(), 'supabase'));
  
  if (!hasSupabaseDir) {
    console.log('📁 Initializing Supabase project...');
    await runCommand('supabase init');
  }

  // 2. Copy the SQL file to migrations
  if (!copySqlToMigrations()) {
    return;
  }
  
  // 3. Create a new migration using Supabase CLI
  console.log('\n🔄 Applying migration via CLI...');
  
  // Ask for confirmation
  console.log('\n⚠️ This will run the SQL directly on your Supabase project.');
  console.log(`⚠️ If you want to preview the SQL first, check: ${migrationFile}`);
  
  console.log('\n📋 SQL to be applied:');
  console.log('-------------------');
  console.log(fs.readFileSync(migrationFile, 'utf8'));
  console.log('-------------------');
  
  // Show CLI commands for reference
  console.log('\n📝 To apply with Supabase CLI, run these commands:');
  console.log('1. Login to Supabase (if needed): supabase login');
  console.log(`2. Link your project: supabase link --project-ref YOUR_PROJECT_REF`);
  console.log(`3. Apply migration: supabase db push`);
  
  console.log('\n👉 Would you like to:');
  console.log('1. Run the migration commands automatically');
  console.log('2. Run the commands manually');
  console.log('\nTo run automatically, execute: node cli-migrate.js --run');
  
  // Check if --run flag is provided
  if (process.argv.includes('--run')) {
    console.log('\n🚀 Running migration automatically...');
    
    // Prompt for project ref
    console.log('\n⚠️ Please provide your Supabase project reference.');
    console.log('You can find this in your Supabase dashboard URL: https://app.supabase.com/project/YOUR_PROJECT_REF');
    
    // Get project ref from URL
    const urlParts = SUPABASE_URL.split('https://')[1].split('.')[0];
    console.log(`ℹ️ Based on your URL, your project ref might be: ${urlParts}`);
    
    // Link project
    console.log('\n🔄 Linking Supabase project...');
    await runCommand(`supabase link --project-ref ${urlParts}`);
    
    // Push migration
    console.log('\n🔄 Pushing migration to database...');
    await runCommand('supabase db push');
    
    console.log('\n✅ Migration process completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Test the connection: node test-table-connection.js');
    console.log('2. Start your development server: npm run dev');
    console.log('3. Access the test page at: http://localhost:5173/supabase-test/');
  }
}

// Run the migration process
migrateWithCLI(); 