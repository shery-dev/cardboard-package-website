"use client";

import Link from "next/link";
import {
  FaQuoteRight,
  FaBoxOpen,
  FaPalette,
  FaClock,
  FaFileAlt,
  FaDollarSign,
} from "react-icons/fa";

const FEATURED_FAQS = [
  {
    q: "Can I get an instant quote for my order?",
    a: "Yes. Use our free 3D box designer to choose size, material, and quantity—you’ll see a live quote and unit price as you customize. Add colors or artwork and the price updates in real time.",
    icon: FaQuoteRight,
  },
  {
    q: "What packaging products can I order?",
    a: "We offer custom cardboard Shipping Boxes, Mailer Boxes, and Product Boxes in stock and custom sizes, with low minimums. Ideal for retail and ecommerce. Start in our box designer to create your packaging today.",
    icon: FaBoxOpen,
  },
  {
    q: "How does your 3D box designer work?",
    a: "Design your box in 3D on our tool: set dimensions, pick material, add colors and artwork. Pricing updates as you go. When you’re done, checkout, save your design, or share it.",
    icon: FaPalette,
  },
  {
    q: "What is the turnaround time on my order?",
    a: "Standard production is about 10 business days; Rush is about 7 business days. Shipping adds 1–7 business days depending on your location.",
    icon: FaClock,
  },
  {
    q: "Do I get a proof before printing?",
    a: "Yes. After you order, our Prepress team reviews your design and emails you a 2D digital proof within 24 hours. You can send change requests through the proof page.",
    icon: FaFileAlt,
  },
  {
    q: "What choices affect my pricing?",
    a: "Price depends on box dimensions, style, ink coverage, material, and quantity—larger orders get better rates. Orders of 5,000+ may qualify for volume discounts.",
    icon: FaDollarSign,
  },
];

export default function FAQSection() {
  return (
    <section className="w-full relative overflow-hidden flex flex-col lg:flex-row min-h-0">
      {/* Left panel: dark blue – gold + white heading, intro, CTA */}
      <div
        className="relative flex-shrink-0 lg:w-[35%] xl:w-[32%] flex flex-col justify-center px-6 sm:px-10 lg:px-12 xl:px-14 py-12 lg:py-16 order-1"
        style={{
          background: "linear-gradient(135deg, #1A3263 0%, #152652 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(255,255,255,0.2) 8px, rgba(255,255,255,0.2) 10px)",
          }}
        />
        <div className="relative z-10 max-w-lg flex flex-col items-center lg:items-start text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[2.25rem] font-bold font-lora leading-tight mb-4 uppercase tracking-tight">
            <span className="text-[#FAB95B] block">Frequently asked</span>
            <span className="block text-white">questions</span>
          </h2>
          <p className="text-white/95 text-sm sm:text-base lg:text-lg font-inter leading-relaxed mb-8 max-w-md">
            Below you&apos;ll find answers to some common questions around creating a custom box. Every order is a little different though, so don&apos;t hesitate to reach out with anything else you might be wondering.
          </p>
          <Link
            href="/faq"
            className="inline-block px-8 py-3.5 rounded-lg bg-[#FAB95B] hover:bg-[#f5d07a] text-[#1A3263] font-bold font-inter text-sm uppercase tracking-wide shadow-lg hover:shadow-xl transition-all duration-200 w-fit"
          >
            View all FAQs
          </Link>
        </div>
      </div>

      {/* Right panel: light orange-yellow gradient – FAQ cards grid */}
      <div
        className="relative flex-1 min-h-[420px] lg:min-h-0 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-10 py-12 lg:py-16 order-2"
        style={{
          background:
            "linear-gradient(135deg, #FAB95B 0%, #f5d07a 50%, #E8E2DB 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {FEATURED_FAQS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.q}
                  className="group relative rounded-xl bg-white/95 backdrop-blur-sm p-5 sm:p-6 flex flex-col border border-white/80 shadow-lg shadow-headingTxtColor/10 hover:shadow-xl hover:shadow-headingTxtColor/15 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mb-4 rounded-xl bg-blue-100 border border-blue-200/50 shrink-0">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 font-lora mb-2 tracking-tight leading-snug">
                    {item.q}
                  </h3>
                  <p className="text-gray-600 font-inter text-sm leading-relaxed flex-1">
                    {item.a}
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
