"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import toast from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

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

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#1E1E2F]">User Manager</h1>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-[#2297F2] text-white rounded-lg shadow hover:bg-blue-600 transition"
              onClick={() => router.push("/dashboard/user-manager/adduser")}
            >
              <FaPlus /> Add User
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-sm mb-6">
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Table */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            {loading ? (
              <p className="text-center p-6 text-gray-500">Loading users...</p>
            ) : filteredUsers.length > 0 ? (
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3">{user.name}</td>
                      <td className="px-6 py-3">{user.email}</td>
                      <td className="px-6 py-3">{user.role}</td>
                      <td className="px-6 py-3 text-right flex justify-end gap-3">
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => router.push(`/dashboard/user-manager/edituser?id=${user._id}`)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => setConfirmDelete({ id: user._id, name: user.name })}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center p-6 text-gray-500">No users found</p>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {confirmDelete && (
            <div className="fixed inset-0  bg-opacity-20 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-sm text-center">
                <h2 className="text-xl font-semibold text-[#1E1E2F] mb-2">
                  Are you sure?
                </h2>
                <p className="text-gray-600 mb-6">
                  Do you really want to delete{" "}
                  <span className="font-medium text-red-500">{confirmDelete.name}</span>?
                  This action cannot be undone.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(confirmDelete.id)}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
