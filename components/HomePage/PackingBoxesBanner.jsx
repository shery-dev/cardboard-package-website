"use client";

import Image from "next/image";
import Link from "next/link";

export default function PackingBoxesBanner() {
  return (
    <section className="relative w-full min-h-[520px] lg:min-h-[560px] flex flex-col lg:flex-row overflow-hidden">
      {/* Background layer: diagonal navy (left) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(135deg, #1A3263 0%, #152652 100%)",
          clipPath: "polygon(0 0, 58% 0, 42% 100%, 0 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none"
        style={{
          clipPath: "polygon(0 0, 58% 0, 42% 100%, 0 100%)",
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 8px,
            rgba(255,255,255,0.2) 8px,
            rgba(255,255,255,0.2) 10px
          )`,
        }}
      />

      {/* Background layer: diagonal gold (right) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(135deg, #FAB95B 0%, #e5a84a 100%)",
          clipPath: "polygon(58% 0, 100% 0, 100% 100%, 42% 100%)",
        }}
      />
      <div
        className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none"
        style={{
          clipPath: "polygon(58% 0, 100% 0, 100% 100%, 42% 100%)",
          backgroundImage: `radial-gradient(circle at 75% 50%, rgba(255,255,255,0.35) 0%, transparent 55%)`,
        }}
      />

      {/* Content: Left - text and CTA */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-20 py-12 lg:py-16 order-2 lg:order-1">
        <div className="max-w-xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-lora leading-tight mb-4 uppercase tracking-tight">
            <span className="text-rollBg">Wide range of </span>
            <span className="text-white">cardboard packaging &amp; custom boxes</span>
          </h2>
          <p className="text-white/95 text-sm sm:text-base lg:text-lg font-inter leading-relaxed mb-6 max-w-lg">
            Cardboard packaging, custom boxes, and corrugated boxes at competitive pricing. Mailer boxes, food packaging boxes, and shipping cartons for Pakistan and the USA. Durable, reliable, and made to your specs.
          </p>
          <Link
            href="/quotes"
            className="inline-block px-8 py-3.5 rounded-lg bg-rollBg text-headingTxtColor font-bold font-inter text-sm uppercase tracking-wide shadow-lg hover:bg-mainBgHover hover:shadow-xl transition-all duration-200"
          >
            Get a quote
          </Link>
        </div>
      </div>

      {/* Content: Right - image */}
      <div className="relative z-10 flex-1 min-h-[260px] lg:min-h-0 flex items-center justify-center lg:justify-end px-6 sm:px-10 lg:px-12 xl:px-20 py-12 lg:py-16 order-1 lg:order-2">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg flex justify-center lg:justify-end">
          <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[340px] lg:max-w-[400px]">
            <Image
              src="/img/all-packaging-boxes.png"
              alt="Packing boxes for all items"
              fill
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 1024px) 85vw, 400px"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
