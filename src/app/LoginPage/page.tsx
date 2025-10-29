"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

export default function GlassLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    } catch (error) {
      console.error("Login error:", error);
      setMessage("❌ Something went wrong. Try again.");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6"
      style={{
        backgroundImage: 'url("/images/login.gif")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative w-[420px] h-[520px] rounded-[36px] p-10 
        bg-white/10 backdrop-blur-md border border-white/20 shadow-xl flex flex-col justify-center">
        
        {/* Close button */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="absolute top-4 right-4 text-white hover:text-red-400 text-2xl"
        >
          <FaTimes />
        </button>

        <h2 className="text-center font-semibold text-white text-xl mb-6 drop-shadow-md">
          Log in to continue
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="flex items-center bg-white/20 rounded-full px-4 py-2 shadow-sm backdrop-blur-sm">
            <div className="w-9 h-9 rounded-full bg-[#58A3DC]/90 flex items-center justify-center text-white mr-3 shrink-0">
              <FaUser size={14} />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 outline-none bg-transparent text-sm placeholder:text-white text-white"
              required
            />
          </div>

          {/* Password with eye icon */}
          <div className="flex items-center bg-white/20 rounded-full px-4 py-2 shadow-sm backdrop-blur-sm relative">
            <div className="w-9 h-9 rounded-full bg-[#58A3DC]/90 flex items-center justify-center text-white mr-3 shrink-0">
              <FaLock size={14} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 outline-none bg-transparent text-sm placeholder:text-white text-white pr-10"
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

          {/* Response Message */}
          {message && (
            <div
              className={`text-center text-sm font-medium mt-2 ${
                message.includes("✅") ? "text-green-300" : "text-red-400"
              }`}
            >
              {message}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-full text-white font-medium shadow-md 
              bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
