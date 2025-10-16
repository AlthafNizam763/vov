// ./src/app/components/Hero.tsx
"use client";

import Image from "next/image";
import { FaApplePay, FaGooglePay, FaPlay } from "react-icons/fa";
import { useEffect, useState } from "react";
import Script from "next/script";
import "./hero-animations.css"; // Animation CSS

/* ✅ Type Definitions */
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  theme: { color: string };
  method?: Record<string, boolean>;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

/* ------------------ Circular Text Play Button ------------------ */
function CircularTextPlay() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setRotation((r) => r + 1), 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-20 h-20">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full absolute"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <defs>
          <path
            id="circlePath"
            d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"
          />
        </defs>
        <text fill="#5CA9E9" fontSize="20" fontWeight="bold" letterSpacing="3">
          <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
            ● SEE OUR ACTIVITIES ● SEE OUR ACTIVITIES ●
          </textPath>
        </text>
      </svg>

      <button className="absolute inset-0 flex items-center justify-center">
        <FaPlay className="w-5 h-5 ml-1 text-[#5CA9E9]" />
      </button>
    </div>
  );
}

/* ------------------ Hero Section ------------------ */
export default function Hero() {
  const [loading, setLoading] = useState(false);

  // ✅ Razorpay Payment Handler (Fully Typed)
  const handlePayment = async (method: string): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1000 }), // ₹1000 donation
      });
      const order = await res.json();

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: order.amount,
        currency: order.currency,
        name: "Voice of the Voiceless",
        description: `Donation via ${method}`,
        order_id: order.id,
        handler: (response: RazorpayResponse) => {
          alert(
            `✅ ${method} Payment Success!\nPayment ID: ${response.razorpay_payment_id}`
          );
        },
        theme: { color: "#4EBC73" },
        method: { [method.toLowerCase()]: true },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error(err);
      alert("❌ Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-gray-50">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/map.png"
          alt="Map Background"
          fill
          className="object-cover opacity-10"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div className="text-center lg:text-left animate-fade-in">
          <p className="text-[#58A3DC] uppercase tracking-wide font-semibold">
            Trusted Charity
          </p>

          <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Let’s Spread Happiness
            <br />
            By <span className="text-[#58A3DC]">Giving</span> From
            <br />
            The Heart
          </h1>

          <p className="mt-6 max-w-md mx-auto lg:mx-0 text-gray-600">
            Every small contribution makes a difference. Let’s donate and
            empower lives together.
          </p>

          {/* CTA */}
          <div
            className="mt-8 flex items-center justify-center lg:justify-start"
            style={{ gap: "2cm" }}
          >
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("about");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                } else {
                  window.location.hash = "#about";
                }
              }}
              className="inline-block bg-[#4EBC73] hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition"
            >
              Get Started
            </a>
            <CircularTextPlay />
          </div>
        </div>

        {/* Right Card */}
        <div className="flex justify-center lg:justify-end animate-slide-up">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative">
            <div className="absolute top-0 right-0 h-full w-4 bg-[#4EBC73] rounded-tr-2xl rounded-br-2xl z-0"></div>
            <div className="absolute bottom-0 right-0 w-1/2 h-4 bg-[#4EBC73] rounded-bl-2xl z-0"></div>

            <div className="relative z-10">
              <span className="inline-block bg-[#4EBC73] text-white text-sm font-semibold px-4 py-1 rounded mb-4">
                Mission NMMS
              </span>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Freedom of Movement for the Differently Abled
              </h3>

              <p className="text-gray-600 text-sm mb-6">
                We provide Neo Motion Mobility Scooters to differently-abled
                individuals, empowering them with independence.
              </p>

              {/* Progress bar */}
              <div className="mb-6 bg-[#F5F5F5] rounded-xl p-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-[#4EBC73] rounded-full"
                    style={{ width: "29%" }}
                  />
                </div>
                <div className="flex justify-between text-sm mt-2 text-gray-700">
                  <span>₹120,000 Raised</span>
                  <span>₹600,000 Goal</span>
                </div>
              </div>

              {/* ✅ Razorpay Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handlePayment("ApplePay")}
                  disabled={loading}
                  className={`border rounded-lg py-3 font-medium flex justify-center items-center gap-2 transition ${
                    loading
                      ? "bg-gray-100 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <FaApplePay className="text-4xl text-black" />
                </button>

                <button
                  onClick={() => handlePayment("GooglePay")}
                  disabled={loading}
                  className={`border rounded-lg py-3 font-medium flex justify-center items-center gap-2 transition ${
                    loading
                      ? "bg-gray-100 cursor-not-allowed"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <FaGooglePay className="text-4xl text-black" />
                </button>
              </div>

              {/* Floating heart icon */}
              <span className="absolute -right-10 -top-10 bg-[#4EBC73] rounded-full p-4 shadow-lg flex items-center justify-center">
                <Image
                  src="/images/charity.png"
                  alt="Charity Icon"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
