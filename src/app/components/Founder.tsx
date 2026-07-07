import Image from "next/image";
import { FaQuoteLeft } from "react-icons/fa";
import Reveal from "./Reveal";

export default function Founder() {
  return (
    <section id="founder" className="relative bg-white py-24 overflow-hidden">
      <span className="blob blob-brand w-96 h-96 top-10 right-[-8rem] opacity-25" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/* Left: Founder Image with accent frame */}
          <Reveal className="relative flex justify-center md:justify-start">
            <div className="relative w-full max-w-sm">
              {/* Gradient accent behind */}
              <div className="absolute -top-5 -left-5 w-full h-full bg-gradient-to-br from-brand-500 to-accent-500 rounded-tr-[3rem] rounded-bl-[3rem] z-0" />

              <div className="relative rounded-[1.75rem] overflow-hidden shadow-2xl z-10 ring-1 ring-black/5">
                <Image
                  src="/images/founder.jpeg"
                  alt="Mohammed Azhar A, Founder & Chairman of Voice of the Voiceless"
                  className="w-full h-auto object-cover"
                  width={420}
                  height={520}
                  sizes="(max-width: 768px) 100vw, 420px"
                  loading="lazy"
                />
              </div>

              {/* Floating quote glass chip */}
              <div className="absolute -bottom-6 -right-4 md:-right-8 z-20 glass-strong rounded-2xl px-5 py-4 shadow-lg max-w-[220px]">
                <FaQuoteLeft className="text-accent-500 mb-1" />
                <p className="text-sm font-medium text-ink leading-snug">
                  Passion matched with transparent, sustainable impact.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Right: Founder Content */}
          <Reveal delay={0.1}>
            <span className="eyebrow">Founder &amp; Chairman</span>
            <h2 className="section-title text-2xl md:text-[2.2rem] mt-4 mb-2">
              Mohammed Azhar A
            </h2>
            <p className="text-lg font-semibold text-gradient mb-6">
              Azhar Pachalloor
            </p>

            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                A charity founder, when both roles are held by the same person,
                carries a unique blend of vision and responsibility. As founder,
                this individual conceives the charity&apos;s mission, identifies
                the social or environmental need, and establishes the
                organization&apos;s structure, funding model, and initial
                programs.
              </p>
              <p>
                They are often the driving force behind its early
                growth—recruiting the first volunteers or staff, securing
                start-up donations, and setting the core values and long-term
                goals. As chairman of the board, the same person also leads
                governance: guiding strategic decisions, presiding over board
                meetings, and ensuring financial accountability.
              </p>
              <p>
                Balancing these roles requires both entrepreneurial energy and
                steady leadership, because the founder&apos;s passion must be
                matched with the chairman&apos;s duty to remain transparent,
                collaborative, and focused on sustainable impact.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
