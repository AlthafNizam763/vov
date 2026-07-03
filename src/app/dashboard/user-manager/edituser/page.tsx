"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { UserCog } from "lucide-react";

function LoadingCard({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="min-h-[72vh] flex items-center justify-center">
      <div className="dash-card p-8 w-full max-w-md">
        <h2 className="font-display text-2xl font-bold text-ink animate-pulse">{label}</h2>
      </div>
    </div>
  );
}

export default function EditUser() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <EditUserInner />
    </Suspense>
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
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

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
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to load user:", error.message);
        } else {
          console.error("An unknown error occurred:", error);
        }
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

    // 💡 Add a guard clause to ensure user is not null
    if (!user) {
      toast.error("User data is not loaded yet.");
      return;
    }

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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to update user:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <LoadingCard label="Loading user..." />;

  return (
    <div className="min-h-[72vh] flex items-center justify-center">
      <div className="dash-card p-8 w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <span className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-md">
            <UserCog className="w-5 h-5" />
          </span>
          <h2 className="font-display text-2xl font-bold text-ink">Edit User</h2>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="dash-label">Name</label>
            <input
              type="text"
              required
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="dash-input"
            />
          </div>

          {/* Email */}
          <div>
            <label className="dash-label">Email</label>
            <input
              type="email"
              required
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="dash-input"
            />
          </div>

          {/* Role */}
          <div>
            <label className="dash-label">Role</label>
            <select
              value={user.role}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
              className="dash-input"
            >
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Member">Member</option>
            </select>
          </div>

          {/* Password (optional) with Eye Toggle */}
          <div className="relative">
            <label className="dash-label">New Password (optional)</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
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

            {passwordError ? (
              <p className="text-red-500 text-xs mt-1.5">{passwordError}</p>
            ) : (
              <p className="text-xs text-slate-400 mt-1.5">
                Leave blank to keep current password.
              </p>
            )}
          </div>

          {/* Buttons */}
          <button type="submit" disabled={loading} className="btn btn-brand w-full mt-2">
            {loading ? "Saving..." : "Save Changes"}
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
