"use client";

import { useState } from "react";
import { FaSearch, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";

const initialUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor" },
  { id: 3, name: "Robert Brown", email: "robert@example.com", role: "Viewer" },
  { id: 4, name: "Emily Davis", email: "emily@example.com", role: "Editor" },
];

export default function UserManager() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");

  const handleDelete = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col">
      {/* Topbar */}
      <Topbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#1E1E2F]">User Manager</h1>
            {/* Add User Button */}
            <button
              className="flex items-center gap-2 px-4 py-2 bg-[#2297F2] text-white rounded-lg shadow hover:bg-blue-600 transition"
              onClick={() => window.location.href = "/dashboard/user-manager/adduser"}
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

          {/* Users Table */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3">{user.id}</td>
                      <td className="px-6 py-3">{user.name}</td>
                      <td className="px-6 py-3">{user.email}</td>
                      <td className="px-6 py-3">{user.role}</td>
                      <td className="px-6 py-3 text-right flex justify-end gap-3">
                        <button className="text-blue-500 hover:text-blue-700"
                        onClick={() => window.location.href = "/dashboard/user-manager/edituser"}>
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
