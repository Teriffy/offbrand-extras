const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
};

// Validate on startup (server-side only)
if (typeof window === "undefined") {
  const missing = Object.entries(requiredEnvVars)
    .filter(([_key, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.warn(
      `Missing environment variables: ${missing.join(", ")}. Some features may not work.`
    );
  }
}

export const env = {
  supabase: {
    url: requiredEnvVars.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: requiredEnvVars.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: requiredEnvVars.SUPABASE_SERVICE_ROLE_KEY!,
  },
  stripe: {
    publishableKey: requiredEnvVars.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    secretKey: requiredEnvVars.STRIPE_SECRET_KEY!,
    webhookSecret: requiredEnvVars.STRIPE_WEBHOOK_SECRET!,
  },
  resend: {
    apiKey: requiredEnvVars.RESEND_API_KEY!,
  },
  baseUrl: requiredEnvVars.NEXT_PUBLIC_BASE_URL!,
};
