import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE, type SessionPayload } from "./auth";
import { canEditContent, canManageUsers } from "./roles";

/**
 * Read + verify the current session from the request cookies.
 * For use in Server Components and Route Handlers (NOT middleware — middleware
 * reads cookies from the NextRequest directly).
 */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/**
 * Route-handler guard: returns a 403 response if the current user can't edit
 * site content (Editor/Administrator), otherwise null (proceed).
 */
export async function requireContentEditor(): Promise<NextResponse | null> {
  const session = await getSession();
  if (!canEditContent(session?.role)) {
    return NextResponse.json(
      { message: "Forbidden: editing content requires Editor or Administrator access." },
      { status: 403 }
    );
  }
  return null;
}

/** Route-handler guard: returns a 403 response unless the user is an Administrator. */
export async function requireAdministrator(): Promise<NextResponse | null> {
  const session = await getSession();
  if (!canManageUsers(session?.role)) {
    return NextResponse.json(
      { message: "Forbidden: Administrator access required." },
      { status: 403 }
    );
  }
  return null;
}
