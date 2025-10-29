"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type TeamMember = {
  _id?: string;
  name?: string;
  image?: string;
  bio?: string;
};

export default function OurTeam() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // 🟢 Fetch team members from API
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch("/api/team", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch team members");
        const data = await res.json();
        setTeam(data);
      } catch (err) {
        console.error("❌ Error fetching team:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  // Auto-change every 5 seconds
  useEffect(() => {
    if (team.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % team.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [team]);

  const next = () => setIndex((prev) => (prev + 1) % team.length);
  const prev = () => setIndex((prev) => (prev - 1 + team.length) % team.length);

  // 🌀 Loading State
  if (loading) {
    return (
      <section className="bg-white py-16 text-center">
        <p className="text-gray-500 animate-pulse">Loading team...</p>
      </section>
    );
  }

  // ⚠️ No Team Members
  if (team.length === 0) {
    return (
      <section className="bg-white py-16 text-center">
        <p className="text-gray-500">No team members found.</p>
      </section>
    );
  }

  const current = team[index];

  return (
    <section id="team" className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-start">
        {/* Left: Profile Card */}
        <div className="relative">
          {/* Vertical ribbon */}
          <div className="absolute -left-12 top-24 rotate-[-90deg] origin-left">
            <div className="bg-[#4EBC73] text-white font-bold px-4 py-2 rounded-tr-xl rounded-tl-xl tracking-widest">
              OUR TEAM
            </div>
          </div>

          {/* Green rounded accent top-left */}
          <div className="absolute -top-3 -left-3 w-50 h-50 bg-[#4EBC73] rounded-br-3xl z-0"></div>

          {/* Profile card with animation */}
          <div className="relative bg-gray-100 rounded-2xl overflow-hidden shadow-lg z-10 w-80 h-96 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={current.image}
                src={current.image || "/images/default.jpg"}
                alt={current.name || "Team member"}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Buttons bottom-left */}
            <div className="absolute left-4 bottom-4 flex flex-col gap-2">
              <button
                onClick={prev}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#4EBC73] text-white shadow hover:bg-green-600"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#4EBC73] text-white shadow hover:bg-green-600"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        {/* Right: Text with animation */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={current._id || current.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-[#58A3DC] mb-3">
                {current.name || "Unnamed Member"}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                {current.bio ||
                  "This team member is part of our organization dedicated to making a positive impact."}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Small Avatars */}
          <div className="flex items-center gap-4">
            {team.map((member, i) => (
              <button
                key={member._id || i}
                onClick={() => setIndex(i)}
                className={`w-20 h-20 rounded-md shadow overflow-hidden border-2 ${
                  i === index ? "border-[#4EBC73]" : "border-transparent"
                }`}
              >
                <Image
                  src={member.image || "/images/default.jpg"}
                  alt={member.name || "Team"}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  priority={i === index}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
