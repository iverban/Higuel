import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/properties", req.url));
  const isProd = process.env.NODE_ENV === "production";

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          res.cookies.set({
            name,
            value,
            ...options,
            domain: isProd ? ".higuel.vercel.app" : undefined,
            secure: isProd,
          });
        },
        remove(name: string, options: Record<string, unknown>) {
          res.cookies.set({
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

  const code = req.nextUrl.searchParams.get("code");

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  return res;
}
