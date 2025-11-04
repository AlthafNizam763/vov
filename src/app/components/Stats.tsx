"use client";

import React, { useEffect } from "react";
import Script from "next/script";

export default function Stats() {
  const stats = [
    { label: "Number of Supporters", value: "20M" },
    { label: "Volunteers Worldwide", value: "15K+" },
    { label: "We've Helped Raise", value: "68K+" },
    { label: "Projects Funded", value: "10M+" },
  ];

  // 🪙 Razorpay Payment Function
  const handleDonate = async () => {
    try {
      const res = await fetch("/api/razorpay", { method: "POST" });
      const data = await res.json();

      if (!data.id) {
        alert("Failed to create payment order");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: 10000, // 💰 Example: ₹500.00 (in paise)
        currency: "INR",
        name: "Voice of the Voiceless",
        description: "General Donation",
        order_id: data.id,
        handler: function (response: any) {
          alert("✅ Payment Successful! ID: " + response.razorpay_payment_id);
        },
        theme: { color: "#4EBC73" },
      };

      const razor = new (window as any).Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Error starting payment:", err);
      alert("Something went wrong while processing your donation.");
    }
  };

  return (
    <section id="stats" className="bg-white">
      {/* Razorpay script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Container for the white card */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative">
          {/* White floating card */}
          <div className="relative z-20 bg-white rounded-2xl shadow-2xl p-6 md:p-12 overflow-hidden">
            {/* subtle wave background (behind content) */}
            <svg
              className="absolute inset-0 w-full h-full opacity-6 pointer-events-none z-0"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              viewBox="0 0 1440 200"
            >
              <g fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M0,160 C200,120 400,40 600,60 C800,80 1000,140 1200,120 C1400,100 1440,90 1440,90" />
                <path d="M0,180 C220,140 420,60 620,80 C820,100 1020,160 1220,140 C1420,120 1440,110 1440,110" />
              </g>
            </svg>

            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="md:max-w-2xl">
                <p className="text-sm text-[#58A3DC] font-semibold">
                  Act Now for a Better World
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
                  Solutions to Help People in Need
                  <br className="hidden md:block" />
                  and Save the Planet
                </h3>
                <span className="block w-14 h-1 bg-[#4EBC73] rounded mt-4"></span>
              </div>

              <div className="ml-auto">
                <button
                  onClick={handleDonate}
                  className="inline-flex items-center gap-2 bg-[#4EBC73] hover:bg-green-600 text-white px-5 py-3 rounded-md font-semibold shadow"
                  aria-label="Donate now"
                >
                  Donate Now
                  <span aria-hidden>❤</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Green band with stats */}
      <div className="w-full bg-[#86cfa2] -mt-12">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
                  {s.value}
                </p>
                <span className="block w-10 h-1 bg-[#58A3DC] rounded my-2"></span>
                <p className="text-xs md:text-sm mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
