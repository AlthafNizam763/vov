"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// 🧩 Type for news items
type NewsItem = {
  _id?: string;
  passage?: string;
  date?: string;
  image?: string;
};

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch news (programs) from the backend API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/programs", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch news");
        const data = await res.json();

        // Keep only valid items that have passage + image
        const validData = data.filter(
          (item: NewsItem) => item.passage || item.image || item.date
        );

        setNews(validData);
      } catch (err: unknown) {
        console.error("❌ Error fetching news:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred while fetching news.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // 🌀 Loading state
  if (loading) {
    return (
      <section className="bg-white py-16 text-center">
        <p className="text-gray-500 animate-pulse">Loading latest programs...</p>
      </section>
    );
  }

  // ⚠️ Error state
  if (error) {
    return (
      <section className="bg-white py-16 text-center">
        <p className="text-red-500">Failed to load programs: {error}</p>
      </section>
    );
  }

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <p className="text-[#58A3DC] font-semibold mb-2">Latest News</p>
        <h2 className="text-3xl text-[#1D1D1D] md:text-4xl font-bold mb-12">
          Latest Program
        </h2>

        {news.length === 0 ? (
          <p className="text-gray-500 text-center">
            No latest programs available right now.
          </p>
        ) : (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={32}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {news.map((item, idx) => (
              <SwiperSlide key={item._id || idx}>
                <article className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition">
                  {/* Image with hover zoom */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={item.image || "/images/default.jpg"}
                      alt={item.passage || "Program image"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Date badge */}
                    {item.date && (
                      <span className="absolute top-4 left-4 bg-[#58A3DC] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                        {item.date}
                      </span>
                    )}
                  </div>
                  {/* Overlay card */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 className="font-bold text-lg text-white mb-1 drop-shadow">
                      {item.passage || "Untitled Program"}
                    </h3>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}
