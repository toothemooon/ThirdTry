import { supabase } from '$lib/supabaseClient';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  try {
    // Using the correct table name 'test_items'
    const { data, error } = await supabase
      .from('test_items')
      .select('*')
      .limit(10);
    
    if (error) {
      console.error('Error fetching data from server:', error);
      return {
        serverData: null,
        serverError: error.message
      };
    }
    
    return {
      serverData: data,
      serverError: null
    };
  } catch (err: any) {
    console.error('Unexpected error in server load function:', err);
    return {
      serverData: null,
      serverError: err.message || 'An unexpected error occurred'
    };
  }
}; 