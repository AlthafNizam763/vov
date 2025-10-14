"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { Instagram, Twitter, Linkedin } from "lucide-react";
import { FaDonate } from "react-icons/fa";

// ✅ Rotating Donate Circle
function CircularTextPlay() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + 0.5);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
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
        <text fill="#f3f4f5" fontSize="15" fontWeight="bold" letterSpacing="3">
          <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
            ● DONATE HERE ● DONATE HERE ● DONATE HERE ● DONATE HERE
          </textPath>
        </text>
      </svg>

      <button className="absolute flex items-center justify-center shadow-lg hover:scale-105 transition">
        <FaDonate className="w-6 h-6 ml-1 text-white" />
      </button>
    </div>
  );
}

// ✅ Input field component (reusable)
const InputField = ({ label, type, name, value, placeholder, onChange, error }) => {
  const id = name;
  return (
    <div className="flex flex-col grow shrink self-stretch my-auto min-w-[240px]">
      <label htmlFor={id} className="font-bold text-gray-900">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`px-6 py-4 mt-1 w-full bg-white rounded-lg border border-solid ${
          error ? "border-red-500" : "border-slate-300"
        } text-gray-700 focus:ring-2 focus:ring-blue-400 outline-none`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// ✅ Popup alert
const AlertBanner = ({ iconSrc, title, description, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full text-gray-800">
        <img src={iconSrc} alt="icon" className="w-10 h-10" />
        <div>
          <h4 className="font-semibold text-lg">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

// ✅ Contact component
export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Validation
  const validateForm = () => {
    const newErrors: any = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!form.message.trim()) newErrors.message = "Message cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
     await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_email: form.email,
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          reply_to: form.email,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );


      setShowPopup(true);
      setForm({ name: "", email: "", message: "" });
      setErrors({});
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("❌ Something went wrong. Please check your EmailJS configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-white to-blue-100 py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col md:flex-row w-full max-w-5xl shadow-2xl rounded-2xl overflow-hidden"
      >
        {/* LEFT SIDE */}
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

        {/* RIGHT SIDE - FORM */}
        <div className="bg-white w-full md:w-1/2 p-10 flex flex-col justify-center relative">
          <h3 className="text-3xl font-bold text-[#2297F2] mb-4">Get in Touch</h3>
          <p className="text-gray-500 mb-8">
            Fill out the form below — we’ll get back to you soon.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <InputField
              label="Name"
              type="text"
              name="name"
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
            />

            <InputField
              label="Email"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
            />

            <div className="flex flex-col">
              <label className="font-bold text-gray-900">Message</label>
              <textarea
                name="message"
                placeholder="Write your message here..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                className={`px-6 py-4 mt-1 rounded-lg border ${
                  errors.message ? "border-red-500" : "border-slate-300"
                } focus:ring-2 focus:ring-blue-400 outline-none text-gray-700`}
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-4 mt-6 text-lg font-bold text-white rounded-xl transition-all duration-200 ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#2297F2] to-[#6EC1E4] hover:opacity-90"
              }`}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </motion.div>

      {/* ✅ Success Popup */}
      {showPopup && (
        <AlertBanner
          iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/7e70692d0c5ac2b9129a2216c34548ca12ced27ff3baae586c32d8b0729a67dc?placeholderIfAbsent=true&apiKey=a9ef1b359bc94027b911d1891520fd40"
          title="Message Sent!"
          description="We’ve received your message and will reach out soon."
          onClose={() => setShowPopup(false)}
        />
      )}
    </section>
  );
}
