import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  console.log("🔹 OAuth callback hit");
  console.log("🔹 Received code:", code);

  if (!code) {
    console.log("❌ No code in callback — redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("❌ OAuth error from Supabase:", error.message);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log("✅ Session exchange successful — redirecting to /properties");
  return NextResponse.redirect(new URL("/properties", request.url));
}
