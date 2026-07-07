"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { UserPlus } from "lucide-react";

export default function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Administrator");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
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
    setPasswordError(validatePassword(value));
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
    <div className="min-h-[72vh] flex items-center justify-center">
      <div className="dash-card p-8 w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <span className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-md">
            <UserPlus className="w-5 h-5" />
          </span>
          <h2 className="font-display text-2xl font-bold text-ink">Add User</h2>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="dash-label">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="dash-input"
            />
          </div>

          {/* Email */}
          <div>
            <label className="dash-label">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="dash-input"
            />
          </div>

          {/* Password with Eye Toggle */}
          <div className="relative">
            <label className="dash-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={handlePasswordChange}
              className={`dash-input pr-10 ${passwordError ? "has-error" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {passwordError && (
              <p className="text-red-500 text-xs mt-1.5">{passwordError}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="dash-label">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="dash-input"
            >
              <option value="Administrator">Administrator</option>
              <option value="Editor">Editor</option>
              <option value="Member">Member</option>
            </select>
          </div>

          {/* Buttons */}
          <button type="submit" disabled={loading} className="btn btn-brand w-full mt-2">
            {loading ? "Adding..." : "Add User"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="w-full py-3 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
