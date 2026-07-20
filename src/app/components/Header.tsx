"use client";

import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { LogIn } from "lucide-react";
import DonateDialog from "./DonateDialog";

const NAV_LINKS = [
  { href: "#about", label: "Who we are" },
  { href: "#campaigns", label: "Our Campaign" },
  { href: "#news", label: "News" },
  { href: "#contact", label: "Contact Us" },
];

/* ------------------ ✅ Main Component ------------------ */
export default function Header() {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);

  /* ------------------ Hide Navbar on Scroll ------------------ */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      setScrolled(currentScrollY > 12);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const openDonate = () => {
    setMobileMenuOpen(false);
    setDonateOpen(true);
  };

  /* ------------------ JSX ------------------ */
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          showNav ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
        }`}
      >
        {/* ✅ Top Bar */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-700 to-accent-700 text-white/90 text-xs sm:text-sm">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center py-2 gap-2 sm:gap-0">
            {/* 📞 Contact info */}
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 text-center sm:text-left">
              <a
                href="tel:+918075873624"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <IoCall className="text-sm text-accent-300" />
                <span className="text-[13px] sm:text-[14px]">+91 80758 73624</span>
              </a>

              <span className="hidden sm:inline text-white/30">|</span>

              <a
                href="mailto:info.voiceofthevoiceless1@gmail.com"
                className="flex items-center gap-1.5 hover:text-white transition-colors break-all"
              >
                <MdEmail className="text-sm text-accent-300" />
                <span className="text-[13px] sm:text-[14px]">
                  info.voiceofthevoiceless1@gmail.com
                </span>
              </a>
            </div>

            {/* 🌐 Social icons & Dashboard login */}
            <div className="flex items-center gap-3 mt-1 sm:mt-0">
              {[
                { href: "https://wa.me/7034426975", label: "WhatsApp", Icon: FaWhatsapp },
                {
                  href: "https://www.instagram.com/voice__of_the__voiceless?igsh=c2pxbjI5YnpmY3dm",
                  label: "Instagram",
                  Icon: FaInstagram,
                },
                {
                  href: "https://www.facebook.com/share/19wxCiJRJK/?mibextid=wwXIfr",
                  label: "Facebook",
                  Icon: FaFacebookF,
                },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid place-items-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/25 transition-colors"
                >
                  <Icon className="text-[13px]" />
                </a>
              ))}

              <span className="w-px h-4 bg-white/25" aria-hidden="true" />

              {/* Support Dashboard Login */}
              <Link
                href="/LoginPage"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold text-white hover:bg-white/25 hover:border-white/50 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* ✅ Main Nav */}
        <nav className={`glass-nav w-full transition-all duration-300 ${scrolled ? "py-0" : ""}`}>
          <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden transition-transform group-hover:scale-105">
                <Image
                  src="/images/vov-logo.png"
                  alt="Voice of the Voiceless logo"
                  width={40}
                  height={40}
                  className="h-7 w-auto"
                />
              </span>
              <span className="font-display font-bold text-[15px] sm:text-lg leading-tight text-ink">
                Voice of the <span className="text-gradient">Voiceless</span>
              </span>
            </Link>

            {/* Hamburger Menu (Mobile) */}
            <button
              className="md:hidden grid place-items-center w-10 h-10 rounded-xl text-brand-700 bg-white/70 ring-1 ring-black/5 shadow-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-700">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative py-1 transition-colors hover:text-brand-700 after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-0 after:rounded-full after:bg-gradient-to-r after:from-brand-600 after:to-accent-500 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* ✅ Donate Button */}
            <button
              onClick={openDonate}
              className="hidden md:inline-flex btn btn-primary text-sm px-5 py-2.5"
            >
              Donate Now
              <AiFillHeart className="text-white" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden glass-strong border-t border-black/5 px-4 pb-5 pt-3">
              <div className="flex flex-col">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3 text-slate-700 font-medium border-b border-black/5 hover:text-brand-700 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <Link
                  href="/LoginPage"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-3 text-slate-700 font-medium border-b border-black/5 hover:text-brand-700 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </div>
              <button onClick={openDonate} className="btn btn-primary w-full mt-4">
                Donate Now
                <AiFillHeart className="text-white" />
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* Spacer so content doesn't hide under fixed header */}
      <div style={{ height: "104px" }}></div>

      <DonateDialog open={donateOpen} onClose={() => setDonateOpen(false)} />
    </>
  );
}
