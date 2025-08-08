export const runtime = "nodejs";

import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const response = NextResponse.redirect(`${origin}/properties`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (cookieName) => request.headers.get("cookie") ?? "",
        set: (cookieName, value) => {
          response.headers.append(
            "Set-Cookie",
            `${cookieName}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax`
          );
        },
        remove: (cookieName) => {
          response.headers.append(
            "Set-Cookie",
            `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
          );
        },
      },
    }
  );

  try {
    await supabase.auth.exchangeCodeForSession(code);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("OAuth callback error:", err.message);
    }
  }

  return response;
}
