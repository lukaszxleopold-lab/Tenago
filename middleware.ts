import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  console.log("🚀 Middleware działa! PATH:", req.nextUrl.pathname);

  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // pobieramy aktualną sesję użytkownika
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // 🔐 jeśli użytkownik NIEZALOGOWANY próbuje wejść na /dashboard lub /chat → przekieruj na /login
  const protectedPaths = ["/dashboard", "/chat"];

  const requiresAuth = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (requiresAuth && !session) {
    console.log("⚠️ Brak sesji — przekierowanie do /login");
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  // ✅ jeśli user zalogowany lub ścieżka publiczna → pozwól przejść
  return res;
}

// Middleware działa tylko na określonych trasach (dashboard i chat)
export const config = {
  matcher: ["/dashboard/:path*", "/chat/:path*"],
};
