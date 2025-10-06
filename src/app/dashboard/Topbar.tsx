"use client";

import { Bell, Search } from "lucide-react";
import Image from "next/image";

export default function Topbar() {
  return (
    <header className="w-full h-16 bg-gray-50 flex items-center px-6 shadow-sm">
      {/* Left side: Logo + Title */}
      <div className="flex items-center gap-3">
        {/* Circle logo */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-black">
          <Image
            src="/images/vov-logo.png"
            alt="Fenco Logo"
            width={20}
            height={20}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-xs text-gray-500">Welcome Back</span>
          <span className="text-base font-semibold text-gray-900">Bondi</span>
        </div>
      </div>

      {/* Right side: icons + avatar */}
      <div className="ml-auto flex items-center gap-4">
        {/* Notification button */}
        {/* <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100">
          <Bell size={18} className="text-gray-700" />
        </button> */}

        {/* Search button */}
        {/* <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100">
          <Search size={18} className="text-gray-700" />
        </button> */}

        {/* Avatar */}
        <div className="w-9 h-9 flex items-center justify-center rounded-full bg-black text-white font-semibold">
          B
        </div>
      </div>
    </header>
  );
}
