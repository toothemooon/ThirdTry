import type { PageServerLoad } from './$types';
import { supabase } from '$lib/server/db/supabase';

export const load: PageServerLoad = async ({ locals }) => {
  try {
    // Test connection to Supabase
    const { data, error } = await supabase
      .from('test_items')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    // Return the connection status and data if available
    return {
      connectionStatus: {
        connected: !error,
        errorMessage: error?.message || null
      },
      initialItems: data || []
    };
  } catch (err: any) {
    // Return error information
    return {
      connectionStatus: {
        connected: false,
        errorMessage: err.message || 'Unknown error'
      },
      initialItems: []
    };
  }
}; 