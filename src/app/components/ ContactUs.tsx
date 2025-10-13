"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Instagram, Twitter, Linkedin } from "lucide-react";
import { FaDonate } from "react-icons/fa";

function CircularTextPlay() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + 0.5); // slower smooth rotation
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* Circular rotating text */}
      <svg
        viewBox="0 0 200 200"
        className="absolute w-full h-full"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <defs>
          <path
            id="circlePath"
            d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"
          />
        </defs>
        <text
          fill="#f3f4f5"
          fontSize="15"
          fontWeight="bold"
          letterSpacing="3"
        >
          <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
            ● DONATE HERE ● DONATE HERE ● DONATE HERE ● DONATE HERE
          </textPath>
        </text>
      </svg>

      {/* Center Donate Icon */}
      <button className="absolute flex items-center justify-center shadow-lg hover:scale-105 transition">
        <FaDonate className="w-6 h-6 ml-1 text-white" />
      </button>
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Optional: Add loading or disable button state here

    // Simulate delay before showing message
    setTimeout(() => {
      setSubmitted(true);

      // Clear form after submission
      setForm({ name: "", email: "", message: "" });

      // Hide success message after a few seconds (optional)
      setTimeout(() => setSubmitted(false), 4000);
    }, 1000);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-white to-blue-100 py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col md:flex-row w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden"
      >
        {/* LEFT SIDE - Contact Info + Circular Play */}
        <div className="bg-[#4EBC73] text-white w-full md:w-1/2 p-10 flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold mb-8 text-center">Contact Us</h2>

          <CircularTextPlay />

          <div className="flex space-x-6 mt-10">
            <a href="#" className="hover:text-blue-200 transition">
              <Instagram />
            </a>
            <a href="#" className="hover:text-blue-200 transition">
              <Twitter />
            </a>
            <a href="#" className="hover:text-blue-200 transition">
              <Linkedin />
            </a>
          </div>
        </div>

        {/* RIGHT SIDE - Contact Form */}
        <div className="bg-white w-full md:w-1/2 p-10 flex flex-col justify-center relative">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Get in Touch</h3>
          <p className="text-gray-500 mb-8">Feel free to drop us a line below!</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900"
            />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900"
            />
            <textarea
              name="message"
              placeholder="Type your message here..."
              value={form.message}
              onChange={handleChange}
              rows={4}
              required
              className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="bg-gradient-to-r from-[#2297F2] to-[#6EC1E4] text-white py-2.5 px-8 rounded-full font-semibold shadow-md hover:shadow-lg transition w-full"
            >
              SEND
            </motion.button>
          </form>
            {/* Success Popup */}
            {submitted && (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            >
                <div className="bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl font-semibold text-center text-lg">
                ✅ Thank you! We’ll contact you soon.
                </div>
            </motion.div>
            )}
        </div>
      </motion.div>
    </section>
  );
}
