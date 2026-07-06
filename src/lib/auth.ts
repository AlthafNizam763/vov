import { SignJWT, jwtVerify, type JWTPayload } from "jose";

/**
 * Lightweight cookie-based session for the admin dashboard.
 * Uses `jose` (isomorphic — works in both the Node runtime and Edge middleware).
 */

export const SESSION_COOKIE = "vov_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours (seconds)

export interface SessionPayload extends JWTPayload {
  sub: string; // user id
  email: string;
  name?: string;
  role?: string;
}

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("❌ AUTH_SECRET is not set. Add it to your .env / .env.local");
  }
  return new TextEncoder().encode(secret);
}

/** Sign a session JWT for a logged-in user. */
export async function createSessionToken(user: {
  id: string;
  email: string;
  name?: string;
  role?: string;
}): Promise<string> {
  return new SignJWT({ email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecretKey());
}

/** Verify a session JWT. Returns the payload, or null if invalid/expired. */
export async function verifySessionToken(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

/** Cookie options shared by login (set) and logout (clear). */
export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
