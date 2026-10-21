"use client";

import { PAYMENT_METHODS } from "@/data/paymentMethods";

const LOGO_SIZE = 40;
const GAP = 28;
const DURATION = 35;

export default function PaymentMethodsSlider() {
  const duplicated = [...PAYMENT_METHODS, ...PAYMENT_METHODS];

  return (
    <div className="flex justify-center">
      {/* Outer border: theme blue */}
      <div className="rounded-2xl border-2 border-headingTxtColor p-1.5 shadow-md" style={{ borderColor: "#1A3263" }}>
        {/* Inner boundary: theme yellow */}
        <div className="rounded-xl border-2 p-1.5" style={{ borderColor: "#FAB95B" }}>
          {/* Inner white content */}
          <div className="relative max-w-md overflow-hidden rounded-lg bg-white py-2 px-3 shadow-sm">
          <div
            className="flex items-center gap-[var(--payment-gap)]"
            style={{
              "--payment-gap": `${GAP}px`,
              animation: `brandsScroll ${DURATION}s linear infinite`,
              width: "max-content",
            }}
          >
            {duplicated.map((method, i) => (
              <div
                key={`${method.name}-${i}`}
                className="flex shrink-0 items-center justify-center bg-transparent"
                style={{
                  width: LOGO_SIZE + GAP,
                  height: LOGO_SIZE,
                }}
              >
                <img
                  src={method.logo}
                  alt={method.alt}
                  width={LOGO_SIZE}
                  height={LOGO_SIZE}
                  className="h-9 w-9 object-contain object-center opacity-90 sm:h-10 sm:w-10"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
