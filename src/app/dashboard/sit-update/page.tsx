"use client";

import { useState } from "react";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";

export default function SiteUpdate() {
  // Hero Section
  const [heroHeading, setHeroHeading] = useState("Support Our Mission");
  const [heroHeadline, setHeroHeadline] = useState("Together, let’s spread happiness from the heart");
  const [heroPassage, setHeroPassage] = useState("No matter how small the donation, your gift means a lot. Together, let’s spread happiness and help fellow humans in need.");
  const [heroAmount, setHeroAmount] = useState("₹120,000 Raised of ₹600,000 Goal");

  // Our Campaign
  const [campaignTitle, setCampaignTitle] = useState("Supporting Children’s Education");
  const [campaignImage, setCampaignImage] = useState<File | null>(null);
  const [campaignPassage, setCampaignPassage] = useState("Helping kids despite difficult circumstances with education support.");
  const [campaignAmount, setCampaignAmount] = useState("₹5,200 / ₹10,400");
  const [campaignDetail, setCampaignDetail] = useState("Campaign to provide monthly school supplies.");

  // Latest Program
  const [programImage, setProgramImage] = useState<File | null>(null);
  const [programPassage, setProgramPassage] = useState("Spreading Awareness, Saving Lives");
  const [programDate, setProgramDate] = useState("15 Feb, 2023");

  // Our Team
  const [teamName, setTeamName] = useState("Azhar Pachalloor");
  const [teamRole, setTeamRole] = useState("Founder & Chairman");
  const [teamImage, setTeamImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✅ Site content updated successfully!");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 flex flex-col items-center">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl">
            <h1 className="text-2xl font-bold text-[#1E1E2F] mb-6">Update Site Content</h1>

            <form className="space-y-10" onSubmit={handleSubmit}>
              {/* Hero Section */}
              <section>
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
              </section>

              {/* Our Campaign */}
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Campaign</h2>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  placeholder="Campaign Title"
                  className="w-full mb-3 px-4 py-2 border rounded-lg text-gray-700"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCampaignImage(e.target.files?.[0] || null)}
                  className="w-full mb-3 text-gray-700"
                />
                <textarea
                  value={campaignPassage}
                  onChange={(e) => setCampaignPassage(e.target.value)}
                  placeholder="Campaign Passage"
                  className="w-full mb-3 px-4 py-2 border rounded-lg text-gray-700"
                  rows={3}
                />
                <input
                  type="text"
                  value={campaignAmount}
                  onChange={(e) => setCampaignAmount(e.target.value)}
                  placeholder="Final Amount"
                  className="w-full mb-3 px-4 py-2 border rounded-lg text-gray-700"
                />
                <textarea
                  value={campaignDetail}
                  onChange={(e) => setCampaignDetail(e.target.value)}
                  placeholder="Campaign Detail"
                  className="w-full px-4 py-2 border rounded-lg text-gray-700"
                  rows={2}
                />
              </section>

              {/* Latest Program */}
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Latest Program</h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProgramImage(e.target.files?.[0] || null)}
                  className="w-full mb-3 text-gray-700"
                />
                <textarea
                  value={programPassage}
                  onChange={(e) => setProgramPassage(e.target.value)}
                  placeholder="Program Passage"
                  className="w-full mb-3 px-4 py-2 border rounded-lg text-gray-700"
                  rows={3}
                />
                <input
                  type="text"
                  value={programDate}
                  onChange={(e) => setProgramDate(e.target.value)}
                  placeholder="Program Date"
                  className="w-full px-4 py-2 border rounded-lg text-gray-700"
                />
              </section>

              {/* Our Team */}
              <section>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Team</h2>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setTeamImage(e.target.files?.[0] || null)}
                  className="w-full mb-3 text-gray-700"
                />
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Team Member Name"
                  className="w-full mb-3 px-4 py-2 border rounded-lg text-gray-700"
                />
                <input
                  type="text"
                  value={teamRole}
                  onChange={(e) => setTeamRole(e.target.value)}
                  placeholder="Team Member Role"
                  className="w-full px-4 py-2 border rounded-lg text-gray-700"
                />
              </section>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#2297F2] text-white font-medium shadow hover:bg-blue-600 transition"
              >
                Save All Changes
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
