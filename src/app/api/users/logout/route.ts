import { NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "../../../../lib/auth";

export const runtime = "nodejs";

// 🔒 Clear the session cookie (log out).
export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0)); // maxAge 0 → delete
  return res;
}
