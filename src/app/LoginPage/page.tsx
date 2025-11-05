"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
      className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center p-6 text-white"
      style={{
        background: "linear-gradient(to bottom right, #4EBC73, #58A3DC)",
      }}
    >
      {/* Left Side Image Section */}
      <div className="flex flex-col items-center justify-center md:w-1/2 text-center mb-8 md:mb-0">
        <img
          src="/images/log.png" // Replace with your doctor image path
          alt="Doctor"
          className="w-72 mb-4 drop-shadow-lg"
        />
        <h2 className="text-2xl font-semibold drop-shadow-md">
          صوت من لا صوت لهم
        </h2>
      </div>

      {/* Right Side Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center relative">
        <div className="w-[420px] h-[520px] bg-white/10 backdrop-blur-md border border-white/20 rounded-[36px] shadow-xl p-10 flex flex-col justify-center relative">
          {/* Close button */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="absolute top-4 right-4 text-white hover:text-red-400 text-2xl transition"
          >
            <FaTimes />
          </button>

          <h2 className="text-center text-white text-xl font-semibold mb-6">
            Log in to continue
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="flex items-center bg-white/20 rounded-full px-4 py-2">
              <div className="w-9 h-9 rounded-full bg-[#58A3DC]/90 flex items-center justify-center text-white mr-3">
                <FaUser size={14} />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder:text-white text-sm"
                required
              />
            </div>

            {/* Password Field */}
            <div className="flex items-center bg-white/20 rounded-full px-4 py-2 relative">
              <div className="w-9 h-9 rounded-full bg-[#58A3DC]/90 flex items-center justify-center text-white mr-3">
                <FaLock size={14} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder:text-white text-sm pr-8"
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
                className={`text-center text-sm ${
                  message.includes("✅") ? "text-green-300" : "text-red-400"
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-full text-white font-medium bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
