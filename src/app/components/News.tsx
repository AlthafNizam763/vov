"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FiArrowUpRight } from "react-icons/fi";
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

  const SectionShell = ({ children }: { children: React.ReactNode }) => (
    <section id="news" className="relative bg-white py-24 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="mb-14 max-w-2xl">
          <span className="eyebrow">Latest News</span>
          <h2 className="section-title text-3xl md:text-[2.6rem] mt-4">
            Our Latest <span className="text-gradient">Programs</span>
          </h2>
        </div>
        {children}
      </div>
    </section>
  );

  // 🌀 Loading state
  if (loading) {
    return (
      <SectionShell>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-64 rounded-[1.5rem] bg-slate-200/60 animate-pulse" />
          ))}
        </div>
      </SectionShell>
    );
  }

  // ⚠️ Error state
  if (error) {
    return (
      <SectionShell>
        <p className="text-red-500">Failed to load programs: {error}</p>
      </SectionShell>
    );
  }

  return (
    <SectionShell>
      {news.length === 0 ? (
        <p className="text-slate-500 text-center">
          No latest programs available right now.
        </p>
      ) : (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={28}
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
            <SwiperSlide key={item._id || idx} className="pb-2">
              <article className="relative group rounded-[1.5rem] overflow-hidden shadow-lg hover-lift">
                {/* Image with hover zoom */}
                <div className="relative h-72 w-full overflow-hidden">
                  <Image
                    src={item.image || "/images/default.jpg"}
                    alt={item.passage || "Program image"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                  {/* Date badge */}
                  {item.date && (
                    <span className="absolute top-4 left-4 glass-dark text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      {item.date}
                    </span>
                  )}
                  <span className="absolute top-4 right-4 grid place-items-center w-9 h-9 rounded-full glass-dark text-white opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <FiArrowUpRight />
                  </span>
                </div>
                {/* Overlay card */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display font-bold text-lg text-white drop-shadow-md line-clamp-2">
                    {item.passage || "Untitled Program"}
                  </h3>
                  <span className="mt-2 inline-block h-0.5 w-10 rounded-full bg-accent-400 transition-all duration-300 group-hover:w-16" />
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </SectionShell>
  );
}
