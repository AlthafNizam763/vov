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

  // Hero Section (edit only)
  const [heroHeading, setHeroHeading] = useState("Support Our Mission");
  const [heroHeadline, setHeroHeadline] = useState("Together, let’s spread happiness from the heart");
  const [heroPassage, setHeroPassage] = useState("No matter how small the donation, your gift means a lot. Together, let’s spread happiness and help fellow humans in need.");
  const [heroAmount, setHeroAmount] = useState("₹120,000 Raised of ₹600,000 Goal");

  // Our Campaign (add/delete/list)
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      title: "Supporting Children’s Education",
      passage: "Helping kids despite difficult circumstances with education support.",
      amount: "₹5,200 / ₹10,400",
      detail: "Campaign to provide monthly school supplies.",
      image: null as File | null,
    },
  ]);
  const [newCampaign, setNewCampaign] = useState({
    title: "",
    passage: "",
    amount: "",
    detail: "",
    image: null as File | null,
  });

  // Latest Program (add/delete/list)
  const [programs, setPrograms] = useState([
    {
      id: 1,
      passage: "Spreading Awareness, Saving Lives",
      date: "15 Feb, 2023",
      image: null as File | null,
    },
  ]);
  const [newProgram, setNewProgram] = useState({
    passage: "",
    date: "",
    image: null as File | null,
  });

  // Our Team (add/delete/list)
  const [team, setTeam] = useState([
    {
      id: 1,
      name: "Shameera Begum",
      Description: "A charity member is someone who actively supports the mission of a charitable organization through time, effort, or financial contributions.",
      image: null as File | null,
    },
  ]);
  const [newTeamMember, setNewTeamMember] = useState({
    name: "",
    Description: "",
    image: null as File | null,
  });

  // Fetch campaigns from backend
  useEffect(() => {
    fetch("/api/campaigns")
      .then((res) => res.json())
      .then(setCampaigns);
  }, []);

  // Fetch hero data from backend
  useEffect(() => {
    fetch("/api/hero")
      .then((res) => res.json())
      .then((data) => {
        setHeroHeading(data.heading);
        setHeroHeadline(data.headline);
        setHeroPassage(data.passage);
        setHeroAmount(data.amount);
      });
  }, []);

  // Add campaign
  const handleAddCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.title) return;
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCampaign),
    });
    const added = await res.json();
    setCampaigns((prev) => [...prev, added]);
    setNewCampaign({ title: "", passage: "", amount: "", detail: "", image: null });
  };

  // Delete campaign
  const handleDeleteCampaign = async (id: number) => {
    await fetch("/api/campaigns", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgram.passage) return;
    setPrograms([
      ...programs,
      { ...newProgram, id: Date.now() },
    ]);
    setNewProgram({ passage: "", date: "", image: null });
  };

  const handleDeleteProgram = (id: number) => {
    setPrograms(programs.filter((p) => p.id !== id));
  };

  const handleAddTeamMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamMember.name) return;
    setTeam([
      ...team,
      { ...newTeamMember, id: Date.now() },
    ]);
    setNewTeamMember({ name: "", Description: "", image: null });
  };

  const handleDeleteTeamMember = (id: number) => {
    setTeam(team.filter((t) => t.id !== id));
  };

  // Hero Section submit
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

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 flex flex-col items-center">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl">
            <h1 className="text-2xl font-bold text-[#1E1E2F] mb-6">Update Site Content</h1>

            {/* Nav Bar */}
            <nav className="flex mb-8 border-b">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveSection(item.key)}
                  className={`px-4 py-2 font-medium text-gray-700 border-b-2 transition ${
                    activeSection === item.key
                      ? "border-[#2297F2] text-[#2297F2]"
                      : "border-transparent hover:text-[#2297F2]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Hero Section */}
            {activeSection === "hero" && (
              <form className="space-y-6" onSubmit={handleHeroSubmit}>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Hero Section</h2>
                <input
                  type="text"
                  value={heroHeading}
                  onChange={(e) => setHeroHeading(e.target.value)}
                  placeholder="Hero Heading"
                  className="w-full mb-3 px-4 py-2 border rounded-lg text-gray-700"
                />
                <input
                  type="text"
                  value={heroHeadline}
                  onChange={(e) => setHeroHeadline(e.target.value)}
                  placeholder="Hero Headline"
                  className="w-full mb-3 px-4 py-2 border rounded-lg text-gray-700"
                />
                <textarea
                  value={heroPassage}
                  onChange={(e) => setHeroPassage(e.target.value)}
                  placeholder="Hero Passage"
                  className="w-full mb-3 px-4 py-2 border rounded-lg text-gray-700"
                  rows={3}
                />
                <input
                  type="text"
                  value={heroAmount}
                  onChange={(e) => setHeroAmount(e.target.value)}
                  placeholder="Last Amount"
                  className="w-full px-4 py-2 border rounded-lg text-gray-700"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-[#2297F2] text-white font-medium shadow hover:bg-blue-600 transition"
                >
                  Save
                </button>
              </form>
            )}

            {/* Our Campaign */}
            {activeSection === "campaign" && (
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Campaign</h2>
                <form className="space-y-3 mb-6" onSubmit={handleAddCampaign}>
                  <input
                    type="text"
                    value={newCampaign.title}
                    onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                    placeholder="Campaign Title"
                    className="w-full px-4 py-2 border rounded-lg text-gray-700"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewCampaign({ ...newCampaign, image: e.target.files?.[0] || null })}
                    className="w-full text-gray-700"
                  />
                  <textarea
                    value={newCampaign.passage}
                    onChange={(e) => setNewCampaign({ ...newCampaign, passage: e.target.value })}
                    placeholder="Campaign Passage"
                    className="w-full px-4 py-2 border rounded-lg text-gray-700"
                    rows={2}
                  />
                  <input
                    type="text"
                    value={newCampaign.amount}
                    onChange={(e) => setNewCampaign({ ...newCampaign, amount: e.target.value })}
                    placeholder="Final Amount"
                    className="w-full px-4 py-2 border rounded-lg text-gray-700"
                  />
                  <textarea
                    value={newCampaign.detail}
                    onChange={(e) => setNewCampaign({ ...newCampaign, detail: e.target.value })}
                    placeholder="Campaign Detail"
                    className="w-full px-4 py-2 border rounded-lg text-gray-700"
                    rows={1}
                  />
                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-[#2297F2] text-white font-medium shadow hover:bg-blue-600 transition"
                  >
                    Add Campaign
                  </button>
                </form>
                {/* Campaigns List */}
                <table className="w-full text-left border">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-2">Title</th>
                      <th className="p-2">Amount</th>
                      <th className="p-2">Detail</th>
                      <th className="p-2">Image</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((c) => (
                      <tr key={c.id} className="border-t text-gray-700">
                        <td className="p-2">{c.title}</td>
                        <td className="p-2">{c.amount}</td>
                        <td className="p-2">{c.detail}</td>
                        <td className="p-2">
                          {c.image ? (
                            <img
                              src={URL.createObjectURL(c.image)}
                              alt={c.name}
                              className="h-12 w-12 object-cover rounded"
                            />
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() => handleDeleteCampaign(c.id)}
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {/* Latest Program */}
            {activeSection === "program" && (
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Latest Program</h2>
                <form className="space-y-3 mb-6" onSubmit={handleAddProgram}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewProgram({ ...newProgram, image: e.target.files?.[0] || null })}
                    className="w-full text-gray-700"
                  />
                  <textarea
                    value={newProgram.passage}
                    onChange={(e) => setNewProgram({ ...newProgram, passage: e.target.value })}
                    placeholder="Program Passage"
                    className="w-full px-4 py-2 border rounded-lg text-gray-700"
                    rows={2}
                  />
                  <input
                    type="text"
                    value={newProgram.date}
                    onChange={(e) => setNewProgram({ ...newProgram, date: e.target.value })}
                    placeholder="Program Date"
                    className="w-full px-4 py-2 border rounded-lg text-gray-700"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-[#2297F2] text-white font-medium shadow hover:bg-blue-600 transition"
                  >
                    Add Program
                  </button>
                </form>
                {/* Programs List */}
                <table className="w-full text-left border">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-2">Passage</th>
                      <th className="p-2">Date</th>
                      <th className="p-2">Image</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {programs.map((p) => (
                      <tr key={p.id} className="border-t text-gray-700">
                        <td className="p-2">{p.passage}</td>
                        <td className="p-2">{p.date}</td>
                        <td className="p-2">
                          {p.image ? (
                            <img
                              src={URL.createObjectURL(p.image)}
                              alt={p.name}
                              className="h-12 w-12 object-cover rounded"
                            />
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() => handleDeleteProgram(p.id)}
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {/* Our Team */}
            {activeSection === "team" && (
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Team</h2>
                <form className="space-y-3 mb-6" onSubmit={handleAddTeamMember}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, image: e.target.files?.[0] || null })}
                    className="w-full text-gray-700"
                  />
                  <input
                    type="text"
                    value={newTeamMember.name}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                    placeholder="Team Member Name"
                    className="w-full px-4 py-2 border rounded-lg text-gray-700"
                  />
                 <textarea
                    value={newTeamMember.Description}
                    onChange={(e) => setNewTeamMember({ ...newTeamMember, Description: e.target.value })}
                    placeholder="Description"
                    className="w-full px-4 py-2 border rounded-lg text-gray-700"
                    rows={2}
                  />
                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg bg-[#2297F2] text-white font-medium shadow hover:bg-blue-600 transition"
                  >
                    Add Member
                  </button>
                </form>
                {/* Team List */}
                <table className="w-full text-left border">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="p-2">Name</th>
                      <th className="p-2">Description</th>
                      <th className="p-2">Image</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((t) => (
                      <tr key={t.id} className="border-t text-gray-700">
                        <td className="p-2">{t.name}</td>
                        <td className="p-2">{t.Description}</td>
                        <td className="p-2">
                          {t.image ? (
                            <img
                              src={URL.createObjectURL(t.image)}
                              alt={t.name}
                              className="h-12 w-12 object-cover rounded"
                            />
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() => handleDeleteTeamMember(t.id)}
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
