"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
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
        alert("Failed to create payment order");
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
          alert("✅ Payment Successful! ID: " + response.razorpay_payment_id);
        },
        theme: { color: "#4EBC73" },
      };

      // ✅ Correctly type Razorpay
      const RazorpayConstructor = (window as unknown as { Razorpay: new (options: RazorpayOptions) => { open: () => void } }).Razorpay;
      const razor = new RazorpayConstructor(options);
      razor.open();
    } catch (err) {
      console.error("Error starting payment:", err);
      alert("Something went wrong with payment.");
    }
  };

  if (loading) {
    return (
      <section className="bg-white py-16 text-center">
        <p className="text-gray-500 animate-pulse">Loading campaigns...</p>
      </section>
    );
  }

  if (campaigns.length === 0) {
    return (
      <section className="bg-white py-16 text-center">
        <p className="text-gray-500">No campaigns available.</p>
      </section>
    );
  }

  return (
    <section className="bg-white py-16">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-[#58A3DC] font-semibold mb-2">Our Campaign</p>
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[#1D1D1D]">
          Giving Help To Those Who Need It
        </h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
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
              <SwiperSlide key={c._id || c.title}>
                <div className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={c.image || "/images/default.jpg"}
                      alt={c.title || "Campaign"}
                      fill
                      className="object-cover"
                    />
                    {c.tag && (
                      <span className="absolute top-3 left-3 bg-[#4EBC73] text-white font-semibold text-sm px-3 py-1 rounded-full">
                        {c.tag}
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-[#1D1D1D]">
                      {c.title || "Untitled Campaign"}
                    </h3>
                    <p className="text-[#1D1D1D] mb-4">
                      {c.detail || "No details available for this campaign."}
                    </p>

                    <div className="flex justify-between text-sm text-gray-700 mb-2">
                      <span>₹{raised.toLocaleString()}</span>
                      <span className="text-[#8A8A8A]">
                        ₹{goal.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div
                        className="bg-[#4EBC73] h-2 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          handleDonate(goal / 10, c.title)
                        }
                        className="flex-1 bg-[#4EBC73] text-white rounded-lg py-2 font-medium hover:bg-green-600"
                      >
                        Donate now
                      </button>
                      <button className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 font-medium hover:bg-[#58A3DC] hover:text-white">
                        See detail
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
