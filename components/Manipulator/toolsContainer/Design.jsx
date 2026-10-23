"use client";

import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/Context";
import { useEffect, useState } from "react";
import UniversalDieNetContainer from "../assets/UniversalDieNetContainer";
import DieMoldBlueprint from "../tools/DieMoldBlueprint";
import { FaPaintbrush, FaRulerCombined } from "react-icons/fa6";
import { getDieMoldSpec } from "@/lib/dieMoldSpecs";

const Design = ({ initialTab = "designer" }) => {
  const pathname = usePathname();
  const { setBox, box, activeBoxPreset, selectBoxPreset } = useAppContext();
  const [activeTab, setActiveTab] = useState(initialTab === "blueprint" ? "blueprint" : "designer");

  const spec = getDieMoldSpec(activeBoxPreset?.id);

  useEffect(() => {
    if (initialTab === "blueprint") setActiveTab("blueprint");
    else setActiveTab("designer");
  }, [initialTab]);

  useEffect(() => {
    const segment = pathname.substring(pathname.lastIndexOf('/') + 1);
    if (segment === "pizzaBox" || segment === "shippingBox") {
      if (selectBoxPreset) {
        selectBoxPreset(segment === "shippingBox" ? "carton" : "pizzaBox");
      } else {
        setBox(segment);
      }
    }
  }, [pathname, setBox, selectBoxPreset]);

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Die Mold View Mode Switcher */}
      <div className="w-full flex items-center justify-between bg-[#F7F3ED] p-1 rounded-lg border border-[#DCCFC2]">
        <button
          type="button"
          onClick={() => setActiveTab("designer")}
          className={`w-1/2 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-md transition-all ${
            activeTab === "designer"
              ? "bg-[#2B211B] text-[#FFFDFC] shadow-xs"
              : "text-[#6B584D] hover:text-[#2B211B]"
          }`}
        >
          <FaPaintbrush className="text-[11px]" />
          <span>2D Design Net</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("blueprint")}
          className={`w-1/2 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-md transition-all ${
            activeTab === "blueprint"
              ? "bg-[#2B211B] text-[#FFFDFC] shadow-xs"
              : "text-[#6B584D] hover:text-[#2B211B]"
          }`}
        >
          <FaRulerCombined className="text-[11px]" />
          <span>Die Mold Blueprint</span>
        </button>
      </div>

      {/* Preset Die Mold Identifier Banner */}
      <div className="w-full flex items-center justify-between px-3 py-1.5 bg-white rounded-md border border-[#DCCFC2] text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#A94F32]" />
          <span className="font-bold text-[#2B211B]">{activeBoxPreset?.name || "Box"}</span>
          <span className="text-[#6B584D]">({spec.fefcoCode})</span>
        </div>
        <span className="text-[10px] text-gray-500 font-mono">
          {activeBoxPreset?.modelType?.toUpperCase()}
        </span>
      </div>

      {/* View Switch: Authentic CAD Blueprint or Interactive 2D Design Net */}
      {activeTab === "blueprint" ? (
        <DieMoldBlueprint />
      ) : (
        <UniversalDieNetContainer activeTool={initialTab === "text" ? "text" : undefined} />
      )}
    </div>
  );
};

export default Design;
