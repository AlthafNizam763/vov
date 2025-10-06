// components/Founder.tsx
export default function Founder() {
  return (
    <section id="founder" className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left: Founder Image with green accent */}
          <div className="relative">
            {/* green rounded accent behind */}
            <div className="absolute -top-4 -left-4 w-80 h-100 bg-[#4EBC73] rounded-tr-3xl rounded-bl-3xl z-0"></div>

            <div className="relative rounded-2xl overflow-hidden shadow-lg z-10">
              <img
                src="/images/founder.jpeg"
                alt="Founder"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right: Founder Content */}
          <div>
            <h1 className="text-xl font-semibold uppercase text-gray-800 mb-2">FOUNDER</h1>
            <h4 className="text-lg md:text-2xl font-bold text-[#58A3DC] mb-4">
              Azhar Pachalloor
            </h4>

            <p className="text-gray-700 leading-relaxed mb-4">
              A charity founder, when both roles are held by the same person, carries a
              unique blend of vision and responsibility. As founder, this individual
              conceives the charity’s mission, identifies the social or environmental
              need, and establishes the organization’s structure, funding model, and
              initial programs.
            </p>

            <p className="text-gray-700 leading-relaxed mb-4">
              They are often the driving force behind its early growth—recruiting the
              first volunteers or staff, securing start-up donations, and setting the
              core values and long-term goals. As chairman of the board, the same
              person also leads governance: guiding strategic decisions, presiding over
              board meetings, ensuring financial accountability, and maintaining
              compliance with legal and ethical standards.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Balancing these roles requires both entrepreneurial energy and steady
              leadership, because the founder’s passion must be matched with the
              chairman’s duty to remain transparent, collaborative, and focused on
              sustainable impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
