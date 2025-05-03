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
    const confirmPassword = formData.get('confirmPassword')?.toString();
    const fullName = formData.get('fullName')?.toString() || '';
    const username = formData.get('username')?.toString() || '';

    if (!email || !password || !confirmPassword) {
      return {
        error: 'Please fill in all required fields',
        email,
        username,
        fullName
      };
    }

    if (password !== confirmPassword) {
      return {
        error: 'Passwords do not match',
        email,
        username,
        fullName
      };
    }

    // Sign up the user
    const { error: signUpError, data } = await locals.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username
        }
      }
    });

    if (signUpError) {
      return {
        error: signUpError.message,
        email,
        username,
        fullName
      };
    }

    // Create profile in public.profiles table
    if (data.user) {
      const { error: profileError } = await locals.supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          full_name: fullName,
          username,
          is_admin: false // Default user is not admin
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // We could handle this error, but the auth user is already created
      }
    }

    const redirectTo = url.searchParams.get('redirectTo') || '/';
    throw redirect(303, redirectTo);
  }
};
