import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
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

  await supabase.auth.getUser();

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
