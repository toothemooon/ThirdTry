import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (key) => event.cookies.get(key),
        set: (key, value, options) => {
          // Ensure path is always set
          const cookieOptions = {
            ...options,
            path: options?.path ?? '/'
          };
          event.cookies.set(key, value, cookieOptions);
        },
        remove: (key, options) => {
          // Ensure path is always set
          const cookieOptions = {
            ...options,
            path: options?.path ?? '/'
          };
          event.cookies.delete(key, cookieOptions);
        },
      },
    }
  );

  /**
   * Get session from Supabase
   */
  event.locals.getSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();
    return session;
  };

  /**
   * Check if user is admin (for protected routes)
   */
  event.locals.isAdmin = async () => {
    const session = await event.locals.getSession();
    if (!session) return false;
    
    const { data } = await event.locals.supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .single();
    
    return data?.is_admin || false;
  };

  return resolve(event);
};
