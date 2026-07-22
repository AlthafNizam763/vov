"use client";

import { useEffect } from "react";
import { LOGIN_PATH, LOGOUT_BROADCAST_KEY } from "../../lib/logout";

/**
 * Client-side backstop for the auth middleware.
 *
 * The middleware already blocks every /dashboard request without a valid
 * session, and marks responses no-store so the browser shouldn't reuse them.
 * But a few paths never hit the server at all:
 *
 *  - back/forward cache restores (Safari and Firefox are more willing to
 *    restore a no-store page than Chrome is),
 *  - a tab left open while the user signs out in another tab,
 *  - a tab left open long enough for the 8h session JWT to expire.
 *
 * In each case the dashboard would stay on screen with no request made. This
 * component watches for those moments and revalidates.
 */
export default function SessionGuard() {
  useEffect(() => {
    const goToLogin = () => {
      // replace() so the dead dashboard entry can't be reached by going back.
      window.location.replace(LOGIN_PATH);
    };

    /** Ask the server whether the cookie is still good; bounce if it isn't. */
    const verify = async () => {
      try {
        const res = await fetch("/api/users/session", { cache: "no-store" });
        if (!res.ok) return; // server hiccup — don't sign the user out over it
        const { authenticated } = await res.json();
        if (!authenticated) goToLogin();
      } catch {
        /* offline — leave the page alone rather than bouncing wrongly */
      }
    };

    // 1. bfcache restore. `persisted` means the page came back from memory
    //    without a network request, so nothing revalidated it.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };

    // 2. Tab brought back to the foreground — re-check before trusting the UI.
    const onVisibility = () => {
      if (document.visibilityState === "visible") verify();
    };

    // 3. Logged out in another tab.
    const onStorage = (e: StorageEvent) => {
      if (e.key === LOGOUT_BROADCAST_KEY) goToLogin();
    };

    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return null;
}
