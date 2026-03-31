import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

// Server-side client using service role key (for API routes)
export const createServerClient = () => {
  return createClient(env.supabase.url, env.supabase.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
