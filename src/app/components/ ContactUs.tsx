// ./src/app/components/ContactUs.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import Image from "next/image"; // ✅ use next/image
import { Instagram, Twitter, Linkedin } from "lucide-react";
import { FaDonate } from "react-icons/fa";

// ✅ Type definitions
interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface InputFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

interface AlertBannerProps {
  iconSrc: string;
  title: string;
  description: string;
  onClose: () => void;
}

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
        <text fill="rgba(255,255,255,0.92)" fontSize="15" fontWeight="bold" letterSpacing="3">
          <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
            ● DONATE HERE ● DONATE HERE ● DONATE HERE ● DONATE HERE
          </textPath>
        </text>
      </svg>

      <button className="absolute w-16 h-16 rounded-full glass-dark flex items-center justify-center shadow-lg hover:scale-105 transition animate-pulse-ring">
        <FaDonate className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}

// ✅ Input field
const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  name,
  value,
  placeholder,
  onChange,
  error,
}) => {
  const id = name;
  return (
    <div className="flex flex-col grow shrink self-stretch my-auto min-w-[240px]">
      <label htmlFor={id} className="font-semibold text-ink text-sm mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`px-5 py-3.5 w-full bg-white/80 rounded-xl border ${
          error ? "border-red-400" : "border-slate-200"
        } text-slate-700 focus:ring-2 focus:ring-accent-400 focus:border-transparent outline-none transition`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// ✅ Popup alert
const AlertBanner: React.FC<AlertBannerProps> = ({
  iconSrc,
  title,
  description,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="flex items-center gap-4 glass-strong p-6 rounded-2xl shadow-2xl max-w-md w-full text-ink"
      >
        {/* ✅ Replaced <img> with <Image /> */}
        <Image
          src={iconSrc}
          alt="icon"
          width={40}
          height={40}
          className="w-10 h-10"
        />
        <div>
          <h4 className="font-semibold text-lg">{title}</h4>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
      </motion.div>
    </div>
  );
};

// ✅ Contact component
export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email";
    if (!form.message.trim()) newErrors.message = "Message cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    <section
      id="contact"
      className="relative flex items-center justify-center py-24 px-4 overflow-hidden"
      style={{ background: "var(--gradient-deep)" }}
    >
      <span className="blob blob-accent w-96 h-96 -top-16 -left-16 opacity-30" />
      <span className="blob blob-brand w-96 h-96 -bottom-16 -right-16 opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="relative flex flex-col md:flex-row w-full max-w-5xl shadow-2xl rounded-[1.75rem] overflow-hidden"
      >
        {/* LEFT SIDE */}
        <div className="relative w-full md:w-1/2 p-10 flex flex-col justify-center items-center text-white overflow-hidden bg-gradient-to-br from-brand-600 to-accent-600">
          <span className="blob w-56 h-56 -top-10 -right-10 opacity-40" style={{ background: "radial-gradient(circle,#ffffff,transparent 70%)" }} />
          <h2 className="relative font-display text-3xl font-bold mb-8 text-center">
            Let&apos;s Connect
          </h2>
          <CircularTextPlay />
          <div className="relative flex space-x-4 mt-10">
            {[Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid place-items-center w-11 h-11 rounded-full glass-dark hover:scale-110 transition-transform"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="glass-strong w-full md:w-1/2 p-10 flex flex-col justify-center relative">
          <h3 className="font-display text-3xl font-bold text-gradient mb-2">
            Get in Touch
          </h3>
          <p className="text-slate-500 mb-8">
            Fill out the form below — we&apos;ll get back to you soon.
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
              <label className="font-semibold text-ink text-sm mb-1.5">Message</label>
              <textarea
                name="message"
                placeholder="Write your message here..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                className={`px-5 py-3.5 rounded-xl bg-white/80 border ${
                  errors.message ? "border-red-400" : "border-slate-200"
                } focus:ring-2 focus:ring-accent-400 focus:border-transparent outline-none text-slate-700 transition`}
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-brand w-full mt-2 py-4 text-base"
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
          description="We've received your message and will reach out soon."
          onClose={() => setShowPopup(false)}
        />
      )}
    </section>
  );
}
