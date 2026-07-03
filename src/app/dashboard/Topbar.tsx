"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/sit-update": "Site Content",
  "/dashboard/user-manager": "User Manager",
  "/dashboard/user-manager/adduser": "Add User",
  "/dashboard/user-manager/edituser": "Edit User",
};

export default function Topbar() {
  const pathname = usePathname() || "/dashboard";
  const title =
    TITLES[pathname] ||
    (pathname.startsWith("/dashboard/user-manager") ? "User Manager" : "Dashboard");

  return (
    <header className="glass-nav sticky top-0 z-20 h-16 flex items-center gap-4 px-4 sm:px-6">
      {/* Page context */}
      <div className="flex flex-col leading-tight min-w-0">
        <span className="text-[0.7rem] font-semibold tracking-wide uppercase text-brand-600">
          Admin Panel
        </span>
        <h1 className="font-display font-bold text-ink text-lg truncate">{title}</h1>
      </div>

      {/* Search (desktop) */}
      <div className="ml-auto hidden md:flex items-center relative">
        <Search className="absolute left-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-56 lg:w-72 pl-9 pr-4 py-2 rounded-full bg-white/70 border border-black/5 text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:bg-white transition"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 md:ml-3">
        <button
          aria-label="Notifications"
          className="relative grid place-items-center w-10 h-10 rounded-full bg-white/70 ring-1 ring-black/5 text-slate-600 hover:text-brand-700 hover:bg-white transition"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-accent-500 ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-2.5 pl-1">
          <div className="hidden sm:flex flex-col items-end leading-tight">
            <span className="text-sm font-semibold text-ink">Member</span>
            <span className="text-xs text-slate-500">Administrator</span>
          </div>
          <div className="grid place-items-center w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white font-bold shadow-md">
            M
          </div>
        </div>
      </div>
    </header>
  );
}
