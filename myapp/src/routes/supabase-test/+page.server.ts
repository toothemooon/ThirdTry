import { supabase } from '$lib/supabaseClient';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  try {
    // Using the correct table name 'test_items'
    const { data, error } = await supabase
      .from('test_items')
      .select('*')
      .order('id', { ascending: false }) // Show newest items first
      .limit(20); // Increased limit to show more items
    
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

// Server actions for form handling
export const actions: Actions = {
  addItem: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString() || 'No description provided';
    
    if (!name || name.trim() === '') {
      return fail(400, {
        success: false,
        error: 'Name is required',
        name,
        description,
      });
    }
    
    try {
      const { data, error } = await supabase
        .from('test_items')
        .insert([{ name, description }])
        .select();
      
      if (error) {
        console.error('Error inserting data:', error);
        return fail(500, {
          success: false,
          error: error.message,
          name,
          description,
        });
      }
      
      return {
        success: true,
        item: data[0],
      };
    } catch (err: any) {
      console.error('Unexpected error adding item:', err);
      return fail(500, {
        success: false,
        error: err.message || 'An unexpected error occurred',
        name,
        description,
      });
    }
  }
}; 