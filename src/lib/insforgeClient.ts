import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { InsforgeEntityTables } from '../types/insforgeTypes';

export type InsforgeClient = SupabaseClient<InsforgeEntityTables>;

let cachedClient: InsforgeClient | null = null;

export function getInsforgeClient(): InsforgeClient {
  if (cachedClient) return cachedClient;

  const apiUrl = import.meta.env.VITE_INSFORGE_URL as string | undefined;
  const apiKey = import.meta.env.VITE_INSFORGE_ANON_KEY as string | undefined;

  if (!apiUrl || !apiKey) {
    throw new Error(
      'Missing Insforge configuration. Please set VITE_INSFORGE_URL and VITE_INSFORGE_ANON_KEY in your .env file.',
    );
  }

  cachedClient = createClient<InsforgeEntityTables>(apiUrl, apiKey);
  return cachedClient;
}

/** Returns null when env vars are missing. Use for public pages that fallback to static data. */
export function getInsforgeClientOptional(): InsforgeClient | null {
  try {
    return getInsforgeClient();
  } catch {
    return null;
  }
}

