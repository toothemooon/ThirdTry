import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createBrowserClient } from '@supabase/ssr';
import { user, isAdmin } from '$lib/stores/auth';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, depends }) => {
  depends('supabase:auth');

  const supabase = createBrowserClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Update auth stores
  user.set(session?.user ?? null);
  isAdmin.set(data.isAdmin);

  // Listen for auth changes
  const { data: authListener } = supabase.auth.onAuthStateChange(
    (event, newSession) => {
      user.set(newSession?.user ?? null);
      
      // We need to refresh the page to get updated isAdmin status
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        isAdmin.set(event === 'SIGNED_OUT' ? false : data.isAdmin);
      }
    }
  );

  return {
    supabase,
    session: session,
    isAdmin: data.isAdmin
  };
};
