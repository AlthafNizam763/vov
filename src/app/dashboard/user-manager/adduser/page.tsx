"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../Sidebar";
import Topbar from "../../Topbar";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👈 Icons

export default function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(""); // 👈 Validation message
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Password validation function
  const validatePassword = (value: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?~\-=[\]\\;',./]).{8,}$/;
    if (/\s/.test(value)) {
      return "Password cannot contain spaces.";
    } else if (!passwordRegex.test(value)) {
      return "Password must be at least 8 characters long, include uppercase, lowercase, number, and a special character.";
    }
    return "";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value)); // 👈 Real-time validation
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Block submit if invalid password
    const error = validatePassword(password);
    if (error) {
      setPasswordError(error);
      toast.error("Please fix password requirements.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(`❌ ${data.message || "Failed to add user"}`);
        return;
      }

      toast.success(`✅ User added: ${data.user.name}`);
      setTimeout(() => router.push("/dashboard/user-manager"), 1500);
    } catch (error) {
      console.error("Failed to add user:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-[#1E1E2F]">Add User</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                />
              </div>

              {/* Password with Eye Toggle */}
              <div className="relative">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-2 border ${
                    passwordError ? "border-red-500" : "border-gray-300"
                  } rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
                {/* Error message */}
                {passwordError && (
                  <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Member">Member</option>
                </select>
              </div>

              {/* Buttons */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-[#2297F2] text-white font-medium shadow hover:bg-blue-600 transition disabled:opacity-70"
              >
                {loading ? "Adding..." : "Add User"}
              </button>

              <button
                type="button"
                onClick={() => router.back()}
                className="w-full mt-2 py-3 rounded-lg bg-gray-200 text-[#2297F2] font-medium shadow hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
