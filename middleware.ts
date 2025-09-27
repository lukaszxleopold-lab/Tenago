import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  console.log("🚀 Middleware działa! PATH:", req.nextUrl.pathname);

  const res = NextResponse.next();

  // klient supabase dla middleware
  const supabase = createMiddlewareClient({ req, res });

  // sesja użytkownika
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // jeśli user nie jest zalogowany a wchodzi na dashboard → przekieruj do login
  if (pathname.startsWith("/dashboard") && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  // jeśli user zalogowany → pozwól wejść
  return res;
}

// middleware działa tylko dla dashboardu
export const config = {
  matcher: ["/dashboard/:path*"],
};


