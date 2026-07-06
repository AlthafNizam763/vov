import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "./lib/auth";

/**
 * Protects the admin dashboard. Any request to /dashboard(/*) without a valid
 * session cookie is redirected to the login page. Protected responses are also
 * marked no-store so the browser's back/forward cache can't reveal a cached
 * authenticated page after logout.
 */
export async function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    const loginUrl = new URL("/LoginPage", req.url);
    loginUrl.searchParams.set("redirect", req.nextUrl.pathname);
    const res = NextResponse.redirect(loginUrl);
    res.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
    return res;
  }

  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  return res;
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
