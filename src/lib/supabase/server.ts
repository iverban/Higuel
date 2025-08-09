import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function createClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          // Force cookie domain for production
          const newOptions = {
            ...options,
            domain: ".higuel.vercel.app", // ✅ matches your Vercel domain
          };
          // You could also add Secure/SameSite here if needed
          cookieStore.set({ name, value, ...newOptions });
        },
        remove(name: string, options: Record<string, unknown>) {
          // Force same domain when removing
          const newOptions = {
            ...options,
            domain: ".higuel.vercel.app",
          };
          cookieStore.set({ name, value: "", ...newOptions });
        },
      },
    }
  );
}
