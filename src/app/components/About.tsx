import Image from "next/image";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import Reveal from "./Reveal";
import "./about-animations.css"; // Import your custom CSS

const HIGHLIGHTS = [
  "Support people in extreme need",
  "Largest global crowdfunding community",
  "Make the world a better place",
  "Share your love for community",
];

export default function About() {
  return (
    <section id="about" className="relative bg-canvas py-24 overflow-hidden">
      <span className="blob blob-brand w-96 h-96 -top-10 -left-24 opacity-30" />

      <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Left Images */}
        <Reveal className="relative flex justify-center mb-16 md:mb-0">
          <div className="relative max-w-[280px] sm:max-w-[340px] md:max-w-none">
            {/* Soft glow behind */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-200/50 to-accent-200/40 rounded-[2rem] blur-2xl -z-10" />

            <Image
              src="/images/blanck1.jpg"
              alt="Children supported by Voice of the Voiceless charity"
              className="rounded-[1.75rem] shadow-xl object-cover w-full h-auto ring-1 ring-black/5"
              width={340}
              height={420}
              sizes="(max-width: 768px) 340px, 420px"
              loading="lazy"
            />

            {/* Floating Green Icon */}
            <span className="absolute bg-gradient-to-br from-accent-400 to-accent-600 p-3 rounded-2xl shadow-xl flex items-center justify-center -top-6 -left-6 md:top-8 md:-left-10 border-4 border-white animate-float">
              <Image
                src="/images/solidarity.png"
                alt="Solidarity icon"
                className="w-8 h-8 md:w-10 md:h-10 object-contain"
                width={40}
                height={40}
                loading="lazy"
              />
            </span>

            {/* Small Overlapping Image */}
            <div className="absolute -bottom-10 -right-4 md:-bottom-8 md:-right-12 shadow-2xl rounded-[1.25rem] overflow-hidden border-4 border-white w-[150px] sm:w-[185px]">
              <Image
                src="/images/blanck2.jpg"
                alt="Community support programs by Voice of the Voiceless"
                className="object-cover w-full h-auto"
                width={185}
                height={130}
                sizes="185px"
                loading="lazy"
              />
            </div>

            {/* Floating glass stat chip */}
            <div className="absolute -bottom-6 -left-4 md:-left-8 glass-strong rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand-600 text-white font-bold">
                12+
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold text-ink">Years of</p>
                <p className="text-xs text-slate-500">Compassion</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right Content */}
        <Reveal delay={0.1}>
          <span className="eyebrow">Who we are</span>
          <h2 className="section-title text-3xl md:text-[2.6rem] mt-4 mb-4">
            We&apos;re a Non-Profit Charity &amp;{" "}
            <span className="text-gradient">NGO Organization</span>
          </h2>
          <div className="divider-accent mb-6" />
          <p className="text-slate-600 mb-8 leading-relaxed text-lg">
            Join us and make your life more valuable and useful. Be a part of us
            and contribute to the nation, the environment, and yourself.
          </p>

          <ul className="grid sm:grid-cols-2 gap-4">
            {HIGHLIGHTS.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-black/5 shadow-sm hover:shadow-md transition-shadow"
              >
                <CheckCircleIcon className="w-6 h-6 text-accent-500 shrink-0" />
                <span className="text-slate-700 font-medium">{item}</span>
              </li>
            ))}
          </ul>

          {/* Button */}
          <div className="mt-9">
            <a href="#founder" className="btn btn-brand">
              About Us
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
