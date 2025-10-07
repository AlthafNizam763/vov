import Image from "next/image";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import "./about-animations.css"; // Import your custom CSS

export default function About() {
  return (
    <section id="about" className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Images */}
        <div className="relative flex justify-center md:justify-start animate-slide-left">
          {/* Main Large Image */}
          <div className="relative">
            <Image
              src="/images/blanck1.jpg"
              alt="Happy children"
              className="rounded-2xl shadow-lg object-cover"
              width={320}
              height={400}
              priority
            />

            {/* Floating Green Icon */}
            <span
              className="absolute bg-[#4EBC73] p-2 rounded-full shadow-lg flex items-center justify-center"
              style={{ top: "1cm", left: "-1cm" }}
            >
              <Image
                src="/images/solidarity.png"
                alt="Charity Icon"
                className="w-10 h-10 object-contain"
                width={40}
                height={40}
                priority
              />
            </span>
          </div>

          {/* Small Overlapping Image */}
          <Image
            src="/images/blanck2.jpg"
            alt="Community support"
            className="rounded-2xl shadow-lg absolute"
            style={{ width: "6cm", height: "auto", objectFit: "cover", bottom: "-2cm", right: "2cm" }}
            width={170}
            height={120}
            priority
          />
        </div>

        {/* Right Content */}
        <div className="animate-fade-in">
          <p className="text-[#58A3DC] font-semibold">Who we are</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            We’re Non-Profit Charity & NGO Organization
          </h2>
          <div className="w-16 h-1 bg-[#4EBC73] rounded mt-2 mb-4"></div>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Join us and make your life more valuable and useful, be a part of us
            and contribute to the nation and also the simplest for the
            environment and yourself.
          </p>

          <ul className="space-y-3 text-gray-800">
            <li className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-[#4EBC73]" />
              Support people in extreme need
            </li>
            <li className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-[#4EBC73]" />
              Largest global crowdfunding community
            </li>
            <li className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-[#4EBC73]" />
              Make the world a better place
            </li>
            <li className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-[#4EBC73]" />
              Share your love for community
            </li>
          </ul>

          {/* Button */}
          <div className="mt-8">
            <a
              href="#"
              className="inline-block bg-[#4EBC73] hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition"
            >
              About Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
