"use client";

import { useState } from "react";
import { useAppContext } from "@/context/Context";
import { FaCheck, FaBox, FaMagnifyingGlass } from "react-icons/fa6";

const CATEGORY_TABS = [
  "All",
  "Food & Bakery",
  "Corrugated",
  "Cartons & Ration",
  "Kraft Paper",
];

export default function BoxTypesList() {
  const { activeBoxPreset, selectBoxPreset, BOX_PRESETS } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPresets = (BOX_PRESETS || []).filter((preset) => {
    // Search match
    const matchesSearch =
      preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Category filter match
    if (selectedCategory === "All") return true;
    if (selectedCategory === "Food & Bakery") {
      return (
        preset.category.includes("Food") ||
        preset.id.toLowerCase().includes("pizza") ||
        preset.id.toLowerCase().includes("cake")
      );
    }
    if (selectedCategory === "Corrugated") {
      return (
        preset.category.includes("Corrugated") ||
        preset.id === "ecommerce" ||
        preset.id === "apparelBox" ||
        preset.id === "giftBox" ||
        preset.id === "laptopBox" ||
        preset.id === "toolBox" ||
        preset.id === "cubeBox" ||
        preset.id === "corporateBox" ||
        preset.id === "flatBox"
      );
    }
    if (selectedCategory === "Cartons & Ration") {
      return (
        preset.category.includes("Carton") ||
        preset.category.includes("Ration") ||
        preset.id === "ration" ||
        preset.id === "carton"
      );
    }
    if (selectedCategory === "Kraft Paper") {
      return preset.id === "kraftPaper" || preset.category.includes("Kraft");
    }
    return true;
  });

  const handleSelect = (preset) => {
    if (selectBoxPreset) {
      selectBoxPreset(preset);
    }
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("preset", preset.id);
      window.history.replaceState({}, "", url.toString());
    }
  };

  return (
    <div className="w-full flex flex-col gap-3 py-1">
      {/* Search Input */}
      <div className="relative w-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <FaMagnifyingGlass className="text-xs" />
        </span>
        <input
          type="text"
          placeholder="Search box preset..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#A94F32] focus:border-[#A94F32] bg-white text-gray-800 placeholder-gray-400"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORY_TABS.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-[#2B211B] text-[#FFFDFC] shadow-xs"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Preset Cards List */}
      <div className="flex flex-col gap-2 w-full max-h-[62vh] overflow-y-auto pr-1">
        {filteredPresets.map((preset) => {
          const isSelected = activeBoxPreset?.id === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelect(preset)}
              className={`w-full text-left p-2.5 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? "bg-amber-50/60 border-[#A94F32] shadow-sm ring-1 ring-[#A94F32]"
                  : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/80"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded flex items-center justify-center shrink-0 text-xs ${
                      isSelected ? "bg-[#A94F32] text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <FaBox />
                  </span>
                  <div>
                    <h4
                      className={`text-xs font-bold leading-tight ${
                        isSelected ? "text-[#2B211B]" : "text-gray-900"
                      }`}
                    >
                      {preset.name}
                    </h4>
                    <span className="text-[10px] text-gray-500 font-medium">
                      {preset.category}
                    </span>
                  </div>
                </div>

                {isSelected ? (
                  <span className="w-4 h-4 rounded-full bg-[#A94F32] text-white flex items-center justify-center text-[9px] shrink-0">
                    <FaCheck />
                  </span>
                ) : (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-semibold uppercase tracking-wider shrink-0">
                    {preset.badge || "Preset"}
                  </span>
                )}
              </div>

              <p className="text-[11px] text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                {preset.description}
              </p>

              <div className="flex items-center justify-between text-[10px] text-gray-500 mt-2 pt-1.5 border-t border-gray-100">
                <span>
                  Default:{" "}
                  <strong className="text-gray-700">
                    {preset.defaultSize.length}″ × {preset.defaultSize.width}″ ×{" "}
                    {preset.defaultSize.depth}″
                  </strong>
                </span>
                <span className="capitalize text-[#A94F32] font-semibold">
                  {preset.modelType}
                </span>
              </div>
            </button>
          );
        })}

        {filteredPresets.length === 0 && (
          <div className="text-center py-6 text-xs text-gray-500">
            No box presets matched &quot;{searchQuery}&quot;.
          </div>
        )}
      </div>

      <div className="p-2 bg-[#F7F3ED] rounded-md border border-[#DCCFC2] text-[10px] text-[#6B584D]">
        <strong>Tip:</strong> Selecting a preset automatically adjusts the 3D model, default sizing, and custom featured brands list for that box.
      </div>
    </div>
  );
}
