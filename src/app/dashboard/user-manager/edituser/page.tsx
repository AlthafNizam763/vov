"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "../../Sidebar";
import Topbar from "../../Topbar";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👈 Icons

export default function EditUser() {
  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <Suspense
          fallback={
            <main className="flex-1 p-6 flex flex-col items-center justify-center">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-[#1E1E2F]">Loading...</h2>
              </div>
            </main>
          }
        >
          <EditUserInner />
        </Suspense>
      </div>
    </div>
  );
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface UpdateData {
  name: string;
  email: string;
  role: string;
  password?: string;
}

function EditUserInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams?.get("id");

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 Toggle visibility
  const [passwordError, setPasswordError] = useState(""); // 👈 Validation message

  // ✅ Password validation function
  const validatePassword = (value: string) => {
    if (!value) return ""; // Empty = optional
    if (/\s/.test(value)) {
      return "Password cannot contain spaces.";
    }
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?~\-=[\]\\;',./]).{8,}$/;
    if (!regex.test(value)) {
      return "Password must be at least 8 characters long, include uppercase, lowercase, number, and a special character.";
    }
    return "";
  };

  // Fetch user data
  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch user");
        setUser(data.user);
      } catch (error: any) {
        console.error("Failed to load user:", error.message);
        toast.error("Failed to load user details.");
      }
    };

    fetchUser();
  }, [userId]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Stop submit if invalid password
    if (passwordError) {
      toast.error("Please fix password requirements.");
      return;
    }

    setLoading(true);

    try {
      const updateData: UpdateData = {
        name: user.name,
        email: user.email,
        role: user.role,
      };

      // Include password only if provided
      if (password.trim()) updateData.password = password.trim();

      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to update user");
        return;
      }

      toast.success("✅ User updated successfully!");
      setTimeout(() => router.push("/dashboard/user-manager"), 1500);
    } catch (error: any) {
      console.error("Failed to update user:", error.message);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-[#1E1E2F]">Loading user...</h2>
        </div>
      </main>
    );

  return (
    <main className="flex-1 p-6 flex flex-col items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-[#1E1E2F]">Edit User</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
            <input
              type="text"
              required
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input
              type="email"
              required
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Role</label>
            <select
              value={user.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
            >
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Member">Member</option>
            </select>
          </div>

          {/* Password (optional) with Eye Toggle */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              New Password (optional)
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
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

            {/* Validation message */}
            {passwordError ? (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                Leave blank to keep current password.
              </p>
            )}
          </div>

          {/* Buttons */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#2297F2] text-white font-medium shadow hover:bg-blue-600 transition disabled:opacity-70"
          >
            {loading ? "Saving..." : "Save Changes"}
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
  );
}
