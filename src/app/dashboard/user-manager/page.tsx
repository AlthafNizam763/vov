"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";
import { useDashboardUser } from "../UserContext";
import { canManageUsers, normalizeRole } from "../../../lib/roles";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const roleStyles: Record<string, string> = {
  Administrator: "bg-red-50 text-red-600",
  Editor: "bg-blue-50 text-blue-600",
  Member: "bg-green-50 text-green-700",
};

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

  // Fetch all users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to fetch users:", error.message);
        } else {
          console.error("An unknown error occurred while fetching users:", error);
        }
        toast.error("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to delete user");
        return;
      }

      toast.success("✅ User deleted successfully!");
      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== id));
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to delete user:", error.message);
      } else {
        console.error("An unknown error occurred while deleting user:", error);
      }
      toast.error("Something went wrong.");
    } finally {
      setConfirmDelete(null);
    }
  };

  // Filter users
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const router = useRouter();
  const { role } = useDashboardUser();
  const canManage = canManageUsers(role);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <span className="eyebrow">Team Access</span>
          <h2 className="section-title text-2xl md:text-3xl mt-2">User Manager</h2>
          <p className="text-sm text-slate-500 mt-1">
            {loading
              ? "Loading…"
              : `${users.length} total user${users.length === 1 ? "" : "s"}`}
            {!canManage && (
              <span className="ml-2 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                View only
              </span>
            )}
          </p>
        </div>
        {canManage && (
          <button
            className="btn btn-brand"
            onClick={() => router.push("/dashboard/user-manager/adduser")}
          >
            <FaPlus /> Add User
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative w-full max-w-sm mb-6">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 dash-input"
        />
      </div>

      {/* Table */}
      <div className="dash-card overflow-hidden">
        {loading ? (
          <p className="text-center p-10 text-slate-400 animate-pulse">Loading users...</p>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto scroll-thin">
            <table className="w-full text-sm text-left text-slate-600">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-400 border-b border-black/5">
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  {canManage && (
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-black/5 last:border-0 hover:bg-brand-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid place-items-center w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white text-xs font-bold shrink-0">
                          {user.name?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                        <span className="font-medium text-ink">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleStyles[normalizeRole(user.role)]}`}>
                        {normalizeRole(user.role)}
                      </span>
                    </td>
                    {canManage && (
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            className="grid place-items-center w-9 h-9 rounded-lg text-brand-600 hover:bg-brand-50 transition"
                            aria-label="Edit"
                            onClick={() => router.push(`/dashboard/user-manager/edituser?id=${user._id}`)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => setConfirmDelete({ id: user._id, name: user.name })}
                            className="grid place-items-center w-9 h-9 rounded-lg text-red-500 hover:bg-red-50 transition"
                            aria-label="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center p-10 text-slate-400">No users found</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-strong rounded-2xl p-7 shadow-2xl w-full max-w-sm text-center">
            <div className="mx-auto mb-4 grid place-items-center w-14 h-14 rounded-full bg-red-50 text-red-500">
              <FaTrash className="w-5 h-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-ink mb-2">Are you sure?</h2>
            <p className="text-slate-600 mb-6">
              Do you really want to delete{" "}
              <span className="font-semibold text-red-500">{confirmDelete.name}</span>? This
              action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.id)}
                className="flex-1 px-4 py-2.5 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
