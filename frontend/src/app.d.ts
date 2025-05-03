// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Session } from '@supabase/supabase-js';
import type { Database } from '$lib/server/db/types';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			getSession: () => Promise<Session | null>;
			isAdmin: () => Promise<boolean>;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Define environment variables
	namespace NodeJS {
		interface ProcessEnv {
			PUBLIC_SUPABASE_URL: string;
			PUBLIC_SUPABASE_ANON_KEY: string;
		}
	}
}

export {};
