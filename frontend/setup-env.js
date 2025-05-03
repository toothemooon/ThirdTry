import fs from 'fs';
import path from 'path';

// Create .env file with Supabase credentials for the build process
const envContent = `PUBLIC_SUPABASE_URL=https://yqoigziaqznsenpxkkwx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlxb2lnemlhcXpuc2VucHhra3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyODM0NDQsImV4cCI6MjA2MTg1OTQ0NH0.Z2FJgvja6KqXgJgXQHdJIhNon4xLxqVDmnS0fOWtnAQ`;

console.log('Setting up environment variables for build...');
fs.writeFileSync('.env', envContent, 'utf8');
console.log('Environment file created successfully'); 