"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaLock, FaTimes } from "react-icons/fa"; // Add FaTimes for cross icon

export default function GlassLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "bondi" && password === "bondi@12") {
      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1500);
    } else {
      setMessage("❌ Invalid username or password");
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
      {/* Glassy Login Card */}
      <div className="relative w-[420px] h-[520px] rounded-[36px] p-10 
        bg-white/10 backdrop-blur-md border border-white/20 shadow-xl flex flex-col justify-center">
        
        {/* Cross icon at the top right */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="absolute top-4 right-4 text-white hover:text-red-400 text-2xl"
          aria-label="Close"
        >
          <FaTimes />
        </button>

        <h2 className="text-center font-semibold text-white text-xl mb-6 drop-shadow-md">
          Log in to continue
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="flex items-center bg-white/20 rounded-full px-4 py-2 shadow-sm backdrop-blur-sm">
            <div className="w-9 h-9 rounded-full bg-[#58A3DC]/90 flex items-center justify-center text-white mr-3 shrink-0">
              <FaUser size={14} />
            </div>
            <input
              type="text"
              placeholder="Username/Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 outline-none bg-transparent text-sm placeholder:text-white text-white"
            />
          </div>

          {/* Password */}
          <div className="flex items-center bg-white/20 rounded-full px-4 py-2 shadow-sm backdrop-blur-sm">
            <div className="w-9 h-9 rounded-full bg-[#58A3DC]/90 flex items-center justify-center text-white mr-3 shrink-0">
              <FaLock size={14} />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 outline-none bg-transparent text-sm placeholder:text-white text-white"
            />
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between text-sm text-white">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-2 border-white/50 bg-transparent checked:bg-[#58A3DC] checked:border-[#58A3DC]"
              />
              <span>Remember me</span>
            </label>
          </div>

          {/* Response message */}
          {message && (
            <div
              className={`text-center text-sm font-medium mt-2 ${
                message.includes("✅") ? "text-green-300" : "text-red-400"
              }`}
            >
              {message}
            </div>
          )}

          {/* Login button */}
          <button
            type="submit"
            className="w-full mt-1 py-3 rounded-full text-white font-medium shadow-md bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
