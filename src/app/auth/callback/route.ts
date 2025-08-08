import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const response = NextResponse.redirect(`${origin}/properties`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.headers.get('cookie') ?? '';
        },
        set(name, value, options) {
          response.headers.append(
            'Set-Cookie',
            `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax`
          );
        },
        remove(name) {
          response.headers.append(
            'Set-Cookie',
            `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
          );
        },
      },
    }
  );

  // Exchange the code for a session
  await supabase.auth.exchangeCodeForSession(code);

  return response;
}
