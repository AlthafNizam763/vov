import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/session-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Cheap "am I still signed in?" check used by the dashboard's client-side
 * guard (bfcache restores, tab refocus, logout in another tab). Returns only a
 * boolean — no user data — and is never cached.
 */
export async function GET() {
  const session = await getSession();
  const res = NextResponse.json({ authenticated: !!session });
  res.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  return res;
}
