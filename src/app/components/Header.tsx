"use client";

import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import React, { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { FaWhatsapp, FaInstagram, FaFacebookF } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";

/* ------------------ ✅ Type Definitions ------------------ */
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  theme: { color: string };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

/* ------------------ ✅ Main Component ------------------ */
export default function Header() {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ------------------ Hide Navbar on Scroll ------------------ */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  /* ------------------ Razorpay Payment ------------------ */
  const handleDonate = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 500 }), // ₹500 donation
      });

      const order: RazorpayOrder = await res.json();

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: order.amount,
        currency: order.currency,
        name: "Voice of the Voiceless",
        description: "Donation",
        order_id: order.id,
        handler: (response: RazorpayResponse) => {
          alert(`✅ Donation successful! ID: ${response.razorpay_payment_id}`);
        },
        theme: { color: "#58A3DC" },
      };

      const RazorpayConstructor = (window as unknown as {
        Razorpay: RazorpayConstructor;
      }).Razorpay;

      const razor = new RazorpayConstructor(options);
      razor.open();
    } catch (error) {
      console.error(error);
      alert("❌ Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ JSX ------------------ */
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          showNav ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
        }`}
      >
        {/* ✅ Top Bar */}
        <div className="bg-[#58A3DC] text-white text-xs sm:text-sm">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center py-2 gap-2 sm:gap-0">
            
            {/* 📞 Contact info */}
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 text-center sm:text-left">
              {/* Phone */}
              <a
                href="tel:+918075873624"
                className="flex items-center gap-1 hover:text-gray-200 transition-colors"
              >
                <IoCall className="text-base" />
                <span className="text-[13px] sm:text-[14px]">
                  +91 80758 73624
                </span>
              </a>

              <span className="hidden sm:inline">|</span>

              {/* Email */}
              <a
                href="mailto:info.voiceofthevoiceless1@gmail.com"
                className="flex items-center gap-1 hover:text-gray-200 transition-colors break-all"
              >
                <MdEmail className="text-base" />
                <span className="text-[13px] sm:text-[14px]">
                  info.voiceofthevoiceless1@gmail.com
                </span>
              </a>
            </div>

            {/* 🌐 Social icons */}
            <div className="flex space-x-4 mt-1 sm:mt-0">
              <a
                href="https://wa.me/7034426975"
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-200 transition-colors"
              >
                <FaWhatsapp className="text-lg sm:text-base" />
              </a>
              <a
                href="https://www.instagram.com/voice__of_the__voiceless?igsh=c2pxbjI5YnpmY3dm"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-200 transition-colors"
              >
                <FaInstagram className="text-lg sm:text-base" />
              </a>
              <a
                href="https://www.facebook.com/share/19wxCiJRJK/?mibextid=wwXIfr"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-200 transition-colors"
              >
                <FaFacebookF className="text-lg sm:text-base" />
              </a>
            </div>
          </div>
        </div>

        {/* ✅ Main Nav */}
        <nav className="bg-white shadow-sm w-full">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/vov-logo.png"
                alt="Voice of the Voiceless logo"
                width={40}
                height={40}
                className="h-8 w-auto"
              />
              <span className="text-gray-900 font-semibold text-lg">
                Voice of the Voiceless
              </span>
            </Link>

            {/* Hamburger Menu (Mobile) */}
            <button
              className="md:hidden flex items-center px-2 py-1 border rounded text-[#58A3DC] border-[#58A3DC]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8 text-[#58A3DC] font-medium">
              <a href="#about" className="hover:text-[#58A3DC] flex items-center gap-1">
                Who we are
              </a>
              <a href="#campaigns" className="hover:text-[#58A3DC]">
                Our Campaign
              </a>
              <a href="#news" className="hover:text-[#58A3DC]">
                News
              </a>
              <a href="#contact" className="hover:text-[#58A3DC]">
                Contact Us
              </a>
            </div>

            {/* ✅ Donate Button */}
            <button
              onClick={handleDonate}
              disabled={loading}
              className={`hidden md:inline-flex items-center border border-[#58A3DC] text-[#58A3DC] px-4 py-2 rounded-lg font-semibold transition ${
                loading ? "bg-gray-200 cursor-not-allowed" : "hover:bg-sky-50"
              }`}
            >
              {loading ? "Processing..." : "Donate Now"}
              <AiFillHeart className="ml-2 text-[#58A3DC]" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white px-4 pb-4 pt-2 shadow">
              <a href="#about" className="block py-2 text-[#58A3DC] font-medium">
                Who we are
              </a>
              <a href="#campaigns" className="block py-2 text-[#58A3DC] font-medium">
                Our Campaign
              </a>
              <a href="#news" className="block py-2 text-[#58A3DC] font-medium">
                News
              </a>
              <a href="#contact" className="block py-2 text-[#58A3DC] font-medium">
                Contact Us
              </a>
              <button
                onClick={handleDonate}
                disabled={loading}
                className={`block py-2 mt-2 border border-[#58A3DC] text-[#58A3DC] rounded-lg font-semibold text-center w-full ${
                  loading ? "bg-gray-100 cursor-not-allowed" : "hover:bg-sky-50"
                }`}
              >
                {loading ? "Processing..." : "Donate Now"}
                <AiFillHeart className="ml-2 text-[#58A3DC] inline" />
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Spacer so content doesn’t hide under fixed header */}
      <div style={{ height: "100px" }}></div>
    </>
  );
}
