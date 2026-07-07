"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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
  const prev = () => setIndex((prev) => (prev - 1 + team.length) % team.length);

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <section id="team" className="relative bg-canvas py-24 px-4 sm:px-6 overflow-hidden">
      <span className="blob blob-accent w-96 h-96 -top-10 right-[-8rem] opacity-25" />
      <span className="blob blob-brand w-80 h-80 bottom-0 left-[-6rem] opacity-25" />
      <div className="relative text-center mb-14">
        <span className="eyebrow eyebrow-center">Our People</span>
        <h2 className="section-title text-3xl md:text-[2.6rem] mt-4">
          Meet Our <span className="text-gradient">Team</span>
        </h2>
      </div>
      {children}
    </section>
  );

  if (loading)
    return (
      <Shell>
        <p className="text-slate-500 animate-pulse text-lg text-center">
          Loading team...
        </p>
      </Shell>
    );

  if (!team.length)
    return (
      <Shell>
        <p className="text-slate-500 text-lg text-center">No team members found.</p>
      </Shell>
    );

  const current = team[index];

  return (
    <Shell>
      <div className="relative max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">
        {/* Profile Card */}
        <div className="relative flex justify-center md:justify-start">
          {/* accent frame */}
          <div className="absolute -top-4 -left-4 w-64 h-80 sm:w-80 sm:h-96 bg-gradient-to-br from-brand-500 to-accent-500 rounded-[2rem] z-0" />
          <div className="relative bg-slate-100 rounded-[2rem] overflow-hidden shadow-2xl w-64 h-80 sm:w-80 sm:h-96 z-10 ring-1 ring-black/5">
            <AnimatePresence mode="wait">
              <motion.img
                key={current.image}
                src={current.image || "/images/default.jpg"}
                alt={
                  current.name
                    ? `${current.name} — Voice of the Voiceless team member`
                    : "Team member"
                }
                loading="lazy"
                decoding="async"
                width={320}
                height={384}
                initial={{ opacity: 0, x: 50, scale: 1.05 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            {/* Nav buttons */}
            <div className="absolute right-3 bottom-3 flex gap-2">
              <button
                onClick={prev}
                aria-label="Previous member"
                className="w-10 h-10 grid place-items-center rounded-full glass-dark text-white hover:scale-110 transition-transform"
              >
                <FiChevronLeft />
              </button>
              <button
                onClick={next}
                aria-label="Next member"
                className="w-10 h-10 grid place-items-center rounded-full glass-dark text-white hover:scale-110 transition-transform"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="text-center md:text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={current._id || current.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-mono text-sm text-accent-600 font-semibold mb-3">
                {String(index + 1).padStart(2, "0")} / {String(team.length).padStart(2, "0")}
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-gradient mb-4">
                {current.name || "Unnamed Member"}
              </h3>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                {current.bio ||
                  "This team member is part of our organization dedicated to making a positive impact."}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center md:justify-start gap-2 mt-8">
            {team.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to member ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-8 bg-gradient-to-r from-brand-600 to-accent-500"
                    : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
