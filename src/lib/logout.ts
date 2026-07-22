/**
 * Shared logout plumbing.
 *
 * The session cookie is httpOnly, so signing out has to go through the API.
 * Everything here runs in the browser.
 */

/** Where a signed-out user lands. */
export const LOGIN_PATH = "/LoginPage";

/** localStorage key other tabs watch to notice a logout elsewhere. */
export const LOGOUT_BROADCAST_KEY = "vov:logout";

/** Tell every other open tab that the session just ended. */
export function broadcastLogout() {
  try {
    // The `storage` event only fires in *other* tabs, which is exactly what we
    // want. The value just has to change, so a timestamp is enough.
    localStorage.setItem(LOGOUT_BROADCAST_KEY, String(Date.now()));
  } catch {
    /* storage unavailable (private mode / blocked) — not fatal */
  }
}

/**
 * Clear the session and hard-navigate to the login page.
 *
 * `location.replace` rather than `href` on purpose: it drops the dashboard page
 * we're leaving from the history stack, so the back button can't even try to
 * return to it. It also forces a full document load, which throws away the
 * Next.js client router cache and any authenticated UI still in memory.
 */
export async function performLogout() {
  try {
    await fetch("/api/users/logout", { method: "POST", cache: "no-store" });
  } catch {
    /* ignore network failure — still sign out locally */
  }
  broadcastLogout();
  window.location.replace(LOGIN_PATH);
}
