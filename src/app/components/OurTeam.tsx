"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  // 🟢 Fetch team members
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

  // 🔁 Auto slide every 5s
  useEffect(() => {
    if (!team.length) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % team.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [team]);

  const next = () => setIndex((prev) => (prev + 1) % team.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + team.length) % team.length);

  if (loading)
    return (
      <section className="bg-white py-20 text-center">
        <p className="text-gray-500 animate-pulse text-lg">Loading team...</p>
      </section>
    );

  if (!team.length)
    return (
      <section className="bg-white py-20 text-center">
        <p className="text-gray-500 text-lg">No team members found.</p>
      </section>
    );

  const current = team[index];

  return (
    <section id="team" className="bg-white py-20 px-4 sm:px-6">
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="inline-block bg-[#4EBC73] text-white font-mono px-10 py-3 rounded-xl tracking-widest text-xl sm:text-2xl shadow-md">
          OUR TEAM
        </h2>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Profile Card */}
        <div className="relative flex justify-center md:justify-end">
          <div className="relative bg-gray-100 rounded-3xl overflow-hidden shadow-xl w-64 h-80 sm:w-80 sm:h-96 flex items-center justify-center">
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

            {/* Nav buttons */}
            <div className="absolute left-3 bottom-3 flex gap-3 sm:flex-col">
              <button
                onClick={prev}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#4EBC73] text-white shadow hover:bg-green-600 transition"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#4EBC73] text-white shadow hover:bg-green-600 transition"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="text-center md:text-left mt-8 md:mt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={current._id || current.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-[#58A3DC] mb-4">
                {current.name || "Unnamed Member"}
              </h3>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                {current.bio ||
                  "This team member is part of our organization dedicated to making a positive impact."}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
