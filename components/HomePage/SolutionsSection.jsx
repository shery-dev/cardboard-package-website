"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaGlobeAmericas,
  FaIndustry,
  FaBoxOpen,
  FaRulerCombined,
  FaDollarSign,
  FaSearch,
} from "react-icons/fa";

const ROTATING_PHRASES = [
  "Custom Boxes",
  "Restaurant Packaging",
  "Retail Packaging",
  "Luxury Packaging",
  "E-commerce Packaging",
  "Food Packaging",
];

const CARDS = [
  {
    icon: FaGlobeAmericas,
    title: "Ecofriendly",
    description:
      "Easily become a more environmentally-safe brand with our range of Eco-friendly Corrugated boxes.",
    gradient: "from-emerald-500/20 to-cyan-500/20",
  },
  {
    icon: FaIndustry,
    title: "Managed Fabrication",
    description:
      "Get the best manufacturing with demanding processes as well as clarity on your production.",
    gradient: "from-slate-500/20 to-headingTxtColor/20",
  },
  {
    icon: FaBoxOpen,
    title: "Unique Design",
    description:
      "Achieve corporate packaging designs from our executive portrait and structural designers.",
    gradient: "from-violet-500/20 to-mainBgColor/20",
  },
  {
    icon: FaRulerCombined,
    title: "Customized sizes",
    description:
      "Take full control over the size of your packaging, without any hurdles, to perfectly mould it to your product.",
    gradient: "from-cyan-500/20 to-headingTxtColor/20",
  },
  {
    icon: FaDollarSign,
    title: "Cost Savvy",
    description:
      "Ensure bold cost optimization on every project, guaranteeing you spend less on packaging.",
    gradient: "from-amber-500/20 to-mainBgColor/20",
  },
  {
    icon: FaSearch,
    title: "Excellent proofing",
    description:
      "All orders go through our careful proofing system before going into production segment.",
    gradient: "from-rose-500/20 to-headingTxtColor/20",
  },
];

export default function SolutionsSection() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full relative overflow-hidden flex flex-col lg:flex-row min-h-0">
      {/* Left panel: dark blue – gold + white heading, subtext, CTA (like "Wide range" banner) */}
      <div
        className="relative flex-shrink-0 lg:w-[42%] xl:w-[40%] flex flex-col justify-center px-6 sm:px-10 lg:px-12 xl:px-14 py-12 lg:py-16 order-1 bg-headingTxtColor"
        style={{
          background: "linear-gradient(135deg, #1A3263 0%, #152652 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(255,255,255,0.2) 8px, rgba(255,255,255,0.2) 10px)" }} />
        <div className="relative z-10 max-w-lg">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[2.25rem] font-bold font-lora leading-tight mb-4 uppercase tracking-tight overflow-visible">
            <span className="text-mainBgColor block sm:inline">Choose the best solution for </span>
            <span key={phraseIndex} className="block sm:inline text-white animate-fade-in" style={{ marginTop: "0.15em" }}>
              {ROTATING_PHRASES[phraseIndex]}
            </span>
          </h2>
          <p className="text-white/95 text-sm sm:text-base lg:text-lg font-inter leading-relaxed mb-8">
            Find all your packaging solutions all-around and say bye-bye to the trouble.
          </p>
          <Link
            href="/quotes"
            className="inline-block px-8 py-3.5 rounded-lg bg-mainBgColor hover:bg-mainBgHover text-headingTxtColor font-bold font-inter text-sm uppercase tracking-wide shadow-lg hover:shadow-xl transition-all duration-200 w-fit"
          >
            Get a quote
          </Link>
        </div>
      </div>

      {/* Right panel: warm orange/gold tint – 6 feature cards */}
      <div
        className="relative flex-1 min-h-[420px] lg:min-h-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-10 py-12 lg:py-16 order-2"
        style={{
          background: "linear-gradient(135deg, #FAB95B 0%, #f5d07a 50%, #E8E2DB 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="group relative rounded-2xl bg-white/95 backdrop-blur-sm p-5 sm:p-6 flex flex-col border border-white/80 shadow-lg shadow-headingTxtColor/10 hover:shadow-xl hover:shadow-headingTxtColor/15 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className={`relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-4 rounded-xl bg-gradient-to-br ${card.gradient} border border-headingTxtColor/10 group-hover:border-mainBgColor/40 transition-colors duration-300`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-headingTxtColor" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-headingTxtColor font-lora mb-1.5 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 font-inter text-sm leading-relaxed flex-1">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
