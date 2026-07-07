"use client";

import Image from "next/image";
import { FaApplePay, FaGooglePay, FaPlay } from "react-icons/fa";
import { useEffect, useState } from "react";
import Script from "next/script";
import { showDonationSuccess, showPaymentError } from "./paymentFeedback";
import "./hero-animations.css";

/* ✅ Type Definitions */
interface HeroData {
  heading: string;
  headline: string;
  passage: string;
  amountRaised: number;
  amount: number;
  image?: string;
}

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
    <div className="relative w-24 h-24 shrink-0">
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
        <text fill="rgba(255,255,255,0.9)" fontSize="19" fontWeight="bold" letterSpacing="3">
          <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
            ● SEE OUR ACTIVITIES ● SEE OUR ACTIVITIES ●
          </textPath>
        </text>
      </svg>

      <button className="absolute inset-0 m-auto w-12 h-12 rounded-full glass-dark flex items-center justify-center hover:scale-110 transition-transform">
        <FaPlay className="w-4 h-4 ml-0.5 text-white" />
      </button>
    </div>
  );
}

/* ------------------ Hero Section ------------------ */
export default function Hero() {
  const [loading, setLoading] = useState(false);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [amount, setAmount] = useState(120000);

  // ✅ define your total goal
  const goal = heroData?.amount || 200000;

  // ✅ Fetch Hero Data from API
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await fetch("/api/hero", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load hero data");
        const data = await res.json();
        setHeroData(data);
      } catch (err) {
        console.error("❌ Error fetching hero data:", err);
      }
    };
    fetchHeroData();
  }, []);

  // 💡 Random frontend animation
  useEffect(() => {
    const interval = setInterval(() => {
      const randomAmount =
        Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000;
      setAmount(randomAmount);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ calculate percentage safely
  const percentage = Math.min((amount / goal) * 100, 100);

  // ✅ Razorpay Payment Handler
  const handlePayment = async (method: string): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1000 }),
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
          showDonationSuccess({
            paymentId: response.razorpay_payment_id,
            message: `Thank you for donating via ${method}.`,
          });
        },
        theme: { color: "#12b07a" },
        method: { [method.toLowerCase()]: true },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error(err);
      showPaymentError("Your payment could not be processed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden text-white">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Gradient mesh background */}
      <div
        className="absolute inset-0 -z-20 animate-gradient"
        style={{ background: "var(--gradient-hero)" }}
      />
      {/* Map texture overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/map.png"
          alt=""
          fill
          sizes="100vw"
          aria-hidden="true"
          className="object-cover opacity-[0.08] mix-blend-luminosity"
        />
      </div>
      {/* Decorative blobs */}
      <span className="blob blob-accent w-[26rem] h-[26rem] -top-32 -right-24" />
      <span className="blob blob-brand w-[22rem] h-[22rem] bottom-[-8rem] left-[-6rem]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-14 items-center">
        {/* Left */}
        <div className="text-center lg:text-left animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-xs font-semibold tracking-[0.14em] uppercase text-white/90">
            <span className="w-2 h-2 rounded-full bg-accent-300 animate-pulse-ring" />
            Trusted Charity
          </span>

          <h1 className="mt-6 font-display text-4xl md:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.05]">
            Let&apos;s Spread Happiness
            <br />
            By{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-accent-100">
              Giving
            </span>{" "}
            From
            <br />
            The Heart
          </h1>

          <p className="mt-6 max-w-md mx-auto lg:mx-0 text-white/80 text-lg leading-relaxed">
            Every small contribution makes a difference. Let&apos;s donate and
            empower lives together.
          </p>

          <div className="mt-9 flex items-center justify-center lg:justify-start gap-6">
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("about");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="btn bg-white text-brand-700 shadow-lg hover:-translate-y-0.5 hover:shadow-xl"
            >
              Get Started
            </a>
            <CircularTextPlay />
          </div>
        </div>

        {/* Right Card */}
        <div className="flex justify-center lg:justify-end animate-slide-up">
          <div className="glass-strong rounded-[1.75rem] p-8 max-w-md w-full relative">
            <div className="relative z-10">
              <span className="inline-block text-white text-xs font-bold tracking-wide uppercase px-4 py-1.5 rounded-full mb-4 shadow-sm bg-gradient-to-r from-accent-500 to-accent-600">
                {heroData?.heading || "Mission NMMS"}
              </span>

              <h2 className="font-display text-2xl font-bold text-ink mb-3 leading-snug">
                {heroData?.headline ||
                  "Freedom of Movement for the Differently Abled"}
              </h2>

              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                {heroData?.passage ||
                  "We provide Neo Motion Mobility Scooters to differently-abled individuals, empowering them with independence."}
              </p>

              {/* ✅ Animated Progress bar */}
              <div className="mb-6 bg-white/70 rounded-2xl p-4 ring-1 ring-black/5">
                <div className="h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-accent-400 to-accent-600 transition-all duration-700 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm mt-2.5">
                  <span className="font-semibold text-ink">
                    ₹{amount.toLocaleString()} Raised
                  </span>
                  <span className="text-slate-500">₹{goal.toLocaleString()} Goal</span>
                </div>
              </div>

              {/* Razorpay Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handlePayment("ApplePay")}
                  disabled={loading}
                  className="rounded-xl py-3 flex justify-center items-center gap-2 transition bg-white/80 border border-white/70 shadow-sm hover:bg-white hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FaApplePay className="text-4xl text-black" />
                </button>

                <button
                  onClick={() => handlePayment("GooglePay")}
                  disabled={loading}
                  className="rounded-xl py-3 flex justify-center items-center gap-2 transition bg-white/80 border border-white/70 shadow-sm hover:bg-white hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <FaGooglePay className="text-4xl text-black" />
                </button>
              </div>

              <span className="absolute -right-8 -top-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full p-4 shadow-xl border-4 border-white/80 flex items-center justify-center animate-float">
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

      {/* Bottom wave into next section */}
      <svg
        className="relative block w-full text-canvas"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0,48 C240,80 480,80 720,56 C960,32 1200,16 1440,40 L1440,80 L0,80 Z"
        />
      </svg>
    </section>
  );
}
