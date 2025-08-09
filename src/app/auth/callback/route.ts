import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient(); // ✅ added await

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const response = NextResponse.redirect(new URL("/properties", request.url));
  response.headers.append(
    "Set-Cookie",
    `sb:token=${session.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`
  );

  return response;
}
