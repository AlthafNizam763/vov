import Image from "next/image"

type NewsItem = {
  title: string
  date: string
  image: string
}

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
]

export default function News() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <p className="text-[#58A3DC] font-semibold mb-2">Latest News</p>
        <h2 className="text-3xl text-[#1D1D1D] md:text-4xl font-bold mb-12">Latest Program</h2>

        {/* News Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {newsItems.map((item) => (
            <article
              key={item.title}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-[#1D1D1D] text-lg mb-2">{item.title}</h3>
                <p className="text-[#1D1D1D] text-sm">{item.date}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
