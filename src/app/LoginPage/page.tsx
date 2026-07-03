"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

export default function LoginGlass() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.message || "Login failed"}`);
        return;
      }

      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch {
      setMessage("❌ Something went wrong. Try again.");
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col md:flex-row items-center justify-center gap-8 p-6 text-white overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Decorative blobs */}
      <span className="blob blob-accent w-[26rem] h-[26rem] -top-24 -left-24" />
      <span className="blob blob-brand w-[24rem] h-[24rem] -bottom-24 -right-16" />

      {/* Left Side Image Section */}
      <div className="relative flex flex-col items-center justify-center md:w-1/2 text-center mb-4 md:mb-0">
        <Image
          src="/images/log.png"
          alt="Voice of the Voiceless"
          width={288}
          height={288}
          className="w-72 h-auto mb-5 drop-shadow-2xl animate-float"
          priority
        />
        <h2 className="font-display text-3xl font-bold drop-shadow-md">
          صوت من لا صوت لهم
        </h2>
        <p className="text-white/75 mt-2">Voice of the Voiceless · Admin Portal</p>
      </div>

      {/* Right Side Login Form */}
      <div className="relative w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-[420px] glass-dark rounded-[2rem] shadow-2xl p-9 sm:p-10 relative">
          {/* Close button */}
          <button
            type="button"
            onClick={() => router.push("/")}
            aria-label="Close"
            className="absolute top-5 right-5 grid place-items-center w-9 h-9 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition"
          >
            <FaTimes />
          </button>

          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] uppercase text-white/90">
              Welcome Back
            </span>
            <h2 className="font-display text-2xl font-bold text-white mt-4">
              Log in to continue
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="flex items-center bg-white/12 border border-white/20 rounded-full px-3 py-2 focus-within:border-accent-300 focus-within:bg-white/20 transition">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white mr-3 shrink-0">
                <FaUser size={14} />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder:text-white/60 text-sm"
                required
              />
            </div>

            {/* Password Field */}
            <div className="flex items-center bg-white/12 border border-white/20 rounded-full px-3 py-2 relative focus-within:border-accent-300 focus-within:bg-white/20 transition">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white mr-3 shrink-0">
                <FaLock size={14} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder:text-white/60 text-sm pr-8"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-white/70 hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`text-center text-sm font-medium ${
                  message.includes("✅") ? "text-accent-200" : "text-red-300"
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full mt-2">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
