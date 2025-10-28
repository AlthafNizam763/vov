"use client";

import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";

const NAV_ITEMS = [
  { key: "hero", label: "Hero Section" },
  { key: "campaign", label: "Our Campaign" },
  { key: "program", label: "Latest Program" },
  { key: "team", label: "Our Team" },
];

export default function SiteUpdate() {
  const [activeSection, setActiveSection] = useState("hero");

  // HERO SECTION
  const [heroHeading, setHeroHeading] = useState("");
  const [heroHeadline, setHeroHeadline] = useState("");
  const [heroPassage, setHeroPassage] = useState("");
  const [heroAmount, setHeroAmount] = useState("");

  // CAMPAIGNS
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    passage: "",
    amount: "",
    detail: "",
    image: null as File | null,
  });

  // PROGRAMS
  const [programs, setPrograms] = useState<any[]>([]);
  const [newProgram, setNewProgram] = useState({
    passage: "",
    date: "",
    image: null as File | null,
  });

  // TEAM
  const [team, setTeam] = useState<any[]>([]);
  const [newTeamMember, setNewTeamMember] = useState({
    name: "",
    Description: "",
    image: null as File | null,
  });

  // 🔹 Fetch Hero Data
  useEffect(() => {
    fetch("/api/hero")
      .then((res) => res.json())
      .then((data) => {
        setHeroHeading(data.heading || "");
        setHeroHeadline(data.headline || "");
        setHeroPassage(data.passage || "");
        setHeroAmount(data.amount || "");
      })
      .catch(() => {});
  }, []);

  // 🔹 Fetch Campaigns
  useEffect(() => {
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then((data) => setCampaigns(data))
      .catch(() => {});
  }, []);

  // 🔹 Fetch Programs
  useEffect(() => {
    fetch("/api/programs")
      .then((res) => res.json())
      .then((data) => setPrograms(data))
      .catch(() => {});
  }, []);

  // 🔹 Fetch Team
  useEffect(() => {
    fetch("/api/team")
      .then((res) => res.json())
      .then((data) => setTeam(data))
      .catch(() => {});
  }, []);

  // --- Hero Update ---
  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        heading: heroHeading,
        headline: heroHeadline,
        passage: heroPassage,
        amount: heroAmount,
      }),
    });
    alert("✅ Hero section updated!");
  };

  // --- Campaign Add ---
  const handleAddCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.title) return alert("Enter a title");

    const formData = new FormData();
    formData.append("title", newCampaign.title);
    formData.append("passage", newCampaign.passage);
    formData.append("amount", newCampaign.amount);
    formData.append("detail", newCampaign.detail);
    if (newCampaign.image) formData.append("image", newCampaign.image);

    const res = await fetch("/api/campaigns", {
      method: "POST",
      body: formData,
    });

    const added = await res.json();
    setCampaigns((prev) => [...prev, added]);
    setNewCampaign({ title: "", passage: "", amount: "", detail: "", image: null });
  };

  const handleDeleteCampaign = async (id: string) => {
    await fetch("/api/campaigns", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setCampaigns((prev) => prev.filter((c) => c._id !== id));
  };

  // --- Program Add ---
  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgram.passage) return alert("Enter program details");

    const formData = new FormData();
    formData.append("passage", newProgram.passage);
    formData.append("date", newProgram.date);
    if (newProgram.image) formData.append("image", newProgram.image);

    const res = await fetch("/api/programs", {
      method: "POST",
      body: formData,
    });

    const added = await res.json();
    setPrograms((prev) => [...prev, added]);
    setNewProgram({ passage: "", date: "", image: null });
  };

  const handleDeleteProgram = async (id: string) => {
    await fetch("/api/programs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPrograms((prev) => prev.filter((p) => p._id !== id));
  };

  // --- Team Add ---
  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamMember.name) return alert("Enter a name");

    const formData = new FormData();
    formData.append("name", newTeamMember.name);
    formData.append("Description", newTeamMember.Description);
    if (newTeamMember.image) formData.append("image", newTeamMember.image);

    const res = await fetch("/api/team", {
      method: "POST",
      body: formData,
    });

    const added = await res.json();
    setTeam((prev) => [...prev, added]);
    setNewTeamMember({ name: "", Description: "", image: null });
  };

  const handleDeleteTeamMember = async (id: string) => {
    await fetch("/api/team", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setTeam((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col">
      <Topbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              🛠 Update Site Content
            </h1>

            {/* Navigation Tabs */}
            <nav className="flex mb-8 border-b border-gray-200">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveSection(item.key)}
                  className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-all duration-150 ${
                    activeSection === item.key
                      ? "border-[#2297F2] text-[#2297F2]"
                      : "border-transparent text-gray-600 hover:text-[#2297F2]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* HERO SECTION */}
            {activeSection === "hero" && (
              <form onSubmit={handleHeroSubmit} className="space-y-4 max-w-2xl mx-auto text-gray-900">
                <h2 className="text-lg font-semibold text-gray-800">Hero Section</h2>
                <input type="text" placeholder="Heading" value={heroHeading} onChange={(e) => setHeroHeading(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                <input type="text" placeholder="Headline" value={heroHeadline} onChange={(e) => setHeroHeadline(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                <textarea placeholder="Passage" value={heroPassage} onChange={(e) => setHeroPassage(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" rows={3} />
                <input type="text" placeholder="Amount" value={heroAmount} onChange={(e) => setHeroAmount(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                <button className="bg-[#2297F2] text-white py-2 rounded-lg w-full hover:bg-blue-600">💾 Save Changes</button>
              </form>
            )}

            {/* OUR CAMPAIGN SECTION */}
            {activeSection === "campaign" && (
              <section className="max-w-3xl mx-auto">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Our Campaign</h2>
                <form onSubmit={handleAddCampaign} className="space-y-3 mb-6 text-gray-900">
                  <input type="text" placeholder="Title" value={newCampaign.title} onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                  <textarea placeholder="Passage" value={newCampaign.passage} onChange={(e) => setNewCampaign({ ...newCampaign, passage: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                  <input type="text" placeholder="Amount" value={newCampaign.amount} onChange={(e) => setNewCampaign({ ...newCampaign, amount: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                  <textarea placeholder="Detail" value={newCampaign.detail} onChange={(e) => setNewCampaign({ ...newCampaign, detail: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                  <input type="file" accept="image/*" onChange={(e) => setNewCampaign({ ...newCampaign, image: e.target.files ? e.target.files[0] : null })} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                  <button className="bg-[#2297F2] text-white py-2 rounded-lg w-full hover:bg-blue-600">➕ Add Campaign</button>
                </form>

                <div className="overflow-x-auto border rounded-lg text-gray-900">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left">Title</th>
                        <th className="p-3 text-left">Amount</th>
                        <th className="p-3 text-left">Image</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((c) => (
                        <tr key={c._id} className="border-t">
                          <td className="p-3">{c.title}</td>
                          <td className="p-3">{c.amount}</td>
                          <td className="p-3">{c.image && <img src={c.image} alt={c.title} className="w-12 h-12 object-cover rounded" />}</td>
                          <td className="p-3 text-center">
                            <button onClick={() => handleDeleteCampaign(c._id)} className="text-red-500 hover:underline">🗑 Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* PROGRAM SECTION */}
            {activeSection === "program" && (
              <section className="max-w-3xl mx-auto">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Latest Program</h2>
                <form onSubmit={handleAddProgram} className="space-y-3 mb-6 text-gray-900">
                  <textarea placeholder="Program Details" value={newProgram.passage} onChange={(e) => setNewProgram({ ...newProgram, passage: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                  <input type="date" value={newProgram.date} onChange={(e) => setNewProgram({ ...newProgram, date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                  <input type="file" accept="image/*" onChange={(e) => setNewProgram({ ...newProgram, image: e.target.files ? e.target.files[0] : null })} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                  <button className="bg-[#2297F2] text-white py-2 rounded-lg w-full hover:bg-blue-600">➕ Add Program</button>
                </form>

                <div className="overflow-x-auto border rounded-lg text-gray-900">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left">Program</th>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Image</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {programs.map((p) => (
                        <tr key={p._id} className="border-t">
                          <td className="p-3">{p.passage}</td>
                          <td className="p-3">{p.date}</td>
                          <td className="p-3">{p.image && <img src={p.image} alt="Program" className="w-12 h-12 object-cover rounded" />}</td>
                          <td className="p-3 text-center">
                            <button onClick={() => handleDeleteProgram(p._id)} className="text-red-500 hover:underline">🗑 Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* TEAM SECTION */}
            {activeSection === "team" && (
              <section className="max-w-3xl mx-auto">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Our Team</h2>
                <form onSubmit={handleAddTeamMember} className="space-y-3 mb-6 text-gray-900">
                  <input type="text" placeholder="Name" value={newTeamMember.name} onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                  <textarea placeholder="Description" value={newTeamMember.Description} onChange={(e) => setNewTeamMember({ ...newTeamMember, Description: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                  <input type="file" accept="image/*" onChange={(e) => setNewTeamMember({ ...newTeamMember, image: e.target.files ? e.target.files[0] : null })} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
                  <button className="bg-[#2297F2] text-white py-2 rounded-lg w-full hover:bg-blue-600">➕ Add Team Member</button>
                </form>

                <div className="overflow-x-auto border rounded-lg text-gray-900">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Description</th>
                        <th className="p-3 text-left">Image</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {team.map((t) => (
                        <tr key={t._id} className="border-t">
                          <td className="p-3">{t.name}</td>
                          <td className="p-3">{t.Description}</td>
                          <td className="p-3">{t.image && <img src={t.image} alt={t.name} className="w-12 h-12 object-cover rounded" />}</td>
                          <td className="p-3 text-center">
                            <button onClick={() => handleDeleteTeamMember(t._id)} className="text-red-500 hover:underline">🗑 Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
