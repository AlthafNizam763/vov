"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { AiFillHeart } from "react-icons/ai";
import { showDonationSuccess, showPaymentError } from "./paymentFeedback";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Campaign = {
  _id?: string;
  title?: string;
  raised?: number;
  amount?: number;
  detail?: string;
  image?: string;
  tag?: string;
};

// ✅ Define RazorpayResponse type
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// ✅ Define RazorpayOptions type
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

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch campaigns");
        const data = await res.json();
        setCampaigns(data);
      } catch (err) {
        console.error("❌ Error fetching campaigns:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // 🪙 Handle Razorpay Payment
  const handleDonate = async (amount: number, campaignName?: string) => {
    try {
      const res = await fetch("/api/razorpay", { method: "POST" });
      const data = await res.json();

      if (!data.id) {
        showPaymentError("We couldn't start the payment. Please try again.");
        return;
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, // paise
        currency: "INR",
        name: "Voice of the Voiceless",
        description: campaignName || "Donation Campaign",
        order_id: data.id,
        handler: function (response: RazorpayResponse) {
          showDonationSuccess({
            paymentId: response.razorpay_payment_id,
            message: campaignName
              ? `Thank you for supporting “${campaignName}”.`
              : "Thank you — your support changes lives.",
          });
        },
        theme: { color: "#12b07a" },
      };

      // ✅ Correctly type Razorpay
      const RazorpayConstructor = (window as unknown as { Razorpay: new (options: RazorpayOptions) => { open: () => void } }).Razorpay;
      const razor = new RazorpayConstructor(options);
      razor.open();
    } catch (err) {
      console.error("Error starting payment:", err);
      showPaymentError();
    }
  };

  const SectionShell = ({ children }: { children: React.ReactNode }) => (
    <section id="campaigns" className="relative bg-canvas py-24 overflow-hidden">
      <span className="blob blob-accent w-[24rem] h-[24rem] top-10 -right-24 opacity-30" />
      <span className="blob blob-brand w-80 h-80 bottom-0 -left-20 opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4">{children}</div>
    </section>
  );

  const Header = () => (
    <div className="mb-14 max-w-2xl">
      <span className="eyebrow">Our Campaign</span>
      <h2 className="section-title text-3xl md:text-[2.6rem] mt-4">
        Giving Help To Those Who{" "}
        <span className="text-gradient-accent">Need It</span>
      </h2>
    </div>
  );

  if (loading) {
    return (
      <SectionShell>
        <Header />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass rounded-[1.5rem] overflow-hidden">
              <div className="h-48 bg-slate-200/60 animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-5 w-2/3 bg-slate-200/70 rounded animate-pulse" />
                <div className="h-4 w-full bg-slate-200/60 rounded animate-pulse" />
                <div className="h-2 w-full bg-slate-200/60 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </SectionShell>
    );
  }

  if (campaigns.length === 0) {
    return (
      <SectionShell>
        <Header />
        <p className="text-slate-500">No campaigns available.</p>
      </SectionShell>
    );
  }

  return (
    <SectionShell>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Header />

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={28}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {campaigns.map((c) => {
          const raised = Number(c.raised) || 0;
          const goal = Number(c.amount) || 1;
          const progress = Math.min((raised / goal) * 100, 100);

          return (
            <SwiperSlide key={c._id || c.title} className="h-auto pb-2">
              <div className="glass rounded-[1.5rem] overflow-hidden hover-lift h-full flex flex-col">
                <div className="relative h-52 w-full overflow-hidden group">
                  <Image
                    src={c.image || "/images/default.jpg"}
                    alt={c.title ? `${c.title} campaign` : "Campaign"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {c.tag && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold text-xs px-3 py-1.5 rounded-full shadow-md">
                      {c.tag}
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-lg mb-2 text-ink line-clamp-1">
                    {c.title || "Untitled Campaign"}
                  </h3>
                  <p className="text-slate-600 mb-5 text-sm leading-relaxed line-clamp-2">
                    {c.detail || "No details available for this campaign."}
                  </p>

                  <div className="mt-auto">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-ink">
                        ₹{raised.toLocaleString()}
                      </span>
                      <span className="text-slate-400">
                        of ₹{goal.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200/70 rounded-full h-2 mb-5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-accent-400 to-accent-600 h-2 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDonate(goal / 10, c.title)}
                        className="btn btn-primary flex-1 text-sm py-2.5 px-3"
                      >
                        Donate <AiFillHeart className="text-white" />
                      </button>
                      <button className="btn btn-outline flex-1 text-sm py-2.5 px-3">
                        See detail
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </SectionShell>
  );
}
