import { writable } from 'svelte/store';
import type { User } from '@supabase/supabase-js';

export const user = writable<User | null>(null);
export const isAdmin = writable<boolean>(false);
