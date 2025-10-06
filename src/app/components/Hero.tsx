"use client";

import Image from "next/image";
import { FaApplePay, FaGooglePay } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import "./hero-animations.css"; // Add this line (see CSS below)

function CircularTextPlay() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + 1); // slow rotation
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-20 h-20">
      {/* Circle Text */}
      <svg
      viewBox="0 0 200 200"
      className="w-full h-full absolute"
      style={{ transform: `rotate(${rotation}deg)` }}
      >
      <defs>
        <path
        id="circlePath"
        d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"
        />
      </defs>
      <text
        fill="#5CA9E9"
        fontSize="20"
        fontWeight="bold"
        letterSpacing="3"
      >
        <textPath href="#circlePath" startOffset="50%" textAnchor="middle">
        ● SEE OUR ACTIVITIES ● SEE OUR ACTIVITIES ●
        </textPath>
      </text>
      </svg>

      {/* Play Button */}
      <button className="absolute inset-0 flex items-center justify-center">
      {/* <div className="w-10 h-10 bg-[#5CA9E9] rounded-full flex items-center justify-center shadow-md"> */}
        <FaPlay className="w-5 h-5 ml-1 text-[#5CA9E9]" />
      {/* </div> */}
      </button>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative bg-gray-50">
      {/* background map */}
      <div className="absolute inset-0">
        <Image
          src="/images/map.png"
          alt="Map Background"
          fill
          className="object-cover opacity-10"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="text-center lg:text-left animate-fade-in">
          <p className="text-[#58A3DC] uppercase tracking-wide font-semibold">
            Trusted Charity
          </p>

          <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Let’s Spread Happiness
            <br />
            By <span className="text-[#58A3DC]">Giving</span> From
            <br />
            The Heart
          </h1>

          <p className="mt-6 max-w-md mx-auto lg:mx-0 text-gray-600">
            No matter how small the donation you give will mean a lot to them,
            let’s donate now to help fellow humans in need.
          </p>

          {/* Get Started + Circular Button */}
          <div className="mt-8 flex items-center justify-center lg:justify-start" style={{ gap: '2cm' }}>
            <a
              href="#"
              className="inline-block bg-[#4EBC73] hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition"
            >
              Get Started
            </a>

            {/* Circular Text Play Button */}
            <CircularTextPlay />
          </div>
        </div>

        {/* Right Donation Card */}
        <div className="flex justify-center lg:justify-end animate-slide-up">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative">
            {/* Decorative green stripe */}
            <div className="absolute top-0 right-0 h-full w-4 bg-[#4EBC73] rounded-tr-2xl rounded-br-2xl z-0"></div>
            <div className="absolute bottom-0 right-0 w-1/2 h-4 bg-[#4EBC73] rounded-bl-2xl z-0"></div>

            {/* Card content */}
            <div className="relative z-10">
              <span className="inline-block bg-[#4EBC73] text-white text-sm font-semibold px-4 py-1 rounded mb-4">
                Mission NMMS
              </span>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Freedom of Movement for the Differently Abled
              </h3>

              <p className="text-gray-600 text-sm mb-6">
                We provide Neo Motion Mobility Scooters to differently-abled
                persons, empowering them with independence and mobility. Our
                first program was launched on 09th June 2025 at Gandhibhavan,
                gifting a scooter to Aneesh from Balaramapuram.
              </p>

              {/* Progress bar */}
              <div className="mb-6 bg-[#F5F5F5] rounded-xl p-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-[#4EBC73] rounded-full"
                    style={{ width: "29%" }}
                  />
                </div>
                <div className="flex justify-between text-sm mt-2 text-gray-700">
                  <span>₹120,000 Raised</span>
                  <span>₹600,000 Goal</span>
                </div>
              </div>

              {/* Payment Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button className="border rounded-lg py-3 font-medium hover:bg-gray-50 flex justify-center items-center gap-2">
                  <FaApplePay className="text-4xl text-black" />
                </button>
                <button className="border rounded-lg py-3 font-medium hover:bg-gray-50 flex justify-center items-center gap-2">
                  <FaGooglePay className="text-4xl text-black" />
                </button>
              </div>

              {/* Floating heart icon */}
              <span className="absolute -right-10 -top-10 bg-[#4EBC73] rounded-full p-4 shadow-lg flex items-center justify-center">
                <Image
                  src="/images/charity.png"
                  alt="Charity Icon"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
