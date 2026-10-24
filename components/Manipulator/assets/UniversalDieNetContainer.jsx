"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { FaImages, FaTrash, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaRotate, FaFont, FaDownload } from "react-icons/fa6";
import { IoMdColorPalette } from "react-icons/io";
import classNames from 'classnames';
import { useAppContext } from "@/context/Context";
import { renderDieMoldCAD } from "@/lib/dieMoldGeometry";

const VIEWBOX_WIDTH = 540;
const VIEWBOX_HEIGHT = 440;
const MARGIN = 10;
const ARROW_STEP = 5;

const PACKAGING_FONTS = [
  { label: 'DM Sans (Modern UI)', value: 'DM Sans, sans-serif' },
  { label: 'Newsreader (Editorial Serif)', value: 'Newsreader, serif' },
  { label: 'Impact (Heavy Bold)', value: 'Impact, sans-serif' },
  { label: 'Courier (Technical Monospace)', value: 'Courier New, monospace' },
  { label: 'Arial (Clean Neutral)', value: 'Arial, sans-serif' },
];

export default function UniversalDieNetContainer({ activeTool, isFullCanvas = false }) {
  const [selectedItem, setSelectedItem] = useState(activeTool || 'color'); // 'color' | 'images' | 'text'
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [newTextString, setNewTextString] = useState('BRAND LOGO');
  const [selectedFont, setSelectedFont] = useState(PACKAGING_FONTS[0].value);
  const [selectedFontSize, setSelectedFontSize] = useState(22);
  const [selectedTextColor, setSelectedTextColor] = useState('#2B211B');
  const [isBold, setIsBold] = useState(true);
  const [isItalic, setIsItalic] = useState(false);

  const [dragging, setDragging] = useState(false);
  const [textDragging, setTextDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [textDragStart, setTextDragStart] = useState({ x: 0, y: 0 });
  const [applied, setApplied] = useState(false);

  const svgRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const {
    extTexColor,
    setExtTexColor,
    sideColors,
    setSideColors,
    selectedColor,
    setSelectedColor,
    setSelectedSide,
    setExtTexImgBlob,
    activeBoxPreset,
    box,
    selectedSize,
    images,
    setImages,
    imagePositions,
    setImagePositions,
    imageSizes,
    setImageSizes,
    imageRotations,
    setImageRotations,
    textElements,
    setTextElements,
    viewMode,
    setViewMode,
  } = useAppContext();

  useEffect(() => {
    if (activeTool) {
      setSelectedItem(activeTool);
    }
  }, [activeTool]);

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

    // Clone SVG and hide technical text/measurements while preserving user typography
    const clonedSvg = svgElement.cloneNode(true);
    clonedSvg.setAttribute('width', String(exportWidth));
    clonedSvg.setAttribute('height', String(exportHeight));
    clonedSvg.querySelectorAll('text:not(.user-custom-text)').forEach((t) => (t.style.display = 'none'));
    clonedSvg.querySelectorAll('line').forEach((l) => (l.style.display = 'none'));

    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, exportWidth, exportHeight);
      ctx.fillStyle = extTexColor || '#C7A882';
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
    // Always rasterize 2D SVG canvas into 3D image blob so multi-colored panels, images, and text all project directly to 3D
    convertSvgToJpg();
    setTimeout(() => setApplied(false), 800);
  };

  const handleDownloadSVG = () => {
    const svgElement = svgRef.current;
    if (!svgElement) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElement);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${presetId}-${len}x${wid}x${dep}-packlane-dieline.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Section click selects the face and tells 3D camera to focus smoothly on that face WITHOUT changing colors
  const handleSectionClick = (sideKey) => {
    setSelectedSection(sideKey);
    if (setSelectedSide) {
      setSelectedSide(null);
      setTimeout(() => setSelectedSide(sideKey), 10);
    }
  };

  // Explicit user color pick for the active panel (supports multi-color panel designs)
  const handleColorPick = (color) => {
    const targetSection = selectedSection || 'top';
    if (!selectedSection) setSelectedSection('top');
    if (setSideColors) {
      setSideColors((prev) => ({
        ...prev,
        [targetSection]: color,
      }));
    }
    if (setSelectedColor) setSelectedColor(color);
    // Regenerate 3D texture blob with the updated panel colors
    setTimeout(() => convertSvgToJpg(), 80);
  };

  // Apply color to all faces of the box at once
  const handleApplyColorToAll = (color) => {
    if (setExtTexColor) setExtTexColor(color);
    if (setSelectedColor) setSelectedColor(color);
    if (setSideColors) {
      setSideColors((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          next[k] = color;
        });
        next.top = color;
        next.lidFront = color;
        next.lid = color;
        next.front = color;
        next.back = color;
        next.left = color;
        next.right = color;
        next.bottom = color;
        next.lidTop = color;
        next.lidRight = color;
        next.lidLeft = color;
        next.bottomFront = color;
        next.bottomBack = color;
        next.bottomLeft = color;
        next.bottomRight = color;
        return next;
      });
    }
    // Regenerate 3D texture blob with the uniform color across all panels
    setTimeout(() => convertSvgToJpg(), 80);
  };

  const handleResetPanelColor = () => {
    if (!selectedSection) return;
    const defaultColor = extTexColor || '#C7A882';
    if (setSideColors) {
      setSideColors((prev) => ({
        ...prev,
        [selectedSection]: defaultColor,
      }));
    }
    setTimeout(() => convertSvgToJpg(), 80);
  };

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

  // Custom Text handlers
  const handleAddText = () => {
    const id = `txt-${Date.now()}`;
    const x = VIEWBOX_WIDTH / 2;
    const y = VIEWBOX_HEIGHT / 2;
    if (setTextElements) {
      setTextElements((prev) => ({
        ...prev,
        [id]: {
          id,
          text: newTextString || 'BRAND TEXT',
          x,
          y,
          fontSize: selectedFontSize,
          fontFamily: selectedFont,
          color: selectedTextColor,
          isBold,
          isItalic,
          rotation: 0,
        },
      }));
    }
    setSelectedTextId(id);
    setSelectedImage(null);
    setSelectedItem('text');
    setTimeout(() => convertSvgToJpg(), 250);
  };

  const updateSelectedText = (updates) => {
    if (!selectedTextId || !setTextElements) return;
    setTextElements((prev) => ({
      ...prev,
      [selectedTextId]: {
        ...prev[selectedTextId],
        ...updates,
      },
    }));
    setTimeout(() => convertSvgToJpg(), 200);
  };

  const handleDeleteText = () => {
    if (!selectedTextId || !setTextElements) return;
    const id = selectedTextId;
    setTextElements((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
    setSelectedTextId(null);
    setTimeout(() => convertSvgToJpg(), 200);
  };

  const handleTextRotate = (degrees) => {
    if (!selectedTextId || !setTextElements || !textElements[selectedTextId]) return;
    const current = textElements[selectedTextId].rotation || 0;
    updateSelectedText({ rotation: (current + degrees) % 360 });
  };

  // Drag, Resize, and Rotate Handlers for Images
  const handleMouseDown = (event, id) => {
    if (selectedItem !== 'images') return;
    event.stopPropagation();
    setSelectedImage(id);
    setSelectedTextId(null);
    setDragging(true);
    const svgRect = svgRef.current.getBoundingClientRect();
    const scaleX = VIEWBOX_WIDTH / svgRect.width;
    const scaleY = VIEWBOX_HEIGHT / svgRect.height;
    setDragStart({
      x: (event.clientX - svgRect.left) * scaleX - (imagePositions[id]?.x || 0),
      y: (event.clientY - svgRect.top) * scaleY - (imagePositions[id]?.y || 0),
    });
  };

  // Drag Handler for Text
  const handleTextMouseDown = (event, id) => {
    event.stopPropagation();
    setSelectedTextId(id);
    setSelectedImage(null);
    setSelectedItem('text');
    setTextDragging(true);
    const svgRect = svgRef.current.getBoundingClientRect();
    const scaleX = VIEWBOX_WIDTH / svgRect.width;
    const scaleY = VIEWBOX_HEIGHT / svgRect.height;
    setTextDragStart({
      x: (event.clientX - svgRect.left) * scaleX - (textElements[id]?.x || 0),
      y: (event.clientY - svgRect.top) * scaleY - (textElements[id]?.y || 0),
    });
  };

  const handleMouseMove = (event) => {
    const svgRect = svgRef?.current?.getBoundingClientRect();
    if (!svgRect) return;
    const scaleX = VIEWBOX_WIDTH / svgRect.width;
    const scaleY = VIEWBOX_HEIGHT / svgRect.height;
    const currentX = (event.clientX - svgRect.left) * scaleX;
    const currentY = (event.clientY - svgRect.top) * scaleY;

    if (textDragging && selectedTextId && setTextElements) {
      const newX = Math.max(MARGIN, Math.min(VIEWBOX_WIDTH - MARGIN, currentX - textDragStart.x));
      const newY = Math.max(MARGIN, Math.min(VIEWBOX_HEIGHT - MARGIN, currentY - textDragStart.y));
      setTextElements((prev) => ({
        ...prev,
        [selectedTextId]: { ...prev[selectedTextId], x: Math.round(newX), y: Math.round(newY) },
      }));
      return;
    }

    if (!selectedImage) return;

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
    if (dragging || resizing || rotating || textDragging) {
      setTimeout(() => convertSvgToJpg(), 200);
    }
    setDragging(false);
    setTextDragging(false);
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
    if (selectedItem === 'text' && selectedTextId) {
      const current = textElements[selectedTextId];
      if (!current) return;
      updateSelectedText({ x: current.x + dx, y: current.y + dy });
      return;
    }
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

  const activeTextObj = selectedTextId && textElements ? textElements[selectedTextId] : null;

  return (
    <div className={`w-full flex flex-col gap-2 ${isFullCanvas ? 'h-full' : ''}`}>
      {/* Packlane-Style Mode Switcher */}
      <div className="flex bg-[#F7F3ED] rounded-lg border border-[#DCCFC2] p-1 gap-1 shrink-0">
        <button
          type="button"
          onClick={() => setSelectedItem('color')}
          className={classNames(
            'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all',
            selectedItem === 'color' ? 'bg-[#2B211B] text-[#FFFDFC] shadow-xs' : 'text-[#6B584D] hover:text-[#2B211B]'
          )}
        >
          <IoMdColorPalette className="text-sm" />
          <span>Colors</span>
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
          <span>Logos / Art</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedItem('text')}
          className={classNames(
            'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-md transition-all',
            selectedItem === 'text' ? 'bg-[#2B211B] text-[#FFFDFC] shadow-xs' : 'text-[#6B584D] hover:text-[#2B211B]'
          )}
        >
          <FaFont className="text-sm" />
          <span>Add Text</span>
        </button>
        {isFullCanvas && (
          <button
            type="button"
            onClick={handleDownloadSVG}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md bg-white border border-[#DCCFC2] text-[#2B211B] hover:bg-[#F2ECE4] shadow-2xs"
            title="Download Vector CAD Dieline SVG"
          >
            <FaDownload className="text-xs" />
            <span className="hidden sm:inline">Export Dieline</span>
          </button>
        )}
      </div>

      {/* Sub-toolbars by Selected Mode */}
      {selectedItem === 'images' && (
        <div className="flex flex-col gap-2 p-2.5 bg-[#FAF8F5] rounded-md border border-[#DCCFC2] shrink-0 text-xs">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <label className="cursor-pointer px-3 py-1.5 text-xs font-bold rounded bg-[#2B211B] text-[#FFFDFC] hover:bg-[#A94F32] transition-colors shadow-xs">
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
            <button
              type="button"
              onClick={applyDesignTo3D}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded bg-[#15803D] text-white hover:bg-[#166534] transition-colors shadow-xs ml-auto"
            >
              <span>{applied ? "Applied!" : "Apply to 3D"}</span>
            </button>
          </div>
          <p className="text-[10px] text-[#6B584D]">
            Drag logo onto any panel of the unfolded box net. Blue handles resize; red circle rotates.
          </p>
        </div>
      )}

      {selectedItem === 'text' && (
        <div className="flex flex-col gap-2 p-2.5 bg-[#FAF8F5] rounded-md border border-[#DCCFC2] shrink-0 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="text"
              value={activeTextObj ? activeTextObj.text : newTextString}
              onChange={(e) => {
                const val = e.target.value;
                if (activeTextObj) updateSelectedText({ text: val });
                else setNewTextString(val);
              }}
              placeholder="Enter packaging text..."
              className="px-2.5 py-1 text-xs border border-[#DCCFC2] rounded-md bg-white text-[#2B211B] font-medium flex-1 min-w-[140px]"
            />
            <select
              value={activeTextObj ? activeTextObj.fontFamily : selectedFont}
              onChange={(e) => {
                const val = e.target.value;
                if (activeTextObj) updateSelectedText({ fontFamily: val });
                else setSelectedFont(val);
              }}
              className="px-2 py-1 text-xs border border-[#DCCFC2] rounded-md bg-white text-[#2B211B]"
            >
              {PACKAGING_FONTS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-[#6B584D]">Size:</span>
              <input
                type="number"
                min="10"
                max="60"
                value={activeTextObj ? activeTextObj.fontSize : selectedFontSize}
                onChange={(e) => {
                  const val = Number(e.target.value) || 20;
                  if (activeTextObj) updateSelectedText({ fontSize: val });
                  else setSelectedFontSize(val);
                }}
                className="w-12 px-1 py-1 text-xs border border-[#DCCFC2] rounded-md bg-white text-center font-mono"
              />
            </div>
            <input
              type="color"
              value={activeTextObj ? activeTextObj.color : selectedTextColor}
              onChange={(e) => {
                const val = e.target.value;
                if (activeTextObj) updateSelectedText({ color: val });
                else setSelectedTextColor(val);
              }}
              title="Font Color"
              className="w-6 h-6 p-0 border border-gray-300 rounded cursor-pointer bg-transparent"
            />
            {!activeTextObj ? (
              <button
                type="button"
                onClick={handleAddText}
                className="px-3 py-1 text-xs font-bold rounded bg-[#2B211B] text-[#FFFDFC] hover:bg-[#A94F32] transition-colors shadow-xs"
              >
                + Add Text
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleTextRotate(90)}
                  className="p-1.5 rounded border border-gray-300 bg-white hover:bg-gray-100 text-gray-700"
                  title="Rotate 90°"
                >
                  <FaRotate className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={handleDeleteText}
                  className="p-1.5 rounded border border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
                  title="Delete Text"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTextId(null)}
                  className="text-[10px] text-[#6B584D] hover:underline px-1"
                >
                  Deselect
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={applyDesignTo3D}
              className="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded bg-[#15803D] text-white hover:bg-[#166534] transition-colors shadow-xs ml-auto"
            >
              <span>{applied ? "Applied!" : "Apply to 3D"}</span>
            </button>
          </div>
        </div>
      )}

      {selectedItem === 'color' && (
        <div className="flex flex-col gap-2 p-2 bg-[#FAF8F5] rounded-md border border-[#DCCFC2] text-xs shrink-0">
          <div className="flex items-center justify-between gap-1 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#6B584D]">Active Panel:</span>
              <span className="font-bold text-[#2B211B] uppercase text-[10px] bg-white px-2 py-0.5 rounded border border-[#DCCFC2]">
                {selectedSection || "Click any face below"}
              </span>
            </div>
            {selectedSection && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyColorToAll(sideColors[selectedSection] || '#C7A882')}
                  className="text-[10px] text-[#15803D] hover:underline font-bold"
                  title="Apply current panel's color across the whole box"
                >
                  Apply to All Panels
                </button>
                <button
                  type="button"
                  onClick={handleResetPanelColor}
                  className="text-[10px] text-[#A94F32] hover:underline font-semibold"
                >
                  Reset Color
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={applyDesignTo3D}
              className="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded bg-[#15803D] text-white hover:bg-[#166534] transition-colors shadow-xs ml-auto"
              title="Update 3D model with customized die net"
            >
              <span>{applied ? "Applied!" : "Apply to 3D"}</span>
            </button>
          </div>

          {/* Color Palette Swatches */}
          <div className="flex items-center gap-1.5 pt-1 border-t border-[#EADFD5]">
            <span className="text-[10px] text-[#6B584D] font-bold">
              {selectedSection ? `Color (${selectedSection}):` : "Box Color:"}
            </span>
            <div className="flex items-center gap-1 flex-wrap">
              {[
                { name: 'Kraft', hex: '#C7A882' },
                { name: 'White', hex: '#FFFFFF' },
                { name: 'Black', hex: '#212121' },
                { name: 'Terracotta', hex: '#A94F32' },
                { name: 'Forest', hex: '#15803D' },
                { name: 'Navy', hex: '#1E3A8A' },
                { name: 'Red', hex: '#DC2626' },
                { name: 'Amber', hex: '#D97706' },
              ].map((swatch) => (
                <button
                  key={swatch.name}
                  type="button"
                  onClick={() => {
                    if (selectedSection) {
                      handleColorPick(swatch.hex);
                    } else {
                      handleApplyColorToAll(swatch.hex);
                    }
                  }}
                  title={swatch.name}
                  className="w-5 h-5 rounded-full border border-gray-300 shadow-xs hover:scale-110 transition-transform"
                  style={{ backgroundColor: swatch.hex }}
                />
              ))}
              {/* Custom Color Input */}
              <input
                type="color"
                title="Custom Hex Color"
                value={(selectedSection ? sideColors[selectedSection] : extTexColor) || "#C7A882"}
                onChange={(e) => {
                  if (selectedSection) {
                    handleColorPick(e.target.value);
                  } else {
                    handleApplyColorToAll(e.target.value);
                  }
                }}
                className="w-6 h-6 p-0 border border-gray-300 rounded cursor-pointer bg-transparent"
              />
              <button
                type="button"
                onClick={() => handleApplyColorToAll((selectedSection ? sideColors[selectedSection] : extTexColor) || '#C7A882')}
                className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#2B211B] text-[#FFFDFC] hover:bg-[#A94F32] transition-colors ml-1"
                title="Apply color across all faces of the box"
              >
                All Panels
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unfolded Flat Die Net SVG Canvas */}
      <div
        ref={containerRef}
        className={`relative w-full bg-[#FAF8F5] rounded-md border-2 border-dashed border-[#DCCFC2] p-2 flex flex-col items-center justify-center overflow-hidden ${
          isFullCanvas ? 'flex-1 min-h-0' : ''
        }`}
      >
        <svg
          id="universal-die-net-svg"
          ref={svgRef}
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className={`w-full drop-shadow-sm select-none ${
            isFullCanvas ? 'h-full max-h-[82vh] object-contain' : 'h-auto max-h-[380px]'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={() => {
            if (selectedItem === 'images') setSelectedImage(null);
            if (selectedItem === 'text') setSelectedTextId(null);
          }}
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
          {Object.keys(images || {}).map((key) => {
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

          {/* User-added Custom Typography Text Elements */}
          {Object.keys(textElements || {}).map((key) => {
            const t = textElements[key];
            if (!t) return null;
            const isSelected = selectedItem === 'text' && selectedTextId === key;
            return (
              <g
                key={key}
                transform={`rotate(${t.rotation || 0}, ${t.x}, ${t.y})`}
                onMouseDown={(e) => handleTextMouseDown(e, key)}
                className="cursor-move select-none"
              >
                <text
                  x={t.x}
                  y={t.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={t.fontSize || 20}
                  fontFamily={t.fontFamily || 'sans-serif'}
                  fontWeight={t.isBold ? 'bold' : 'normal'}
                  fontStyle={t.isItalic ? 'italic' : 'normal'}
                  fill={t.color || '#2B211B'}
                  className="user-custom-text pointer-events-auto"
                >
                  {t.text}
                </text>
                {isSelected && (
                  <rect
                    x={t.x - (t.text.length * (t.fontSize || 20) * 0.32) - 8}
                    y={t.y - (t.fontSize || 20) * 0.65 - 4}
                    width={t.text.length * (t.fontSize || 20) * 0.64 + 16}
                    height={(t.fontSize || 20) * 1.3 + 8}
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    pointerEvents="none"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Die Dimensions Callout & Legend */}
        <div className="w-full flex items-center justify-between text-[10px] text-[#6B584D] font-mono mt-1 pt-1 border-t border-[#EADFD5] shrink-0">
          <div className="flex items-center gap-3">
            <span>Length: <strong className="text-[#2B211B]">{len}″</strong></span>
            <span>Width: <strong className="text-[#2B211B]">{wid}″</strong></span>
            <span>Depth: <strong className="text-[#2B211B]">{dep}″</strong></span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[9px]">
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-[#DC2626]" /> Cut
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-[#2563EB] border-b border-dashed" /> Crease
            </span>
          </div>
        </div>
      </div>

      {/* Hidden 2D Canvas for High-Res Texture Export */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
