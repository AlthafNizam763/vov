"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type NewsItem = {
  title: string;
  date: string;
  image: string;
};

const newsItems: NewsItem[] = [
  {
    title: "Spreading Awareness, Saving Lives",
    date: "15 Feb, 2023",
    image: "/images/news1.png",
  },
  {
    title: "Together people who care about a cause",
    date: "10 Feb, 2023",
    image: "/images/news2.png",
  },
  {
    title: "People who care about a cause",
    date: "7 Feb, 2023",
    image: "/images/news3.jpeg",
  },
  {
    title: "Spreading Awareness, Saving Lives",
    date: "15 Feb, 2023",
    image: "/images/news1.png",
  },
  {
    title: "Together people who care about a cause",
    date: "10 Feb, 2023",
    image: "/images/news2.png",
  },
  {
    title: "People who care about a cause",
    date: "7 Feb, 2023",
    image: "/images/news3.jpeg",
  },
];

export default function News() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <p className="text-[#58A3DC] font-semibold mb-2">Latest News</p>
        <h2 className="text-3xl text-[#1D1D1D] md:text-4xl font-bold mb-12">Latest Program</h2>

        {/* Swiper Slider */}
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
          {newsItems.map((item, idx) => (
            <SwiperSlide key={item.title + idx}>
              <article className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition">
                {/* Image with hover zoom */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Date badge */}
                  <span className="absolute top-4 left-4 bg-[#58A3DC] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    {item.date}
                  </span>
                </div>
                {/* Overlay card */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="font-bold text-lg text-white mb-1 drop-shadow">
                    {item.title}
                  </h3>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
