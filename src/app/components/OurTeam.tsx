"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const team = [
  {
    name: "Shameera B",
    image: "/images/ourTeamL.jpeg",
    description: `A charity member is someone who actively supports the mission of a
    charitable organization through time, effort, or financial contributions. 
    Their role can involve a range of activities such as volunteering at events,
    fundraising, promoting awareness in the community, or even participating in
    decision-making if the charity offers formal membership.`
  },
  {
    name: "John Doe",
    image: "/images/ourTeamM.png",
    description: `John contributes by managing campaigns and organizing events to
    spread awareness and raise funds. He believes in empowering communities
    through collaboration.`
  },
  {
    name: "Sarah Ali",
    image: "/images/ourTeamL.jpeg",
    description: `Sarah focuses on youth engagement and training volunteers. Her
    mission is to build strong, self-sustaining communities through education.`
  }
]

export default function OurTeam() {
  const [index, setIndex] = useState(0)

  // Auto change every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % team.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const next = () => setIndex((prev) => (prev + 1) % team.length)
  const prev = () => setIndex((prev) => (prev - 1 + team.length) % team.length)

  return (
    <section id="team" className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-start">
        {/* Left: Profile Card */}
        <div className="relative">
          {/* Vertical ribbon */}
          <div className="absolute -left-12 top-25 rotate-[-90deg] origin-left">
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
                key={team[index].image}
                src={team[index].image}
                alt={team[index].name}
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
              key={team[index].name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-[#58A3DC] mb-3">
                {team[index].name}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                {team[index].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Small Avatars */}
          <div className="flex items-center gap-4">
            {team.map((member, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-20 h-20 rounded-md shadow overflow-hidden border-2 ${
                  i === index ? "border-[#4EBC73]" : "border-transparent"
                }`}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
