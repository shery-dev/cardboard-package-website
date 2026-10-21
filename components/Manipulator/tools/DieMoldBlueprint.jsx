"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useAppContext } from '@/context/Context';
import { getDieMoldSpec } from '@/lib/dieMoldSpecs';
import { renderDieMoldCAD } from '@/lib/dieMoldGeometry';
import { FaDownload, FaEye, FaRulerCombined, FaLayerGroup } from 'react-icons/fa6';

export default function DieMoldBlueprint() {
  const { activeBoxPreset, selectedSize } = useAppContext();
  const spec = getDieMoldSpec(activeBoxPreset?.id);

  const [showRefPhoto, setShowRefPhoto] = useState(true);

  const len = Number(selectedSize?.length) || activeBoxPreset?.defaultSize?.length || 10;
  const wid = Number(selectedSize?.width) || activeBoxPreset?.defaultSize?.width || 10;
  const dep = Number(selectedSize?.depth) || activeBoxPreset?.defaultSize?.depth || 4;

  const downloadSvg = () => {
    const svgEl = document.getElementById(`die-mold-svg-${spec.id}`);
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${spec.id}-die-mold-${len}x${wid}x${dep}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col gap-3 p-3 bg-white rounded-lg border border-[#DCCFC2] text-[#2B211B]">
      {/* Header Info */}
      <div className="flex flex-col gap-1 border-b border-[#EADFD5] pb-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#A94F32] bg-[#F7F3ED] px-2 py-0.5 rounded border border-[#DCCFC2]">
            {spec.fefcoCode}
          </span>
          <span className="text-[11px] font-semibold text-gray-500">
            Dimensions: {len}″ × {wid}″ × {dep}″
          </span>
        </div>
        <h4 className="text-sm font-bold text-[#2B211B] leading-snug">{spec.name}</h4>
        <p className="text-[11px] text-[#6B584D] leading-relaxed">{spec.description}</p>
      </div>

      {/* Reference Image from Catalog + Die Structure Badge */}
      <div className="flex items-center justify-between gap-2 bg-[#F7F3ED] p-2.5 rounded-md border border-[#DCCFC2]">
        <div className="flex items-center gap-2.5">
          {spec.referenceImage ? (
            <div className="w-12 h-12 relative rounded border border-[#DCCFC2] overflow-hidden bg-white shrink-0">
              <Image
                src={spec.referenceImage}
                alt={spec.name}
                fill
                className="object-contain p-1"
                sizes="48px"
              />
            </div>
          ) : null}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-[#6B584D] tracking-wider">Reference Packaging Photo</span>
            <span className="text-[11px] font-bold text-[#2B211B]">{spec.structureType}</span>
            <span className="text-[10px] text-[#A94F32] font-semibold">{spec.caliper}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowRefPhoto(!showRefPhoto)}
          className="text-xs text-[#2B211B] hover:text-[#A94F32] transition-colors p-1"
          title={showRefPhoto ? "Hide reference photo overlay" : "Show reference photo overlay"}
        >
          <FaEye className={showRefPhoto ? "text-[#A94F32]" : "text-gray-400"} />
        </button>
      </div>

      {/* Die Features Checklist */}
      <div className="grid grid-cols-2 gap-1.5 text-[10px]">
        {spec.features.map((feat, idx) => (
          <div key={idx} className="flex items-center gap-1 text-[#433026]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A94F32] shrink-0" />
            <span className="truncate" title={feat}>{feat}</span>
          </div>
        ))}
      </div>

      {/* Vector Die Mold Blueprint SVG Canvas */}
      <div className="relative w-full bg-[#FAF8F5] rounded-md border-2 border-dashed border-[#DCCFC2] p-2 flex flex-col items-center overflow-hidden">
        <svg
          id={`die-mold-svg-${spec.id}`}
          viewBox={spec.svgViewBox || "0 0 540 440"}
          className="w-full h-auto max-h-[340px] drop-shadow-sm select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id={`glue-hatch-${spec.id}`} width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#D97706" strokeWidth="2" strokeOpacity="0.5" />
            </pattern>
          </defs>

          {/* Render Preset-Specific Structural Die Mold Paths from Unified CAD Geometry */}
          {renderDieMoldCAD({
            id: spec.id,
            mode: 'blueprint',
            len,
            wid,
            dep,
          })}
        </svg>

        {/* Dimension Callout Badges */}
        <div className="w-full flex items-center justify-between text-[10px] text-[#6B584D] font-mono mt-2 pt-1 border-t border-[#EADFD5]">
          <span>Length: <strong className="text-[#2B211B]">{len}″</strong></span>
          <span>Width: <strong className="text-[#2B211B]">{wid}″</strong></span>
          <span>Depth: <strong className="text-[#2B211B]">{dep}″</strong></span>
        </div>
      </div>

      {/* Blueprint Legend & Actions */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-3 text-[10px] text-[#6B584D]">
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-[#DC2626]" /> Cut
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 border-t border-dashed border-[#2563EB]" /> Crease
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 border-t border-dotted border-[#EA580C]" /> Perforate
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-[#D97706] opacity-60 rounded-xs" /> Glue
          </span>
        </div>
        <button
          type="button"
          onClick={downloadSvg}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded bg-[#2B211B] text-[#FFFDFC] hover:bg-[#A94F32] transition-colors"
          title="Download vector SVG die mold for print & cutting"
        >
          <FaDownload className="text-[10px]" />
          <span>Export SVG</span>
        </button>
      </div>
    </div>
  );
}
