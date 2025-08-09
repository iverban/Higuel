import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function createClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  const cookieDomain =
    process.env.NODE_ENV === "production" ? ".higuel.vercel.app" : undefined;

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          const newOptions = {
            ...options,
            ...(cookieDomain && { domain: cookieDomain }),
          };
          cookieStore.set({ name, value, ...newOptions });
        },
        remove(name: string, options: Record<string, unknown>) {
          const newOptions = {
            ...options,
            ...(cookieDomain && { domain: cookieDomain }),
          };
          cookieStore.set({ name, value: "", ...newOptions });
        },
      },
    }
  );
}
