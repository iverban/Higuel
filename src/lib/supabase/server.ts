import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function createClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies(); // async in your setup
  const isProd = process.env.NODE_ENV === "production";

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          cookieStore.set({
            name,
            value,
            ...options,
            domain: isProd ? ".higuel.vercel.app" : undefined,
            secure: isProd,
          });
        },
        remove(name: string, options: Record<string, unknown>) {
          cookieStore.set({
            name,
            value: "",
            ...options,
            domain: isProd ? ".higuel.vercel.app" : undefined,
            secure: isProd,
            maxAge: 0,
          });
        },
      },
    }
  );
}
