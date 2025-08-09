import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client for server-side usage in Next.js App Router.
 */
export async function createClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies(); // ✅ Await to resolve Promise

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(_name: string, _value: string, _options: Record<string, unknown>) {
          // No-op for server context
        },
        remove(_name: string, _options: Record<string, unknown>) {
          // No-op for server context
        },
      },
    }
  );
}
