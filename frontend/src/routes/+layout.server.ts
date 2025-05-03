import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  const session = await locals.getSession();
  let isAdmin = false;
  
  if (session) {
    isAdmin = await locals.isAdmin();
  }
  
  return {
    session,
    isAdmin
  };
};
