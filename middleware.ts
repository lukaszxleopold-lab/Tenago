import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Tworzymy klienta Supabase dla middleware
  const supabase = createMiddlewareClient({ req, res });

  // Pobieramy aktualną sesję użytkownika
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  if (isOnDashboard && !session) {
    // 🔒 Jeśli ktoś próbuje wejść na /dashboard bez logowania → przekieruj na /login
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  // jeśli użytkownik ma sesję → wpuszczamy go normalnie
  return res;
}

// ✅ Middleware działa tylko na /dashboard i podstronach dashboardu
export const config = {
  matcher: ["/dashboard/:path*"],
};
