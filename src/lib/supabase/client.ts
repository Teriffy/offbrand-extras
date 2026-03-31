"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

export const createClient = () => {
  return createBrowserClient(env.supabase.url, env.supabase.anonKey);
};
