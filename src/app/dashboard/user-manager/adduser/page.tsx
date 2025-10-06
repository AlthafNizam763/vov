"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../Sidebar";
import Topbar from "../../Topbar";

export default function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Viewer");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send data to your backend
    alert(`User added:\nName: ${name}\nEmail: ${email}\nRole: ${role}`);
    router.push("/dashboard/user-manager");
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
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#2297F2] text-white font-medium shadow hover:bg-blue-600 transition"
              >
                Add User
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