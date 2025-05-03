import { supabase } from '$lib/server/db/supabase';

/**
 * Utility function to check Supabase connection status
 * Can be imported in server-side code to verify connection
 */
export async function checkSupabaseConnection() {
  const healthCheck = {
    auth: false,
    storage: false,
    database: false,
    error: null
  };

  try {
    // Check auth service
    const { data: authData, error: authError } = await supabase.auth.getSession();
    healthCheck.auth = authError ? false : true;

    try {
      // Check storage service
      const { data: storageData, error: storageError } = await supabase.storage.listBuckets();
      healthCheck.storage = storageError ? false : true;
    } catch (error) {
      // Storage check error is non-critical
    }

    // We don't know which tables exist, so let's just check if we can connect to the database
    // This will report a table not found error, but the connection will succeed
    try {
      await supabase.from('connection_test').select('*').limit(1);
      healthCheck.database = true;
    } catch (error: any) {
      // If the error is relation doesn't exist, the DB connection is still working
      if (error.message && error.message.includes('does not exist')) {
        healthCheck.database = true;
      } else {
        healthCheck.database = false;
        healthCheck.error = error.message;
      }
    }

    return healthCheck;
  } catch (error: any) {
    healthCheck.error = error.message || 'Unknown error';
    return healthCheck;
  }
} 