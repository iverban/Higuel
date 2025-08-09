import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Explicit Supabase type imports (optional but keeps it typed)
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for server-side usage in Next.js App Router.
 * Handles cookies using the latest async cookies() API.
 */
export async function createClient(): Promise<SupabaseClient> {
  // ✅ Await cookies() to get ReadonlyRequestCookies
  const cookieStore = await cookies();

  // ✅ Return the Supabase client
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          // Setting cookies server-side in App Router can be handled with `Response` headers,
          // but we keep this placeholder to satisfy the interface.
          // If you need to set cookies here, consider doing it in a route handler instead.
        },
        remove(name: string, options: Record<string, unknown>) {
          // Similar to set(), cookie removal should happen via response headers in Next.js.
        },
      },
    }
  );
}
