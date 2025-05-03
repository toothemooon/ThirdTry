import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const session = await locals.getSession();
  
  // If the user is already logged in, redirect to the home page
  // or to the requested redirectTo URL
  if (session) {
    const redirectTo = url.searchParams.get('redirectTo') || '/';
    throw redirect(303, redirectTo);
  }
  
  return {
    redirectTo: url.searchParams.get('redirectTo') || '/'
  };
};

export const actions: Actions = {
  default: async ({ request, locals, url }) => {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!email || !password) {
      return {
        error: 'Please provide both email and password',
        email
      };
    }

    const { error } = await locals.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return {
        error: error.message,
        email
      };
    }

    const redirectTo = url.searchParams.get('redirectTo') || '/';
    throw redirect(303, redirectTo);
  }
};
