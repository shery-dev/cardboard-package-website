"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { FaImages, FaTrash, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaRotate } from "react-icons/fa6";
import { IoMdColorPalette } from "react-icons/io";
import classNames from 'classnames';
import { useAppContext } from "@/context/Context";
import { renderDieMoldCAD } from "@/lib/dieMoldGeometry";

const VIEWBOX_WIDTH = 540;
const VIEWBOX_HEIGHT = 440;
const MARGIN = 10;
const ARROW_STEP = 5;

export default function UniversalDieNetContainer() {
  const [selectedItem, setSelectedItem] = useState('color'); // 'color' | 'images'
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState({});
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePositions, setImagePositions] = useState({});
  const [imageSizes, setImageSizes] = useState({});
  const [imageRotations, setImageRotations] = useState({});
  const [applied, setApplied] = useState(false);

  const svgRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const {
    extTexColor,
    sideColors,
    setSideColors,
    selectedColor,
    setSelectedColor,
    setSelectedSide,
    setExtTexImgBlob,
    activeBoxPreset,
    box,
    selectedSize,
  } = useAppContext();

  // Match preset ID by activeBoxPreset or fallback by box modelType
  const presetId = activeBoxPreset?.id || (
    box === 'pizzaBox' ? 'pizzaBox' :
    box === 'shippingBox' ? 'carton' :
    box === 'pizzaSliceBox' ? 'pizzaSlice' :
    box === 'cakeBox' ? 'cakeBox' :
    box === 'kraftPaperBag' ? 'kraftPaper' :
    box === 'toolBox' ? 'toolBox' :
    box === 'giftBox' ? 'giftBox' :
    box === 'ecommerceBox' ? 'ecommerce' :
    box === 'laptopBox' ? 'laptopBox' :
    box === 'flatFolderBox' ? 'flatBox' :
    box === 'foodComboBox' ? 'foodRestaurant' :
    box === 'foodPackagingBox' ? 'foodPackaging' :
    box === 'apparelBox' ? 'apparelBox' :
    box === 'rationBox' ? 'ration' :
    box === 'cubeBox' ? 'cubeBox' :
    box === 'corporateBox' ? 'corporateBox' :
    'mailerBox'
  );

  const len = Number(selectedSize?.length) || activeBoxPreset?.defaultSize?.length || 10;
  const wid = Number(selectedSize?.width) || activeBoxPreset?.defaultSize?.width || 10;
  const dep = Number(selectedSize?.depth) || activeBoxPreset?.defaultSize?.depth || 4;

  // Convert rendered SVG flat die net into 3D texture blob
  const convertSvgToJpg = useCallback(() => {
    const svgElement = svgRef.current;
    const canvas = canvasRef.current;
    if (!svgElement || !canvas) return;

    const ctx = canvas.getContext('2d');
    const exportWidth = 2048;
    const exportHeight = 2048;
    canvas.width = exportWidth;
    canvas.height = exportHeight;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = extTexColor || '#9f6e33';
      ctx.fillRect(0, 0, exportWidth, exportHeight);
      ctx.drawImage(img, 0, 0, exportWidth, exportHeight);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const blobUrl = URL.createObjectURL(blob);
        setExtTexImgBlob(blobUrl);
        URL.revokeObjectURL(url);
      }, 'image/jpeg', 0.95);
    };
    img.src = url;
  }, [extTexColor, setExtTexImgBlob]);

  const applyDesignTo3D = () => {
    setApplied(true);
    convertSvgToJpg();
    setTimeout(() => setApplied(false), 800);
  };

  // Section click for individual panel color selection
  const handleSectionClick = (sideKey) => {
    setSelectedSection(sideKey);
    if (setSelectedSide) setSelectedSide(sideKey);
    if (selectedColor && setSideColors) {
      setSideColors((prev) => ({
        ...prev,
        [sideKey]: selectedColor,
      }));
      setTimeout(() => convertSvgToJpg(), 150);
    }
  };

  // When selected color changes and section is active, apply it
  useEffect(() => {
    if (selectedSection && selectedColor && setSideColors) {
      setSideColors((prev) => {
        if (prev[selectedSection] === selectedColor) return prev;
        return {
          ...prev,
          [selectedSection]: selectedColor,
        };
      });
      setTimeout(() => convertSvgToJpg(), 150);
    }
  }, [selectedColor, selectedSection, setSideColors, convertSvgToJpg]);

  // Image Upload handler
  const handleImageUpload = (event) => {
    setSelectedImage(null);
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const timeInstant = Date.now();
      const key = `img-${timeInstant}`;
      const defaultSize = 110;
      const x = VIEWBOX_WIDTH / 2 - defaultSize / 2;
      const y = VIEWBOX_HEIGHT / 2 - defaultSize / 2;

      setImages((prev) => ({ ...prev, [key]: e.target.result }));
      setImagePositions((prev) => ({ ...prev, [key]: { x, y } }));
      setImageSizes((prev) => ({ ...prev, [key]: { width: defaultSize, height: defaultSize } }));
      setImageRotations((prev) => ({ ...prev, [key]: 0 }));
      setSelectedImage(key);
      event.target.value = null;
      setTimeout(() => convertSvgToJpg(), 250);
    };
    reader.readAsDataURL(file);
  };

  // Drag, Resize, and Rotate Handlers
  const handleMouseDown = (event, id) => {
    if (selectedItem !== 'images') return;
    event.stopPropagation();
    setSelectedImage(id);
    setDragging(true);
    const svgRect = svgRef.current.getBoundingClientRect();
    const scaleX = VIEWBOX_WIDTH / svgRect.width;
    const scaleY = VIEWBOX_HEIGHT / svgRect.height;
    setDragStart({
      x: (event.clientX - svgRect.left) * scaleX - (imagePositions[id]?.x || 0),
      y: (event.clientY - svgRect.top) * scaleY - (imagePositions[id]?.y || 0),
    });
  };

  const handleMouseMove = (event) => {
    if (!selectedImage) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const scaleX = VIEWBOX_WIDTH / svgRect.width;
    const scaleY = VIEWBOX_HEIGHT / svgRect.height;
    const currentX = (event.clientX - svgRect.left) * scaleX;
    const currentY = (event.clientY - svgRect.top) * scaleY;

    if (dragging) {
      const newX = Math.max(MARGIN, Math.min(VIEWBOX_WIDTH - (imageSizes[selectedImage]?.width || 80) - MARGIN, currentX - dragStart.x));
      const newY = Math.max(MARGIN, Math.min(VIEWBOX_HEIGHT - (imageSizes[selectedImage]?.height || 80) - MARGIN, currentY - dragStart.y));
      setImagePositions((prev) => ({
        ...prev,
        [selectedImage]: { x: newX, y: newY },
      }));
    } else if (resizing) {
      const pos = imagePositions[selectedImage];
      if (!pos) return;
      const newWidth = Math.max(30, Math.min(VIEWBOX_WIDTH - pos.x - MARGIN, currentX - pos.x));
      const newHeight = Math.max(30, Math.min(VIEWBOX_HEIGHT - pos.y - MARGIN, currentY - pos.y));
      setImageSizes((prev) => ({
        ...prev,
        [selectedImage]: { width: newWidth, height: newHeight },
      }));
    } else if (rotating) {
      const pos = imagePositions[selectedImage];
      const size = imageSizes[selectedImage];
      if (!pos || !size) return;
      const centerX = pos.x + size.width / 2;
      const centerY = pos.y + size.height / 2;
      const radians = Math.atan2(currentY - centerY, currentX - centerX);
      const degrees = (radians * (180 / Math.PI) + 90) % 360;
      setImageRotations((prev) => ({
        ...prev,
        [selectedImage]: Math.round(degrees),
      }));
    }
  };

  const handleMouseUp = () => {
    if (dragging || resizing || rotating) {
      setTimeout(() => convertSvgToJpg(), 200);
    }
    setDragging(false);
    setResizing(false);
    setRotating(false);
  };

  const deleteSelectedImage = () => {
    if (!selectedImage) return;
    const id = selectedImage;
    setImages((prev) => { const n = { ...prev }; delete n[id]; return n; });
    setImagePositions((prev) => { const n = { ...prev }; delete n[id]; return n; });
    setImageSizes((prev) => { const n = { ...prev }; delete n[id]; return n; });
    setImageRotations((prev) => { const n = { ...prev }; delete n[id]; return n; });
    setSelectedImage(null);
    setTimeout(() => convertSvgToJpg(), 200);
  };

  const handleArrowMove = (dx, dy) => {
    if (!selectedImage) return;
    const pos = imagePositions[selectedImage] || { x: 0, y: 0 };
    const size = imageSizes[selectedImage] || { width: 100, height: 100 };
    const newX = Math.max(MARGIN, Math.min(VIEWBOX_WIDTH - size.width - MARGIN, pos.x + dx));
    const newY = Math.max(MARGIN, Math.min(VIEWBOX_HEIGHT - size.height - MARGIN, pos.y + dy));
    setImagePositions((prev) => ({ ...prev, [selectedImage]: { x: newX, y: newY } }));
    setTimeout(() => convertSvgToJpg(), 200);
  };

  // Helper to color each panel
  const getPanelFill = (sideKey) => {
    return sideColors[sideKey] || extTexColor || '#E8DCCF';
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Mode Switcher: Color Panel vs Add Images */}
      <div className="flex bg-[#F7F3ED] rounded-lg border border-[#DCCFC2] p-1">
        <button
          type="button"
          onClick={() => setSelectedItem('color')}
          className={classNames(
            'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all',
            selectedItem === 'color' ? 'bg-[#2B211B] text-[#FFFDFC] shadow-xs' : 'text-[#6B584D] hover:text-[#2B211B]'
          )}
        >
          <IoMdColorPalette className="text-sm" />
          <span>Panel Colors</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedItem('images')}
          className={classNames(
            'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all',
            selectedItem === 'images' ? 'bg-[#2B211B] text-[#FFFDFC] shadow-xs' : 'text-[#6B584D] hover:text-[#2B211B]'
          )}
        >
          <FaImages className="text-sm" />
          <span>Add Images & Logos</span>
        </button>
      </div>

      {/* Sub-toolbar */}
      {selectedItem === 'images' ? (
        <div className="flex flex-col gap-2 p-2.5 bg-[#FAF8F5] rounded-md border border-[#DCCFC2]">
          <div className="flex items-center justify-between gap-2">
            <label className="cursor-pointer px-3 py-1.5 text-xs font-bold rounded bg-[#2B211B] text-[#FFFDFC] hover:bg-[#A94F32] transition-colors">
              <span>+ Upload Logo / Artwork</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {selectedImage && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleArrowMove(-ARROW_STEP, 0)}
                  className="p-1.5 rounded border border-gray-300 bg-white hover:bg-gray-100 text-gray-700"
                  title="Move Left"
                >
                  <FaArrowLeft className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleArrowMove(0, -ARROW_STEP)}
                  className="p-1.5 rounded border border-gray-300 bg-white hover:bg-gray-100 text-gray-700"
                  title="Move Up"
                >
                  <FaArrowUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleArrowMove(0, ARROW_STEP)}
                  className="p-1.5 rounded border border-gray-300 bg-white hover:bg-gray-100 text-gray-700"
                  title="Move Down"
                >
                  <FaArrowDown className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleArrowMove(ARROW_STEP, 0)}
                  className="p-1.5 rounded border border-gray-300 bg-white hover:bg-gray-100 text-gray-700"
                  title="Move Right"
                >
                  <FaArrowRight className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={deleteSelectedImage}
                  className="flex items-center gap-1 px-2 py-1 rounded border border-red-300 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold ml-1"
                >
                  <FaTrash className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
          <p className="text-[10px] text-gray-500">
            Drag image to position on the die net. Blue corner squares resize; red circle rotates.
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-2 bg-[#FAF8F5] rounded-md border border-[#DCCFC2] text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#6B584D]">Click any panel on the die below to paint:</span>
            {selectedSection && (
              <span className="font-bold text-[#A94F32] uppercase text-[10px] bg-white px-2 py-0.5 rounded border border-[#DCCFC2]">
                {selectedSection}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={applyDesignTo3D}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded bg-[#15803D] text-white hover:bg-[#166534] transition-colors shadow-xs"
            title="Update 3D model with customized die net"
          >
            <span>{applied ? "Applying..." : "Apply to 3D"}</span>
          </button>
        </div>
      )}

      {/* Unfolded Flat Die Net SVG Canvas */}
      <div
        ref={containerRef}
        className="relative w-full bg-[#FAF8F5] rounded-md border-2 border-dashed border-[#DCCFC2] p-1 flex flex-col items-center overflow-hidden"
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="w-full h-auto max-h-[360px] drop-shadow-sm select-none"
          xmlns="http://www.w3.org/2000/svg"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={() => { if (selectedItem === 'images') setSelectedImage(null); }}
        >
          {/* Render Active Preset's Authentic Unfolded CAD Flat Die Net */}
          {renderDieMoldCAD({
            id: presetId,
            mode: 'interactive',
            onClick: handleSectionClick,
            getFill: getPanelFill,
            activeSection: selectedSection,
            len,
            wid,
            dep,
          })}

          {/* User-uploaded images placed on the die */}
          {Object.keys(images).map((key) => {
            const pos = imagePositions[key] || { x: 0, y: 0 };
            const size = imageSizes[key] || { width: 100, height: 100 };
            const rot = imageRotations[key] || 0;
            const cx = pos.x + size.width / 2;
            const cy = pos.y + size.height / 2;

            return (
              <g key={key}>
                <image
                  href={images[key]}
                  x={pos.x}
                  y={pos.y}
                  width={size.width}
                  height={size.height}
                  transform={`rotate(${rot}, ${cx}, ${cy})`}
                  onMouseDown={(e) => handleMouseDown(e, key)}
                  className="cursor-move"
                />
                {selectedItem === 'images' && selectedImage === key && (
                  <g transform={`rotate(${rot}, ${cx}, ${cy})`}>
                    {/* Bounding box outline */}
                    <rect
                      x={pos.x}
                      y={pos.y}
                      width={size.width}
                      height={size.height}
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                    {/* Resize handle bottom-right */}
                    <rect
                      x={pos.x + size.width - 6}
                      y={pos.y + size.height - 6}
                      width="12"
                      height="12"
                      fill="#2563EB"
                      cursor="nwse-resize"
                      onMouseDown={(e) => { e.stopPropagation(); setResizing(true); }}
                    />
                    {/* Rotate handle top center */}
                    <circle
                      cx={cx}
                      cy={pos.y - 14}
                      r="7"
                      fill="#DC2626"
                      cursor="crosshair"
                      onMouseDown={(e) => { e.stopPropagation(); setRotating(true); }}
                    />
                    <line x1={cx} y1={pos.y} x2={cx} y2={pos.y - 14} stroke="#DC2626" strokeWidth="1" />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Die Dimensions Callout */}
        <div className="w-full flex items-center justify-between text-[10px] text-[#6B584D] font-mono mt-1 pt-1 border-t border-[#EADFD5]">
          <span>Length: <strong className="text-[#2B211B]">{len}″</strong></span>
          <span>Width: <strong className="text-[#2B211B]">{wid}″</strong></span>
          <span>Depth: <strong className="text-[#2B211B]">{dep}″</strong></span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-gray-500 px-1">
        <span>Click <strong>Apply to 3D</strong> to see customized die wrapped onto the 3D preview.</span>
      </div>

      {/* Hidden 2D Canvas for High-Res Texture Export */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
