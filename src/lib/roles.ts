/**
 * Role model + permission helpers (pure, no server-only imports so this is
 * safe to import from client components, route handlers, and middleware).
 *
 * Roles:
 *  - Administrator: full access (manage users + edit site content)
 *  - Editor:        edit site content; view users (cannot create/edit/delete users)
 *  - Member:        read-only (view everything, modify nothing)
 */
export type Role = "Administrator" | "Editor" | "Member";

export const ROLES: Role[] = ["Administrator", "Editor", "Member"];

/** Normalize any stored role value (incl. legacy "Admin") to a canonical Role. */
export function normalizeRole(role?: string | null): Role {
  const r = (role ?? "").trim().toLowerCase();
  if (r === "admin" || r === "administrator") return "Administrator";
  if (r === "editor") return "Editor";
  return "Member";
}

/** Can manage users (create / edit / delete). */
export function canManageUsers(role?: string | null): boolean {
  return normalizeRole(role) === "Administrator";
}

/** Can create / edit / delete site content (hero, campaigns, programs, team). */
export function canEditContent(role?: string | null): boolean {
  const n = normalizeRole(role);
  return n === "Administrator" || n === "Editor";
}

/** Tailwind gradient classes for the role avatar (Admin→red, Editor→blue, Member→green). */
export function roleAvatarClasses(role?: string | null): string {
  switch (normalizeRole(role)) {
    case "Administrator":
      return "from-red-500 to-red-600";
    case "Editor":
      return "from-blue-500 to-blue-600";
    default:
      return "from-green-500 to-green-600";
  }
}
