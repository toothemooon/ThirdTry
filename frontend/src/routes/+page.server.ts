import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  // Redirect to the Supabase test page
  throw redirect(302, '/supabase-test');
}; 