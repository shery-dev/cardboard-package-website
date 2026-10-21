"use client";

import Image from "next/image";
import { BRANDS } from "@/data/brands";

/** Base slot size; brands with small source images can use sizeMultiplier for a larger slot */
const LOGO_SLOT_HEIGHT = 28;
const LOGO_SLOT_WIDTH = 100;
const DURATION = 40; // seconds for one full scroll

export default function BrandsSlider() {
  const duplicated = [...BRANDS, ...BRANDS];

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex items-center py-0.5 gap-20"
        style={{
          animation: `brandsScroll ${DURATION}s linear infinite`,
          width: "max-content",
        }}
      >
        {duplicated.map((brand, i) => {
          const mult = brand.sizeMultiplier ?? 1;
          const w = Math.round(LOGO_SLOT_WIDTH * mult);
          const h = Math.round(LOGO_SLOT_HEIGHT * mult);
          return (
            <div
              key={`${brand.name}-${i}`}
              className="flex items-center justify-center shrink-0 bg-transparent"
              style={{
                width: w,
                height: h,
              }}
            >
              <span
                className="block w-full h-full flex items-center justify-center"
                style={{
                  marginTop: brand.verticalAdjust ?? 0,
                }}
              >
                <Image
                  src={brand.logo}
                  alt={brand.alt}
                  width={w}
                  height={h}
                  className="object-contain object-center opacity-95 w-full h-full"
                  style={{ maxHeight: h, maxWidth: w }}
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                  const fallback = e.target.nextElementSibling;
                  if (fallback) fallback.classList.remove("hidden");
                }}
                />
              </span>
              <span
                className="hidden text-headingTxtColor font-semibold text-xs truncate"
                style={{ maxWidth: w }}
                aria-hidden
              >
                {brand.alt}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
