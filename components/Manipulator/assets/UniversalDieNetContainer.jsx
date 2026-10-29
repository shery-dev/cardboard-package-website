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
  const imageObjectsRef = useRef(new Map());
  const currentBlobUrlRef = useRef(null);

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

  const getInitialPositionForSection = (section) => {
    switch (section) {
      case 'top':
      case 'lid':
      case 'lidTop':
      case 'lidFront':
        return presetId === 'pizzaSlice' ? { x: 270, y: 150 } : { x: 270, y: 90 };
      case 'front':
        return presetId === 'ration' || presetId === 'carton' ? { x: 210, y: 190 } : { x: 270, y: 330 };
      case 'back':
        return presetId === 'ration' || presetId === 'carton' ? { x: 450, y: 190 } : { x: 270, y: 165 };
      case 'left':
        return presetId === 'ration' || presetId === 'carton' ? { x: 90, y: 190 } : { x: 130, y: 240 };
      case 'right':
        return presetId === 'ration' || presetId === 'carton' ? { x: 330, y: 190 } : { x: 410, y: 240 };
      case 'bottom':
        return presetId === 'pizzaSlice' ? { x: 270, y: 320 } : { x: 270, y: 250 };
      default:
        return presetId === 'pizzaSlice' ? { x: 270, y: 150 } : { x: 270, y: 90 };
    }
  };

  // Convert rendered flat die net into exact 3D texture blob with 1:1 UV alignment
  const convertSvgToJpg = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const baseColor = extTexColor || '#C7A882';
    const hasArt = (images && Object.keys(images).length > 0) || (textElements && Object.keys(textElements).length > 0);

    // 1. Mailer Box: exact square 2048x2048 unwrap matching MailerBox.glb UVs (245.76 square space)
    if (presetId === 'mailerBox') {
      const exportWidth = 2048;
      const exportHeight = 2048;
      canvas.width = exportWidth;
      canvas.height = exportHeight;

      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, exportWidth, exportHeight);

      const scale = exportWidth / 245.76;
      const MAILER_UV_BOUNDS = {
        lidFront: { x: 98.81, y: 2.61, width: 48.1, height: 47.59 },
        top: { x: 98.81, y: 52.44, width: 48.1, height: 44.54 },
        back: { x: 98.81, y: 101.66, width: 48.1, height: 43.73 },
        bottom: { x: 98.81, y: 148.24, width: 48.1, height: 46.07 },
        front: { x: 98.81, y: 196.24, width: 48.1, height: 45.56 },
        left: { x: 147.93, y: 148.24, width: 48.97, height: 45.81 },
        right: { x: 45.58, y: 148.24, width: 51.71, height: 46.07 },
      };

      Object.entries(MAILER_UV_BOUNDS).forEach(([key, b]) => {
        const color = sideColors[key] || baseColor;
        ctx.fillStyle = color;
        ctx.fillRect(
          Math.floor(b.x * scale) - 1,
          Math.floor(b.y * scale) - 1,
          Math.ceil(b.width * scale) + 2,
          Math.ceil(b.height * scale) + 2
        );
      });

      const mapMailerCoords = (cx, cy, w, h) => {
        if (cx >= 190 && cx <= 350 && cy >= 40 && cy <= 140) {
          const rx = (cx - 190) / 160;
          const ry = (cy - 40) / 100;
          return {
            x: (98.81 + rx * 48.1) * scale,
            y: (52.44 + ry * 44.54) * scale,
            w: (w / 160) * 48.1 * scale,
            h: (h / 100) * 44.54 * scale,
          };
        } else if (cx >= 190 && cx <= 350 && cy >= 190 && cy <= 310) {
          const rx = (cx - 190) / 160;
          const ry = (cy - 190) / 120;
          return {
            x: (98.81 + rx * 48.1) * scale,
            y: (148.24 + ry * 46.07) * scale,
            w: (w / 160) * 48.1 * scale,
            h: (h / 120) * 46.07 * scale,
          };
        } else if (cx >= 190 && cx <= 350 && cy >= 310 && cy <= 360) {
          const rx = (cx - 190) / 160;
          const ry = (cy - 310) / 50;
          return {
            x: (98.81 + rx * 48.1) * scale,
            y: (196.24 + ry * 45.56) * scale,
            w: (w / 160) * 48.1 * scale,
            h: (h / 50) * 45.56 * scale,
          };
        } else if (cx >= 190 && cx <= 350 && cy >= 140 && cy <= 190) {
          const rx = (cx - 190) / 160;
          const ry = (cy - 140) / 50;
          return {
            x: (98.81 + rx * 48.1) * scale,
            y: (101.66 + ry * 43.73) * scale,
            w: (w / 160) * 48.1 * scale,
            h: (h / 50) * 43.73 * scale,
          };
        } else if (cx >= 350 && cx <= 430 && cy >= 190 && cy <= 310) {
          const rx = (cx - 350) / 80;
          const ry = (cy - 190) / 120;
          return {
            x: (147.93 + rx * 48.97) * scale,
            y: (148.24 + ry * 45.81) * scale,
            w: (w / 80) * 48.97 * scale,
            h: (h / 120) * 45.81 * scale,
          };
        } else if (cx >= 110 && cx <= 190 && cy >= 190 && cy <= 310) {
          const rx = (cx - 110) / 80;
          const ry = (cy - 190) / 120;
          return {
            x: (45.58 + rx * 51.71) * scale,
            y: (148.24 + ry * 46.07) * scale,
            w: (w / 80) * 51.71 * scale,
            h: (h / 120) * 46.07 * scale,
          };
        }
        return {
          x: (cx / 540) * exportWidth,
          y: (cy / 440) * exportHeight,
          w: (w / 540) * exportWidth,
          h: (h / 440) * exportHeight,
        };
      };

      if (images && Object.keys(images).length > 0) {
        Object.keys(images).forEach((k) => {
          const imgObj = imageObjectsRef.current.get(k);
          if (!imgObj || !imgObj.complete || !imgObj.naturalWidth) return;
          const pos = imagePositions[k] || { x: 0, y: 0 };
          const size = imageSizes[k] || { width: 100, height: 100 };
          const rot = imageRotations[k] || 0;
          const mapped = mapMailerCoords(pos.x + size.width / 2, pos.y + size.height / 2, size.width, size.height);
          ctx.save();
          ctx.translate(mapped.x, mapped.y);
          ctx.rotate((rot * Math.PI) / 180);
          ctx.drawImage(imgObj, -mapped.w / 2, -mapped.h / 2, mapped.w, mapped.h);
          ctx.restore();
        });
      }

      if (textElements && Object.keys(textElements).length > 0) {
        Object.values(textElements).forEach((t) => {
          if (!t || !t.text) return;
          const mapped = mapMailerCoords(t.x, t.y, 100, 100);
          ctx.save();
          ctx.translate(mapped.x, mapped.y);
          ctx.rotate(((t.rotation || 0) * Math.PI) / 180);
          const fontSize = Math.round((t.fontSize || 20) * (scale / 2.5));
          ctx.font = `${t.isItalic ? 'italic ' : ''}${t.isBold ? 'bold ' : ''}${fontSize}px ${t.fontFamily || 'sans-serif'}`;
          ctx.fillStyle = t.color || '#2B211B';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(t.text, 0, 0);
          ctx.restore();
        });
      }

      canvas.toBlob((blob) => {
        if (!blob) return;
        const blobUrl = URL.createObjectURL(blob);
        if (currentBlobUrlRef.current) URL.revokeObjectURL(currentBlobUrlRef.current);
        currentBlobUrlRef.current = blobUrl;
        setExtTexImgBlob(blobUrl);
      }, 'image/jpeg', 0.95);
      return;
    }

    // 2. Pizza Box: 215.7 x 396 unwrap
    if (presetId === 'pizzaBox') {
      const exportWidth = 2048;
      const exportHeight = 3760;
      canvas.width = exportWidth;
      canvas.height = exportHeight;

      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, exportWidth, exportHeight);

      const scaleX = exportWidth / 215.7;
      const scaleY = exportHeight / 396;
      const PIZZA_UV_BOUNDS = {
        top: { x: 11.05, y: 29.32, width: 191.59, height: 149.69 },
        bottom: { x: 11.05, y: 215.22, width: 189.15, height: 148.88 },
        lidFront: { x: 11.05, y: 0, width: 191.59, height: 26.47 },
        back: { x: 14.31, y: 181.46, width: 183.86, height: 30.92 },
        front: { x: 28.14, y: 365.73, width: 158.09, height: 30.27 },
        right: { x: 202.64, y: 215.22, width: 13.07, height: 148.88 },
        left: { x: 0, y: 215.22, width: 9.02, height: 148.88 },
      };

      Object.entries(PIZZA_UV_BOUNDS).forEach(([key, b]) => {
        const color = sideColors[key] || baseColor;
        ctx.fillStyle = color;
        ctx.fillRect(
          Math.floor(b.x * scaleX) - 1,
          Math.floor(b.y * scaleY) - 1,
          Math.ceil(b.width * scaleX) + 2,
          Math.ceil(b.height * scaleY) + 2
        );
      });

      const mapPizzaCoords = (cx, cy, w, h) => {
        if (cx >= 170 && cx <= 370 && cy >= 30 && cy <= 190) {
          const rx = (cx - 170) / 200;
          const ry = (cy - 30) / 160;
          return {
            x: (11.05 + rx * 191.59) * scaleX,
            y: (29.32 + ry * 149.69) * scaleY,
            w: (w / 200) * 191.59 * scaleX,
            h: (h / 160) * 149.69 * scaleY,
          };
        } else if (cx >= 170 && cx <= 370 && cy >= 220 && cy <= 380) {
          const rx = (cx - 170) / 200;
          const ry = (cy - 220) / 160;
          return {
            x: (11.05 + rx * 189.15) * scaleX,
            y: (215.22 + ry * 148.88) * scaleY,
            w: (w / 200) * 189.15 * scaleX,
            h: (h / 160) * 148.88 * scaleY,
          };
        } else if (cx >= 170 && cx <= 370 && cy >= 380 && cy <= 420) {
          const rx = (cx - 170) / 200;
          const ry = (cy - 380) / 40;
          return {
            x: (28.14 + rx * 158.09) * scaleX,
            y: (365.73 + ry * 30.27) * scaleY,
            w: (w / 200) * 158.09 * scaleX,
            h: (h / 40) * 30.27 * scaleY,
          };
        }
        return {
          x: (cx / 540) * exportWidth,
          y: (cy / 440) * exportHeight,
          w: (w / 540) * exportWidth,
          h: (h / 440) * exportHeight,
        };
      };

      if (images && Object.keys(images).length > 0) {
        Object.keys(images).forEach((k) => {
          const imgObj = imageObjectsRef.current.get(k);
          if (!imgObj || !imgObj.complete || !imgObj.naturalWidth) return;
          const pos = imagePositions[k] || { x: 0, y: 0 };
          const size = imageSizes[k] || { width: 100, height: 100 };
          const rot = imageRotations[k] || 0;
          const mapped = mapPizzaCoords(pos.x + size.width / 2, pos.y + size.height / 2, size.width, size.height);
          ctx.save();
          ctx.translate(mapped.x, mapped.y);
          ctx.rotate((rot * Math.PI) / 180);
          ctx.drawImage(imgObj, -mapped.w / 2, -mapped.h / 2, mapped.w, mapped.h);
          ctx.restore();
        });
      }

      if (textElements && Object.keys(textElements).length > 0) {
        Object.values(textElements).forEach((t) => {
          if (!t || !t.text) return;
          const mapped = mapPizzaCoords(t.x, t.y, 100, 100);
          ctx.save();
          ctx.translate(mapped.x, mapped.y);
          ctx.rotate(((t.rotation || 0) * Math.PI) / 180);
          const fontSize = Math.round((t.fontSize || 20) * (scaleX / 1.8));
          ctx.font = `${t.isItalic ? 'italic ' : ''}${t.isBold ? 'bold ' : ''}${fontSize}px ${t.fontFamily || 'sans-serif'}`;
          ctx.fillStyle = t.color || '#2B211B';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(t.text, 0, 0);
          ctx.restore();
        });
      }

      canvas.toBlob((blob) => {
        if (!blob) return;
        const blobUrl = URL.createObjectURL(blob);
        if (currentBlobUrlRef.current) URL.revokeObjectURL(currentBlobUrlRef.current);
        currentBlobUrlRef.current = blobUrl;
        setExtTexImgBlob(blobUrl);
      }, 'image/jpeg', 0.95);
      return;
    }

    // 3. Shipping Box (Carton): 1920 x 1080 unwrap
    if (presetId === 'carton') {
      const exportWidth = 1920;
      const exportHeight = 1080;
      canvas.width = exportWidth;
      canvas.height = exportHeight;

      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, exportWidth, exportHeight);

      const SHIPPING_UV_BOUNDS = {
        front: { x: 530.1, y: 312.1, width: 415, height: 453.2 },
        back: { x: 1489.7, y: 312.2, width: 415, height: 453.1 },
        left: { x: 8.5, y: 312.1, width: 509.6, height: 453.4 },
        right: { x: 968.1, y: 312.1, width: 509.6, height: 453.5 },
        bottom: { x: 530.1, y: 768.2, width: 415, height: 309.4 },
        top: { x: 530.1, y: 0, width: 415, height: 312.1 },
      };

      Object.entries(SHIPPING_UV_BOUNDS).forEach(([key, b]) => {
        const color = sideColors[key] || baseColor;
        ctx.fillStyle = color;
        ctx.fillRect(
          Math.floor(b.x) - 1,
          Math.floor(b.y) - 1,
          Math.ceil(b.width) + 2,
          Math.ceil(b.height) + 2
        );
      });

      const mapShippingCoords = (cx, cy, w, h) => {
        if (cx >= 140 && cx <= 280 && cy >= 100 && cy <= 280) {
          const rx = (cx - 140) / 140;
          const ry = (cy - 100) / 180;
          return {
            x: 530.1 + rx * 415,
            y: 312.1 + ry * 453.2,
            w: (w / 140) * 415,
            h: (h / 180) * 453.2,
          };
        } else if (cx >= 280 && cx <= 380 && cy >= 100 && cy <= 280) {
          const rx = (cx - 280) / 100;
          const ry = (cy - 100) / 180;
          return {
            x: 968.1 + rx * 509.6,
            y: 312.1 + ry * 453.5,
            w: (w / 100) * 509.6,
            h: (h / 180) * 453.5,
          };
        } else if (cx >= 380 && cx <= 520 && cy >= 100 && cy <= 280) {
          const rx = (cx - 380) / 140;
          const ry = (cy - 100) / 180;
          return {
            x: 1489.7 + rx * 415,
            y: 312.2 + ry * 453.1,
            w: (w / 140) * 415,
            h: (h / 180) * 453.1,
          };
        } else if (cx >= 40 && cx <= 140 && cy >= 100 && cy <= 280) {
          const rx = (cx - 40) / 100;
          const ry = (cy - 100) / 180;
          return {
            x: 8.5 + rx * 509.6,
            y: 312.1 + ry * 453.4,
            w: (w / 100) * 509.6,
            h: (h / 180) * 453.4,
          };
        }
        return {
          x: (cx / 540) * exportWidth,
          y: (cy / 440) * exportHeight,
          w: (w / 540) * exportWidth,
          h: (h / 440) * exportHeight,
        };
      };

      if (images && Object.keys(images).length > 0) {
        Object.keys(images).forEach((k) => {
          const imgObj = imageObjectsRef.current.get(k);
          if (!imgObj || !imgObj.complete || !imgObj.naturalWidth) return;
          const pos = imagePositions[k] || { x: 0, y: 0 };
          const size = imageSizes[k] || { width: 100, height: 100 };
          const rot = imageRotations[k] || 0;
          const mapped = mapShippingCoords(pos.x + size.width / 2, pos.y + size.height / 2, size.width, size.height);
          ctx.save();
          ctx.translate(mapped.x, mapped.y);
          ctx.rotate((rot * Math.PI) / 180);
          ctx.drawImage(imgObj, -mapped.w / 2, -mapped.h / 2, mapped.w, mapped.h);
          ctx.restore();
        });
      }

      if (textElements && Object.keys(textElements).length > 0) {
        Object.values(textElements).forEach((t) => {
          if (!t || !t.text) return;
          const mapped = mapShippingCoords(t.x, t.y, 100, 100);
          ctx.save();
          ctx.translate(mapped.x, mapped.y);
          ctx.rotate(((t.rotation || 0) * Math.PI) / 180);
          const fontSize = Math.round((t.fontSize || 20) * 3);
          ctx.font = `${t.isItalic ? 'italic ' : ''}${t.isBold ? 'bold ' : ''}${fontSize}px ${t.fontFamily || 'sans-serif'}`;
          ctx.fillStyle = t.color || '#2B211B';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(t.text, 0, 0);
          ctx.restore();
        });
      }

      canvas.toBlob((blob) => {
        if (!blob) return;
        const blobUrl = URL.createObjectURL(blob);
        if (currentBlobUrlRef.current) URL.revokeObjectURL(currentBlobUrlRef.current);
        currentBlobUrlRef.current = blobUrl;
        setExtTexImgBlob(blobUrl);
      }, 'image/jpeg', 0.95);
      return;
    }

    // 4. For all other 14 box types (DynamicBoxModel, PizzaSliceBox, CakeBox, KraftPaperBag)
    if (!hasArt) {
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current);
        currentBlobUrlRef.current = null;
      }
      setExtTexImgBlob(null);
      return;
    }

    const exportWidth = 2048;
    const exportHeight = 2048;
    canvas.width = exportWidth;
    canvas.height = exportHeight;

    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, exportWidth, exportHeight);

    const scaleX = exportWidth / VIEWBOX_WIDTH;
    const scaleY = exportHeight / VIEWBOX_HEIGHT;

    if (presetId === 'pizzaSlice') {
      // Triangular Top Lid: (270, 30), (150, 220), (390, 220)
      ctx.fillStyle = sideColors.top || baseColor;
      ctx.beginPath();
      ctx.moveTo(270 * scaleX, 30 * scaleY);
      ctx.lineTo(150 * scaleX, 220 * scaleY);
      ctx.lineTo(390 * scaleX, 220 * scaleY);
      ctx.closePath();
      ctx.fill();

      // Back Crust: (150, 220, 240, 42)
      ctx.fillStyle = sideColors.back || baseColor;
      ctx.fillRect(150 * scaleX, 220 * scaleY, 240 * scaleX, 42 * scaleY);

      // Triangular Base Tray: (270, 410), (150, 262), (390, 262)
      ctx.fillStyle = sideColors.bottom || baseColor;
      ctx.beginPath();
      ctx.moveTo(270 * scaleX, 410 * scaleY);
      ctx.lineTo(150 * scaleX, 262 * scaleY);
      ctx.lineTo(390 * scaleX, 262 * scaleY);
      ctx.closePath();
      ctx.fill();

      // Left wing: (150, 220), (150, 262), (60, 262)
      ctx.fillStyle = sideColors.left || baseColor;
      ctx.beginPath();
      ctx.moveTo(150 * scaleX, 220 * scaleY);
      ctx.lineTo(150 * scaleX, 262 * scaleY);
      ctx.lineTo(60 * scaleX, 262 * scaleY);
      ctx.closePath();
      ctx.fill();

      // Right wing: (390, 220), (390, 262), (480, 262)
      ctx.fillStyle = sideColors.right || baseColor;
      ctx.beginPath();
      ctx.moveTo(390 * scaleX, 220 * scaleY);
      ctx.lineTo(390 * scaleX, 262 * scaleY);
      ctx.lineTo(480 * scaleX, 262 * scaleY);
      ctx.closePath();
      ctx.fill();
    } else {
      const panels = [
        { key: 'left', x: 40, y: 100, w: 100, h: 180 },
        { key: 'front', x: 140, y: 100, w: 140, h: 180 },
        { key: 'right', x: 280, y: 100, w: 100, h: 180 },
        { key: 'back', x: 380, y: 100, w: 140, h: 180 },
        { key: 'top', x: 140, y: 30, w: 140, h: 70 },
        { key: 'bottom', x: 140, y: 280, w: 140, h: 70 },
      ];
      panels.forEach((p) => {
        ctx.fillStyle = sideColors[p.key] || baseColor;
        ctx.fillRect(p.x * scaleX, p.y * scaleY, p.w * scaleX, p.h * scaleY);
      });
    }

    if (images && Object.keys(images).length > 0) {
      Object.keys(images).forEach((k) => {
        const imgObj = imageObjectsRef.current.get(k);
        if (!imgObj || !imgObj.complete || !imgObj.naturalWidth) return;
        const pos = imagePositions[k] || { x: 0, y: 0 };
        const size = imageSizes[k] || { width: 100, height: 100 };
        const rot = imageRotations[k] || 0;
        const cx = (pos.x + size.width / 2) * scaleX;
        const cy = (pos.y + size.height / 2) * scaleY;
        const dw = size.width * scaleX;
        const dh = size.height * scaleY;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((rot * Math.PI) / 180);
        ctx.drawImage(imgObj, -dw / 2, -dh / 2, dw, dh);
        ctx.restore();
      });
    }

    if (textElements && Object.keys(textElements).length > 0) {
      Object.values(textElements).forEach((t) => {
        if (!t || !t.text) return;
        const cx = t.x * scaleX;
        const cy = t.y * scaleY;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(((t.rotation || 0) * Math.PI) / 180);
        const fontSize = Math.round((t.fontSize || 20) * scaleX);
        ctx.font = `${t.isItalic ? 'italic ' : ''}${t.isBold ? 'bold ' : ''}${fontSize}px ${t.fontFamily || 'sans-serif'}`;
        ctx.fillStyle = t.color || '#2B211B';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(t.text, 0, 0);
        ctx.restore();
      });
    }

    canvas.toBlob((blob) => {
      if (!blob) return;
      const blobUrl = URL.createObjectURL(blob);
      if (currentBlobUrlRef.current) URL.revokeObjectURL(currentBlobUrlRef.current);
      currentBlobUrlRef.current = blobUrl;
      setExtTexImgBlob(blobUrl);
    }, 'image/jpeg', 0.95);
  }, [presetId, extTexColor, sideColors, setExtTexImgBlob, images, textElements, imagePositions, imageSizes, imageRotations]);

  useEffect(() => {
    if (!images) return;
    let anyNew = false;
    Object.entries(images).forEach(([key, src]) => {
      const existing = imageObjectsRef.current.get(key);
      if (!existing || existing.src !== src) {
        anyNew = true;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          imageObjectsRef.current.set(key, img);
          convertSvgToJpg();
        };
        img.src = src;
        imageObjectsRef.current.set(key, img);
      }
    });
    for (const key of imageObjectsRef.current.keys()) {
      if (!images[key]) {
        imageObjectsRef.current.delete(key);
      }
    }
    if (!anyNew) {
      convertSvgToJpg();
    }
  }, [images, convertSvgToJpg]);

  useEffect(() => {
    return () => {
      if (currentBlobUrlRef.current) {
        URL.revokeObjectURL(currentBlobUrlRef.current);
        currentBlobUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      convertSvgToJpg();
    }, 120);
    return () => clearTimeout(timer);
  }, [presetId, textElements, sideColors, extTexColor, convertSvgToJpg]);

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

    // For UV-mapped textured models, regenerate 3D texture blob
    if (presetId === 'mailerBox' || presetId === 'pizzaBox' || presetId === 'carton') {
      setTimeout(() => convertSvgToJpg(), 60);
    }
  };

  // Apply color to all faces of the box at once
  const handleApplyColorToAll = (color) => {
    if (setExtTexColor) setExtTexColor(color);
    if (setSelectedColor) setSelectedColor(color);
    if (setSideColors) {
      setSideColors((prev) => {
        const next = { ...prev };
        ['top', 'bottom', 'front', 'back', 'left', 'right', 'lidFront', 'lid', 'lidTop', 'lidLeft', 'lidRight', 'bottomFront', 'bottomBack', 'bottomLeft', 'bottomRight'].forEach((k) => {
          next[k] = color;
        });
        return next;
      });
    }
    // For UV-mapped textured models, regenerate 3D texture blob
    if (presetId === 'mailerBox' || presetId === 'pizzaBox' || presetId === 'carton') {
      setTimeout(() => convertSvgToJpg(), 60);
    }
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
    if (presetId === 'mailerBox' || presetId === 'pizzaBox' || presetId === 'carton') {
      setTimeout(() => convertSvgToJpg(), 60);
    }
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
      const defaultSize = 100;
      const initialPos = getInitialPositionForSection(selectedSection);
      const x = Math.max(MARGIN, initialPos.x - defaultSize / 2);
      const y = Math.max(MARGIN, initialPos.y - defaultSize / 2);

      const src = e.target.result;
      const imgObj = new Image();
      imgObj.crossOrigin = 'anonymous';
      imgObj.onload = () => {
        imageObjectsRef.current.set(key, imgObj);
        convertSvgToJpg();
      };
      imgObj.src = src;
      imageObjectsRef.current.set(key, imgObj);

      setImages((prev) => ({ ...prev, [key]: src }));
      setImagePositions((prev) => ({ ...prev, [key]: { x, y } }));
      setImageSizes((prev) => ({ ...prev, [key]: { width: defaultSize, height: defaultSize } }));
      setImageRotations((prev) => ({ ...prev, [key]: 0 }));
      setSelectedImage(key);
      setSelectedTextId(null);
      setSelectedItem('images');
      event.target.value = null;
      setTimeout(() => convertSvgToJpg(), 150);
    };
    reader.readAsDataURL(file);
  };

  // Custom Text handlers
  const handleAddText = () => {
    const id = `txt-${Date.now()}`;
    const initialPos = getInitialPositionForSection(selectedSection);
    const x = initialPos.x;
    const y = initialPos.y;
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
    setTimeout(() => convertSvgToJpg(), 150);
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
    setTimeout(() => convertSvgToJpg(), 150);
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
    setTimeout(() => convertSvgToJpg(), 150);
  };

  const handleTextRotate = (degrees) => {
    if (!selectedTextId || !setTextElements || !textElements[selectedTextId]) return;
    const current = textElements[selectedTextId].rotation || 0;
    updateSelectedText({ rotation: (current + degrees) % 360 });
  };

  // Drag, Resize, and Rotate Handlers for Images
  const handleMouseDown = (event, id) => {
    event.stopPropagation();
    setSelectedImage(id);
    setSelectedTextId(null);
    setSelectedItem('images');
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
                max="80"
                value={activeTextObj ? activeTextObj.fontSize : selectedFontSize}
                onChange={(e) => {
                  const val = Number(e.target.value) || 20;
                  if (activeTextObj) updateSelectedText({ fontSize: val });
                  else setSelectedFontSize(val);
                }}
                className="w-12 px-1 py-1 text-xs border border-[#DCCFC2] rounded-md bg-white text-center font-mono"
              />
            </div>
            {/* Bold and Italic toggles */}
            <button
              type="button"
              onClick={() => {
                if (activeTextObj) updateSelectedText({ isBold: !activeTextObj.isBold });
                else setIsBold(!isBold);
              }}
              className={`px-2 py-1 text-xs font-bold rounded border ${
                (activeTextObj ? activeTextObj.isBold : isBold)
                  ? 'bg-[#2B211B] text-white border-[#2B211B]'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
              title="Bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => {
                if (activeTextObj) updateSelectedText({ isItalic: !activeTextObj.isItalic });
                else setIsItalic(!isItalic);
              }}
              className={`px-2 py-1 text-xs italic font-serif rounded border ${
                (activeTextObj ? activeTextObj.isItalic : isItalic)
                  ? 'bg-[#2B211B] text-white border-[#2B211B]'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}
              title="Italic"
            >
              I
            </button>
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
                  onClick={handleAddText}
                  className="px-2 py-1 text-xs font-semibold rounded bg-[#2B211B] text-[#FFFDFC] hover:bg-[#A94F32] transition-colors shadow-2xs"
                  title="Add another text"
                >
                  + New
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
          onClick={(e) => {
            if (e.target === svgRef.current) {
              setSelectedImage(null);
              setSelectedTextId(null);
            }
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
            const isSelected = selectedImage === key;

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
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(key);
                    setSelectedTextId(null);
                    setSelectedItem('images');
                  }}
                  className="cursor-move"
                />
                {isSelected && (
                  <g transform={`rotate(${rot}, ${cx}, ${cy})`} onClick={(e) => e.stopPropagation()}>
                    {/* Bounding box outline */}
                    <rect
                      x={pos.x}
                      y={pos.y}
                      width={size.width}
                      height={size.height}
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      pointerEvents="none"
                    />
                    {/* Resize handle bottom-right */}
                    <rect
                      x={pos.x + size.width - 7}
                      y={pos.y + size.height - 7}
                      width="14"
                      height="14"
                      fill="#2563EB"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      cursor="nwse-resize"
                      onMouseDown={(e) => { e.stopPropagation(); setResizing(true); }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {/* Rotate handle top center */}
                    <circle
                      cx={cx}
                      cy={pos.y - 14}
                      r="8"
                      fill="#DC2626"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      cursor="crosshair"
                      onMouseDown={(e) => { e.stopPropagation(); setRotating(true); }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <line x1={cx} y1={pos.y} x2={cx} y2={pos.y - 14} stroke="#DC2626" strokeWidth="1.5" pointerEvents="none" />
                  </g>
                )}
              </g>
            );
          })}

          {/* User-added Custom Typography Text Elements */}
          {Object.keys(textElements || {}).map((key) => {
            const t = textElements[key];
            if (!t) return null;
            const isSelected = selectedTextId === key;
            return (
              <g
                key={key}
                transform={`rotate(${t.rotation || 0}, ${t.x}, ${t.y})`}
                onMouseDown={(e) => handleTextMouseDown(e, key)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTextId(key);
                  setSelectedImage(null);
                  setSelectedItem('text');
                }}
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
                    strokeWidth="2"
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
