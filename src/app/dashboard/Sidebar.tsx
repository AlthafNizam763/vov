"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, FileEdit, LogOut } from "lucide-react";

const LINKS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Site Content", href: "/dashboard/sit-update", icon: FileEdit },
  { name: "Users", href: "/dashboard/user-manager", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname?.startsWith(href);

  return (
    <aside className="sticky top-0 h-screen w-[76px] lg:w-64 shrink-0 flex flex-col dash-card !rounded-none border-t-0 border-l-0 border-b-0 z-30">
      {/* Brand */}
      <Link
        href="/dashboard"
        className="flex items-center gap-3 px-4 lg:px-6 h-16 shrink-0"
      >
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden shrink-0">
          <Image
            src="/images/vov-logo.png"
            alt="VoV"
            width={40}
            height={40}
            className="h-7 w-auto"
          />
        </span>
        <span className="hidden lg:flex flex-col leading-tight">
          <span className="font-display font-bold text-ink text-sm">
            Voice of the
          </span>
          <span className="font-display font-bold text-gradient text-sm -mt-0.5">
            Voiceless
          </span>
        </span>
      </Link>

      <div className="hidden lg:block px-6 mt-4 mb-2 text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-slate-400">
        Menu
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1.5 px-3 lg:px-4 mt-2 lg:mt-0">
        {LINKS.map(({ name, href, icon: Icon }) => (
          <Link
            key={name}
            href={href}
            title={name}
            className={`nav-link justify-center lg:justify-start ${
              isActive(href) ? "nav-link-active" : ""
            }`}
          >
            <Icon size={20} strokeWidth={2} className="shrink-0" />
            <span className="hidden lg:inline">{name}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 lg:p-4 border-t border-black/5">
        <Link
          href="/LoginPage"
          title="Logout"
          className="nav-link justify-center lg:justify-start text-red-500 hover:!bg-red-50 hover:!text-red-600"
        >
          <LogOut size={20} strokeWidth={2} className="shrink-0" />
          <span className="hidden lg:inline">Logout</span>
        </Link>
      </div>
    </aside>
  );
}
