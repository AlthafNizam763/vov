"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  User,
  CreditCard,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const mainLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { name: "Cards", href: "/dashboard/sit-update", icon: CreditCard },
    { name: "Users", href: "/dashboard/user-manager", icon: User },
    { name: "Logout", href: "/LoginPage", icon: LogOut }
  ];

  const renderLinks = (links: typeof mainLinks) =>
    links.map(({ name, href, icon: Icon }) => {
      const active = pathname === href;
      return (
        <Link
          key={name}
          href={href}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
            active
              ? "bg-white text-black"
              : "text-white hover:bg-gray-700"
          }`}
        >
          <Icon size={18} strokeWidth={2} />
        </Link>
      );
    });

  return (
    <aside className="h-screen w-20 flex flex-col items-center justify-between py-6 bg-gray-100">
      {/* Top pill with icons */}
      <div className="flex flex-col items-center gap-4 bg-gray-900 rounded-full py-4 px-2">
        {renderLinks(mainLinks)}
      </div>
    </aside>
  );
}
