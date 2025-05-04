import { json } from '@sveltejs/kit';
import { supabase } from '$lib/server/db/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('test_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      return json({ error: error.message }, { status: 400 });
    }
    
    return json({ items: data });
  } catch (err: any) {
    return json({ error: err.message }, { status: 500 });
  }
}

export async function POST({ request }) {
  try {
    const body = await request.json();
    
    if (!body.name) {
      return json({ error: 'Name is required' }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('test_items')
      .insert(body)
      .select();
    
    if (error) {
      return json({ error: error.message }, { status: 400 });
    }
    
    return json({ item: data[0] }, { status: 201 });
  } catch (err: any) {
    return json({ error: err.message }, { status: 500 });
  }
} 