"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Campaign = {
  title: string;
  raised: number;
  goal: number;
  description: string;
  image: string;
  tag: string;
};

const campaigns: Campaign[] = [
  {
    title: "Supporting Children's Education",
    raised: 5200,
    goal: 10400,
    description: "Despite difficult circumstances.",
    image: "/images/education.jpg",
    tag: "Karunyahastham",
  },
  {
    title: "Monthly Meals For The Homeless",
    raised: 1124,
    goal: 10400,
    description: "In loving memory.",
    image: "/images/meals.avif",
    tag: "Niranjana",
  },
  {
    title: "Freedom Of Movement For The Differently Abled",
    raised: 120000,
    goal: 600000,
    description: "Neo Motion Mobility Scooters.",
    image: "/images/mobility.jpg",
    tag: "Mission NMMS",
  },
  {
    title: "Supporting Children's Education",
    raised: 5200,
    goal: 10400,
    description: "Despite difficult circumstances.",
    image: "/images/education.jpg",
    tag: "Karunyahastham",
  },
  {
    title: "Monthly Meals For The Homeless",
    raised: 1124,
    goal: 10400,
    description: "In loving memory.",
    image: "/images/meals.avif",
    tag: "Niranjana",
  },
  {
    title: "Freedom Of Movement For The Differently Abled",
    raised: 120000,
    goal: 600000,
    description: "Neo Motion Mobility Scooters.",
    image: "/images/mobility.jpg",
    tag: "Mission NMMS",
  },
];

export default function Campaigns() {
  return (
    <section className="bg-white py-16">
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
            const progress = Math.min((c.raised / c.goal) * 100, 100);
            return (
              <SwiperSlide key={c.title}>
                <div className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
                  <div className="relative h-48 w-full">
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-[#4EBC73] text-white font-semibold text-sm px-3 py-1 rounded-full">
                      {c.tag}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2 text-[#1D1D1D]">
                      {c.title}
                    </h3>
                    <p className="text-[#1D1D1D] mb-4">{c.description}</p>
                    <div className="flex justify-between text-sm text-gray-700 mb-2">
                      <span>₹{c.raised.toLocaleString()}</span>
                      <span className="text-[#8A8A8A]">
                        ₹{c.goal.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div
                        className="bg-[#4EBC73] h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 bg-[#4EBC73] text-white rounded-lg py-2 font-medium hover:bg-green-600">
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
