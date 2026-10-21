'use client';

import { useAppContext } from "@/context/Context";
import { Select } from "flowbite-react";
import { FaCheck, FaRotateLeft } from "react-icons/fa6";

export default function FeatureProductList() {
  const { selectedFeatureProduct, setSelectedFeatureProduct, activeBoxPreset } = useAppContext();

  const brands = activeBoxPreset?.featuredBrands || [
    { key: "DHL", label: "DHL", color: "#D40511", tagline: "Global Courier" },
    { key: "TCS", label: "TCS", color: "#D32F2F", tagline: "Express Logistics" },
    { key: "LEOPARDS", label: "Leopards Courier", color: "#FFD700", tagline: "Overnight Delivery" },
    { key: "FedEx", label: "FedEx", color: "#4D148C", tagline: "Priority Air" },
    { key: "UPS", label: "UPS", color: "#351C15", tagline: "Worldwide Logistics" },
  ];

  const handleSelect = (brandKey) => {
    setSelectedFeatureProduct(brandKey || null);
  };

  return (
    <div className="w-full flex flex-col gap-3 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wide block">
            Featured Brands
          </span>
          <span className="text-[11px] text-gray-500">
            For {activeBoxPreset?.name || "Box"}
          </span>
        </div>
        {selectedFeatureProduct && (
          <button
            type="button"
            onClick={() => handleSelect(null)}
            className="flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 font-semibold px-2 py-0.5 rounded bg-red-50 hover:bg-red-100 transition-colors"
          >
            <FaRotateLeft className="text-[10px]" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Quick Select Dropdown */}
      <Select
        value={selectedFeatureProduct ?? ""}
        onChange={(e) => handleSelect(e.target.value)}
        className="text-xs"
      >
        <option value="">-- Select a Brand Showcase --</option>
        {brands.map((b) => (
          <option key={b.key} value={b.key}>
            {b.label} ({b.tagline || "Brand Showcase"})
          </option>
        ))}
      </Select>

      {/* Brand Visual Cards */}
      <div className="flex flex-col gap-2 mt-1 max-h-[50vh] overflow-y-auto pr-1">
        {brands.map((brand) => {
          const isSelected = selectedFeatureProduct === brand.key;
          return (
            <div
              key={brand.key}
              onClick={() => handleSelect(brand.key)}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? "bg-green-50 border-green-500 shadow-sm ring-1 ring-green-500"
                  : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-5 h-5 rounded-full border border-black/10 shrink-0 shadow-inner"
                    style={{ backgroundColor: brand.color }}
                  />
                  <div>
                    <h5
                      className={`text-xs font-bold ${
                        isSelected ? "text-green-900" : "text-gray-900"
                      }`}
                    >
                      {brand.label}
                    </h5>
                    {brand.tagline && (
                      <span className="text-[10px] text-gray-500 block leading-tight">
                        {brand.tagline}
                      </span>
                    )}
                  </div>
                </div>

                {isSelected ? (
                  <span className="w-4 h-4 rounded-full bg-green-600 text-white flex items-center justify-center text-[9px] shrink-0">
                    <FaCheck />
                  </span>
                ) : (
                  <span
                    className="w-3 h-3 rounded-full border border-gray-300 shrink-0"
                    style={{ backgroundColor: brand.accentColor || "#E5E7EB" }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-gray-500 leading-normal bg-gray-50 p-2 rounded border border-gray-200">
        Selecting a brand wraps the 3D model in that brand&apos;s signature packaging colors and branding badge. Switch back to &quot;DESIGN&quot; at any time to customize your own colors and artwork.
      </p>
    </div>
  );
}
