"use client";

import React from "react";
import Script from "next/script";
import { AiFillHeart } from "react-icons/ai";

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  theme: { color: string };
}

export default function Stats() {
  const stats = [
    { label: "Number of Supporters", value: "20M" },
    { label: "Volunteers Worldwide", value: "15K+" },
    { label: "We've Helped Raise", value: "68K+" },
    { label: "Projects Funded", value: "10M+" },
  ];

  const handleDonate = async () => {
    try {
      const res = await fetch("/api/razorpay", { method: "POST" });
      const data = await res.json();

      if (!data.id) {
        alert("Failed to create payment order");
        return;
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: 50000, // ₹500
        currency: "INR",
        name: "Voice of the Voiceless",
        description: "General Donation",
        order_id: data.id,
        handler: (response: RazorpayResponse) => {
          alert("✅ Payment Successful! ID: " + response.razorpay_payment_id);
        },
        theme: { color: "#12b07a" },
      };

      const RazorpayConstructor = (window as unknown as {
        Razorpay: new (options: RazorpayOptions) => { open: () => void };
      }).Razorpay;
      const razor = new RazorpayConstructor(options);
      razor.open();
    } catch (err) {
      console.error("Error starting payment:", err);
      alert("Something went wrong while processing your donation.");
    }
  };

  return (
    <section id="stats" className="bg-canvas">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* CTA card */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative z-20 glass-strong rounded-[1.75rem] p-8 md:p-12 shadow-xl overflow-hidden">
          <span className="blob blob-brand w-64 h-64 -top-24 -right-16 opacity-30" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="md:max-w-2xl">
              <span className="eyebrow">Act Now for a Better World</span>
              <h3 className="section-title text-2xl md:text-[2rem] mt-3">
                Solutions to Help People in Need
                <br className="hidden md:block" />
                and <span className="text-gradient-accent">Save the Planet</span>
              </h3>
            </div>

            <button
              onClick={handleDonate}
              className="btn btn-primary shrink-0"
            >
              Donate Now <AiFillHeart className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats band */}
      <div
        className="relative -mt-20 pt-32 pb-16 overflow-hidden"
        style={{ background: "var(--gradient-deep)" }}
      >
        <span className="blob blob-accent w-80 h-80 top-0 right-0 opacity-30" />
        <span className="blob blob-brand w-72 h-72 bottom-0 left-10 opacity-30" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((s) => (
              <div
                key={s.label}
                className="glass-dark rounded-2xl p-6 text-center flex flex-col items-center hover-lift"
              >
                <p className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white">
                  {s.value}
                </p>
                <span className="block w-10 h-1 rounded-full my-3 bg-gradient-to-r from-accent-300 to-accent-500" />
                <p className="text-xs md:text-sm text-white/75 font-medium">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
