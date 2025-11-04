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
    if (team.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % team.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [team]);

  const next = () => setIndex((prev) => (prev + 1) % team.length);
  const prev = () => setIndex((prev) => (prev - 1 + team.length) % team.length);

  if (loading)
    return (
      <section className="bg-white py-16 text-center">
        <p className="text-gray-500 animate-pulse">Loading team...</p>
      </section>
    );

  if (team.length === 0)
    return (
      <section className="bg-white py-16 text-center">
        <p className="text-gray-500">No team members found.</p>
      </section>
    );

  const current = team[index];

  return (
    <section id="team" className="bg-white py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* 🖼️ Profile section */}
        <div className="relative flex justify-center md:justify-end">
          {/* Label */}
          <div className="absolute -left-10 top-16 rotate-[-90deg] origin-left hidden md:block">
            <div className="bg-[#4EBC73] text-white font-bold px-4 py-2 rounded-tr-xl rounded-tl-xl tracking-widest">
              OUR TEAM
            </div>
          </div>

          {/* Decorative accent */}
          {/* <div className="absolute -top-3 -left-3 w-24 h-24 bg-[#9fa5a1] rounded-br-3xl z-0 hidden sm:block"></div> */}

          {/* Profile card */}
          <div className="relative bg-gray-100 rounded-2xl overflow-hidden shadow-lg z-10 w-64 h-80 sm:w-80 sm:h-96 flex items-center justify-center">
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
            <div className="absolute left-3 bottom-3 flex gap-2 sm:flex-col">
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

        {/* 🧑 Text + Thumbnails */}
        <div className="text-center md:text-left mt-6 md:mt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={current._id || current.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-lg sm:text-xl font-semibold text-[#58A3DC] mb-3">
                {current.name || "Unnamed Member"}
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-6">
                {current.bio ||
                  "This team member is part of our organization dedicated to making a positive impact."}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Thumbnails */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {team.map((member, i) => (
              <button
                key={member._id || i}
                onClick={() => setIndex(i)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-md shadow overflow-hidden border-2 transition ${
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
