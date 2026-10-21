"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaBox, FaShieldAlt, FaTruck, FaLeaf } from "react-icons/fa";
import { CATEGORIES } from "@/data/categories";

const FEATURE_ICONS = [FaBox, FaShieldAlt, FaTruck, FaLeaf];

export default function ProductsShowcaseSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [items, setItems] = useState(CATEGORIES);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/v1/site-categories");
        const { data } = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mainCategories = data.filter((c) => c.parent_id == null);
          setItems(mainCategories.length > 0 ? mainCategories : data);
          return;
        }
      } catch (_) {}
      try {
        const res = await fetch("/api/v1/categories");
        const { data } = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mainCategories = data.filter((c) => c.parent_id == null);
          setItems(mainCategories.length > 0 ? mainCategories : data);
        }
      } catch (_) {}
    })();
  }, []);
  const selected = items[selectedIndex] ?? items[0];
  const imgSrc = selected?.img?.[0]?.startsWith("/")
    ? selected.img[0]
    : `/api/v1/fetchImg/${selected?.img?.[0] ?? ""}`;
  const imageKey = selected?._id ?? "default";
  const rawFeatures = selected?.features;
  const features = Array.isArray(rawFeatures) && rawFeatures.length > 0
    ? rawFeatures
    : [selected?.description?.split(". ")?.[0]?.trim() + "." || "Custom packaging to protect and promote your brand."];

  return (
    <section className="relative w-full overflow-hidden bg-secDifferBg">
      <div className="flex flex-col lg:flex-row lg:min-h-[480px] max-w-6xl mx-auto px-6 sm:px-10 py-8 lg:py-12 gap-10 lg:gap-16">
        {/* Left: category nav — hover to show content (click still works for focus/accessibility) */}
        <nav
          className="flex lg:flex-col gap-2 lg:gap-3 shrink-0 lg:w-56"
          role="tablist"
          aria-label="Product categories"
        >
          {items.map((item, i) => (
            <button
              key={item._id}
              role="tab"
              aria-selected={i === selectedIndex}
              tabIndex={0}
              onClick={() => setSelectedIndex(i)}
              onMouseEnter={() => setSelectedIndex(i)}
              className={`text-left font-semibold py-2 px-3 rounded-lg transition-all duration-200 ${
                i === selectedIndex
                  ? "text-headingTxtColor text-lg scale-105 bg-white/80 shadow-sm border border-headingTxtColor/10"
                  : "text-headingHover/80 hover:text-headingTxtColor hover:scale-105 hover:bg-white/60 text-base"
              }`}
            >
              {item.cardboardname}
            </button>
          ))}
        </nav>

        {/* Right: selected content */}
        <div className="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-lora text-headingTxtColor mb-4">
              {selected?.cardboardname}
            </h2>
            <p className="text-gray-700 text-base lg:text-lg leading-relaxed mb-6">
              {selected?.description}
            </p>
            <ul className="space-y-3 mb-8">
              {(Array.isArray(features) ? features : [features]).slice(0, 3).map((line, j) => {
                const Icon = FEATURE_ICONS[j % FEATURE_ICONS.length];
                return (
                  <li key={j} className="flex items-start gap-3 text-gray-600">
                    <Icon className="w-5 h-5 text-mainBgColor shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </li>
                );
              })}
            </ul>
            <Link
              href={`/cardboard/products-list/${selected?._id}`}
              className="inline-flex items-center gap-2 font-semibold text-headingTxtColor hover:text-headingHover transition-colors"
            >
              View more
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="w-full lg:w-80 xl:w-96 shrink-0">
            <div className="relative rounded-xl overflow-hidden bg-white border border-headingTxtColor/10 shadow-sm aspect-square max-h-[320px] lg:max-h-none">
              <Image
                key={imageKey}
                src={imgSrc}
                alt={selected?.cardboardname ?? "Product category"}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 384px"
                unoptimized={imgSrc.startsWith("/api/")}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
