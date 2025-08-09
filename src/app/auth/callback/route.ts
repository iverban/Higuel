import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Auth callback route — handles setting the Supabase auth session cookies.
 */
export async function GET(request: Request) {
  const supabase = await createClient
  // Retrieve the current session from Supabase
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Create a new response and set the auth cookie in headers
  const response = NextResponse.redirect(new URL("/properties", request.url));
  response.headers.append(
    "Set-Cookie",
    `sb:token=${session.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`
  );

  return response;
}
