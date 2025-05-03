import { checkSupabaseConnection } from '$lib/utils/supabase-check';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  const status = await checkSupabaseConnection();
  
  return json({
    success: true,
    timestamp: new Date().toISOString(),
    status
  });
}; 