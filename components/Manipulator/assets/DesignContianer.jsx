"use client";

import { useEffect, useRef, useState } from "react";
import { FaImages } from "react-icons/fa6";
import { IoMdColorPalette } from "react-icons/io";
import { FaGrip, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaTrash } from "react-icons/fa6";
import classNames from 'classnames';
import { useAppContext } from "@/context/Context";

// Bounds (x, y, width, height) for each section in the box net for constraining images
const SECTION_BOUNDS = {
    section1: { x: 98.81, y: 2.61, width: 48.1, height: 47.59 },
    section2: { x: 98.81, y: 52.44, width: 48.1, height: 44.54 },
    section3: { x: 98.81, y: 101.66, width: 48.1, height: 43.73 },
    section4: { x: 98.81, y: 148.24, width: 48.1, height: 46.07 },
    section5: { x: 98.81, y: 196.24, width: 48.1, height: 45.56 },
    section6: { x: 147.93, y: 148.24, width: 48.97, height: 45.81 },
    section7: { x: 45.58, y: 148.24, width: 51.71, height: 46.07 },
};

const SECTION_TO_SIDE_KEY = {
    section1: 'lidFront',
    section2: 'top',
    section3: 'back',
    section4: 'bottom',
    section5: 'front',
    section6: 'left',
    section7: 'right',
};

const VIEWBOX_WIDTH = 245.76;
const VIEWBOX_HEIGHT = 245.76;
const MARGIN = 2;

const clampPositionToViewBox = (pos, size) => {
    const w = size?.width ?? 100;
    const h = size?.height ?? 100;
    const x = Math.max(MARGIN, Math.min(VIEWBOX_WIDTH - w - MARGIN, pos.x));
    const y = Math.max(MARGIN, Math.min(VIEWBOX_HEIGHT - h - MARGIN, pos.y));
    return { x, y };
};

const clampSizeToViewBox = (pos, size) => {
    const maxW = VIEWBOX_WIDTH - (pos?.x ?? 0) - MARGIN;
    const maxH = VIEWBOX_HEIGHT - (pos?.y ?? 0) - MARGIN;
    const w = Math.max(20, Math.min(maxW, size?.width ?? 100));
    const h = Math.max(20, Math.min(maxH, size?.height ?? 100));
    return { width: w, height: h };
};

const DesignContainer = () => {
    const [selectedItem, setSelectedItem] = useState('color');
    const [selectedSection, setSelectedSection] = useState(null);
    
    const [selectedImage, setSelectedImage] = useState(null);
    const [hoveredImage, setHoveredImage] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(false);
    const [resizeHandle, setResizeHandle] = useState(null);
    const [rotating, setRotating] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    
    const svgRef = useRef();
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [applied, setApplied] = useState(false);

    const { extTexColor, sideColors, setSideColors, selectedColor, setSelectedColor, setSelectedSide, setExtTexImgBlob,imagePositions,
        setImagePositions,
        imageSizes,
        setImageSizes, 
        imageRotations,
        setImageRotations,
        images,
        setImages
         } = useAppContext();

    const convertSvgToJpg = () => {
        const svgElement = svgRef.current;
        const canvas = canvasRef.current;
        if (!svgElement || !canvas) return;
        setApplied(true);
        const ctx = canvas.getContext('2d');

        const width = svgElement.clientWidth;
        const height = svgElement.clientHeight;

        const exportWidth = width * 8;
        const exportHeight = height * 8;
        canvas.width = exportWidth;
        canvas.height = exportHeight;

        const clone = svgElement.cloneNode(true);
        clone.querySelectorAll('[data-no-export]').forEach((el) => el.remove());
        const svgData = new XMLSerializer().serializeToString(clone);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
            try {
                ctx.clearRect(0, 0, exportWidth, exportHeight);
                ctx.drawImage(img, 0, 0, exportWidth, exportHeight);

                const dataUrl = canvas.toDataURL('image/jpeg', 1.0);

                const byteString = atob(dataUrl.split(',')[1]);
                const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeString });
                const blobUrl = URL.createObjectURL(blob);
                setExtTexImgBlob(blobUrl);
            } finally {
                setApplied(false);
            }
        };
        img.onerror = () => setApplied(false);
        img.src = url;
    };

    const handleSectionClick = (id) => {
        setSelectedImage(null)
        setSelectedSection(id);
    };

    const getSectionForImageKey = (key) => {
        const parts = key.split('-');
        if (parts.length < 2) return null;
        const possibleSection = parts.slice(0, -1).join('-');
        return SECTION_BOUNDS[possibleSection] ? possibleSection : null;
    };

    const clampPositionToSection = (sectionId, pos, size) => {
        const b = SECTION_BOUNDS[sectionId];
        if (!b) return pos;
        const w = size?.width ?? 100;
        const h = size?.height ?? 100;
        const x = Math.max(b.x, Math.min(b.x + b.width - w, pos.x));
        const y = Math.max(b.y, Math.min(b.y + b.height - h, pos.y));
        return { x, y };
    };

    const clampSizeToSection = (sectionId, pos, size) => {
        const b = SECTION_BOUNDS[sectionId];
        if (!b) return size;
        const maxW = b.x + b.width - (pos?.x ?? b.x);
        const maxH = b.y + b.height - (pos?.y ?? b.y);
        const w = Math.max(20, Math.min(maxW, size?.width ?? 100));
        const h = Math.max(20, Math.min(maxH, size?.height ?? 100));
        return { width: w, height: h };
    };

    const applyDesignTo3D = () => {
        if (selectedItem === 'color' && selectedSection) {
            const sideKey = SECTION_TO_SIDE_KEY[selectedSection];
            if (sideKey) setSideColors((prev) => ({ ...prev, [sideKey]: selectedColor }));
            setTimeout(() => convertSvgToJpg(), 50);
        } else {
            convertSvgToJpg();
        }
    };

    const selectedSectionRef = useRef(selectedSection);
    const selectedItemRef = useRef(selectedItem);
    selectedSectionRef.current = selectedSection;
    selectedItemRef.current = selectedItem;

    const handleDeleteFromSelectedSide = () => {
        const section = selectedSectionRef.current;
        const mode = selectedItemRef.current;
        if (!section) return;
        const defaultColor = extTexColor || '#9f6e33';
        if (mode === 'color') {
            const sideKey = SECTION_TO_SIDE_KEY[section];
            if (sideKey) setSideColors((prev) => ({ ...prev, [sideKey]: defaultColor }));
        } else {
            const prefix = section + '-';
            const keysToRemove = Object.keys(images).filter((k) => k.startsWith(prefix));
            if (keysToRemove.length > 0) {
                setImages((prev) => {
                    const next = { ...prev };
                    keysToRemove.forEach((k) => delete next[k]);
                    return next;
                });
                setImagePositions((prev) => {
                    const next = { ...prev };
                    keysToRemove.forEach((k) => delete next[k]);
                    return next;
                });
                setImageSizes((prev) => {
                    const next = { ...prev };
                    keysToRemove.forEach((k) => delete next[k]);
                    return next;
                });
                setImageRotations((prev) => {
                    const next = { ...prev };
                    keysToRemove.forEach((k) => delete next[k]);
                    return next;
                });
                if (selectedImage && keysToRemove.includes(selectedImage)) setSelectedImage(null);
            }
        }
        setTimeout(() => convertSvgToJpg(), 100);
    };

    const handleImageUpload = (event) => {
        setSelectedImage(null);
        const timeInstant = Date.now();
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const size = 80;
            const x = VIEWBOX_WIDTH / 2 - size / 2;
            const y = VIEWBOX_HEIGHT / 2 - size / 2;
            const key = `image-${timeInstant}`;
            setImages(prev => ({ ...prev, [key]: e.target.result }));
            setImagePositions(prev => ({ ...prev, [key]: { x, y } }));
            setImageSizes(prev => ({ ...prev, [key]: { width: size, height: size } }));
            setImageRotations(prev => ({ ...prev, [key]: 0 }));
            setSelectedImage(key);
            event.target.value = null;
        };
        reader.readAsDataURL(file);
    };

    const deleteSelectedImage = () => {
        if (!selectedImage) return;
        const key = selectedImage;
        setImages(prev => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
        setImagePositions(prev => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
        setImageSizes(prev => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
        setImageRotations(prev => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
        setSelectedImage(null);
        setTimeout(() => convertSvgToJpg(), 100);
    };

    const getViewBoxPoint = (clientX, clientY) => {
        if (!svgRef.current) return { x: 0, y: 0 };
        const svgRect = svgRef.current.getBoundingClientRect();
        const scaleX = 245.76 / svgRect.width;
        const scaleY = 245.76 / svgRect.height;
        return {
            x: (clientX - svgRect.left) * scaleX,
            y: (clientY - svgRect.top) * scaleY,
        };
    };

    const handleMouseDown = (event, id) => {
        event.stopPropagation();
        setDragging(true);
        setSelectedImage(id);
        const pt = getViewBoxPoint(event.clientX, event.clientY);
        setDragStart({
            x: pt.x - (imagePositions[id]?.x || 0),
            y: pt.y - (imagePositions[id]?.y || 0),
        });
    };

    const handleResizeMouseDown = (event, id, handlePosition) => {
        event.stopPropagation();
        setResizing(true);
        setResizeHandle(handlePosition);
        setSelectedImage(id);
        const svgRect = svgRef.current.getBoundingClientRect();
        setDragStart({
            x: (event.clientX - svgRect.left) * (VIEWBOX_WIDTH / svgRect.width),
            y: (event.clientY - svgRect.top) * (VIEWBOX_HEIGHT / svgRect.height),
        });
    };

    const handleMouseMove = (event) => {
        if (dragging && selectedImage) {
            const svgRect = svgRef.current.getBoundingClientRect();
            const scaleX = VIEWBOX_WIDTH / svgRect.width;
            const scaleY = VIEWBOX_HEIGHT / svgRect.height;
            const newX = (event.clientX - svgRect.left) * scaleX - dragStart.x;
            const newY = (event.clientY - svgRect.top) * scaleY - dragStart.y;
            const pos = clampPositionToViewBox({ x: newX, y: newY }, imageSizes[selectedImage]);
            setImagePositions(prevPositions => ({
                ...prevPositions,
                [selectedImage]: pos,
            }));
        } else if (resizing && selectedImage && resizeHandle) {
            const svgRect = svgRef.current.getBoundingClientRect();
            const scaleX = VIEWBOX_WIDTH / svgRect.width;
            const scaleY = VIEWBOX_HEIGHT / svgRect.height;
            const mouseX = (event.clientX - svgRect.left) * scaleX;
            const mouseY = (event.clientY - svgRect.top) * scaleY;
            const oldX = imagePositions[selectedImage]?.x ?? 0;
            const oldY = imagePositions[selectedImage]?.y ?? 0;
            const oldW = imageSizes[selectedImage]?.width ?? 100;
            const oldH = imageSizes[selectedImage]?.height ?? 100;
            const minSize = 20;
            let newX = oldX, newY = oldY, newW = oldW, newH = oldH;
            switch (resizeHandle) {
                case 'nw':
                    newX = Math.min(mouseX, oldX + oldW - minSize);
                    newY = Math.min(mouseY, oldY + oldH - minSize);
                    newW = oldX + oldW - newX;
                    newH = oldY + oldH - newY;
                    break;
                case 'n':
                    newY = Math.min(mouseY, oldY + oldH - minSize);
                    newH = oldY + oldH - newY;
                    break;
                case 'ne':
                    newY = Math.min(mouseY, oldY + oldH - minSize);
                    newW = Math.max(mouseX - oldX, minSize);
                    newH = oldY + oldH - newY;
                    break;
                case 'e':
                    newW = Math.max(mouseX - oldX, minSize);
                    break;
                case 'se':
                    newW = Math.max(mouseX - oldX, minSize);
                    newH = Math.max(mouseY - oldY, minSize);
                    break;
                case 's':
                    newH = Math.max(mouseY - oldY, minSize);
                    break;
                case 'sw':
                    newX = Math.min(mouseX, oldX + oldW - minSize);
                    newW = oldX + oldW - newX;
                    newH = Math.max(mouseY - oldY, minSize);
                    break;
                case 'w':
                    newX = Math.min(mouseX, oldX + oldW - minSize);
                    newW = oldX + oldW - newX;
                    break;
                default:
                    break;
            }
            const pos = clampPositionToViewBox({ x: newX, y: newY }, { width: newW, height: newH });
            const size = clampSizeToViewBox(pos, { width: newW, height: newH });
            setImagePositions(prev => ({ ...prev, [selectedImage]: pos }));
            setImageSizes(prev => ({ ...prev, [selectedImage]: size }));
        } else if (rotating && selectedImage) {
            const svgRect = svgRef.current.getBoundingClientRect();
            const centerX = (imagePositions[selectedImage]?.x || 0) + (imageSizes[selectedImage]?.width || 0) / 2;
            const centerY = (imagePositions[selectedImage]?.y || 0) + (imageSizes[selectedImage]?.height || 0) / 2;

            const newRotation = Math.atan2(event.clientY - svgRect.top - centerY, event.clientX - svgRect.left - centerX) * (180 / Math.PI);
            setImageRotations(prevRotations => ({
                ...prevRotations,
                [selectedImage]: newRotation,
            }));
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
        setResizing(false);
        setResizeHandle(null);
        setRotating(false);
    };

    const handleRotateMouseDown = (event, id) => {
        event.stopPropagation();
        setRotating(true);
        setSelectedImage(id);
        const svgRect = svgRef.current.getBoundingClientRect();
        setDragStart({
            x: event.clientX - svgRect.left,
            y: event.clientY - svgRect.top,
        });
    };

    const getSVGPoint = (clientX, clientY) => {
        const svg = svgRef.current;
        if (!svg) return null;
        const ctm = svg.getScreenCTM();
        if (!ctm) return null;
        const pt = svg.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const svgP = pt.matrixTransform(ctm.inverse());
        return svgP ? { x: svgP.x, y: svgP.y } : null;
    };

    const isPointInSection = (point, sectionId, margin = 0) => {
        if (!point) return false;
        const b = SECTION_BOUNDS[sectionId];
        if (!b) return false;
        return point.x >= b.x - margin && point.x <= b.x + b.width + margin &&
            point.y >= b.y - margin && point.y <= b.y + b.height + margin;
    };

    const handleSvgClick = (event) => {
        const target = event.target;
        // Clear image selection when clicking on empty canvas (not on image/rect/circle)
        if (!target.closest('image') && !target.closest('rect') && !target.closest('circle')) {
            setSelectedImage(null);
        }
    };

    // Capture-phase handler: in Add Color mode, if the pointer is inside section6 (brown panel to right of red), select it before any child can block the click. Use 8px margin so clicks near the edge still count.
    const handleSvgPointerDownCapture = (event) => {
        if (selectedItem !== 'color') return;
        const pt = getSVGPoint(event.clientX, event.clientY);
        if (pt && isPointInSection(pt, 'section6', 8)) {
            handleSectionClick('section6');
        }
    };

    const renderResizeHandles = (imageId) => {
        const position = imagePositions[imageId];
        const size = imageSizes[imageId];
        if (!position || !size) return null;

        const handleSize = 10;
        const hw = size.width / 2;
        const hh = size.height / 2;
        const handles = [
            { pos: 'nw', x: position.x, y: position.y, cursor: 'nwse-resize' },
            { pos: 'n', x: position.x + hw, y: position.y, cursor: 'ns-resize' },
            { pos: 'ne', x: position.x + size.width, y: position.y, cursor: 'nesw-resize' },
            { pos: 'e', x: position.x + size.width, y: position.y + hh, cursor: 'ew-resize' },
            { pos: 'se', x: position.x + size.width, y: position.y + size.height, cursor: 'nwse-resize' },
            { pos: 's', x: position.x + hw, y: position.y + size.height, cursor: 'ns-resize' },
            { pos: 'sw', x: position.x, y: position.y + size.height, cursor: 'nesw-resize' },
            { pos: 'w', x: position.x, y: position.y + hh, cursor: 'ew-resize' },
        ];

        return (
            <g data-no-export>
                {handles.map((h) => (
                    <rect
                        key={h.pos}
                        x={h.x - handleSize / 2}
                        y={h.y - handleSize / 2}
                        width={handleSize}
                        height={handleSize}
                        fill="blue"
                        style={{ cursor: h.cursor }}
                        onMouseDown={(e) => handleResizeMouseDown(e, imageId, h.pos)}
                    />
                ))}
            </g>
        );
    };

    const renderRotateHandle = (imageId) => {
        const position = imagePositions[imageId];
        const size = imageSizes[imageId];
        if (!position || !size) return null;

        const cx = position.x + size.width / 2;
        const cy = position.y - 22;
        const r = 11;

        return (
            <g
                data-no-export
                cursor="grab"
                onMouseDown={(e) => handleRotateMouseDown(e, imageId)}
                style={{ cursor: 'grab' }}
                title="Drag to rotate image"
            >
                <circle cx={cx} cy={cy} r={r} fill="white" stroke="#475569" strokeWidth={2} />
                <path
                    d={`M ${cx - 4} ${cy + 5} A 6 6 0 0 1 ${cx + 5} ${cy - 4}`}
                    fill="none"
                    stroke="#475569"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                />
                <path
                    d={`M ${cx + 5} ${cy - 4} L ${cx + 3} ${cy - 5} M ${cx + 5} ${cy - 4} L ${cx + 6} ${cy - 2}`}
                    fill="none"
                    stroke="#475569"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                />
            </g>
        );
    };

    useEffect(() => {
        if (selectedSection === 'section1') {
            setSelectedSide('topFront')
        } else if (selectedSection === 'section2') {
            setSelectedSide('top')
        } else if (selectedSection === 'section3') {
            setSelectedSide('topBack')
        } else if (selectedSection === 'section4') {
            setSelectedSide('bottom')
        } else if (selectedSection === 'section5') {
            setSelectedSide('bottomFront')
        } else if (selectedSection === 'section6') {
            setSelectedSide('bottomRight')
        } else if (selectedSection === 'section7') {
            setSelectedSide('bottomLeft')
        }
    }, [selectedSection])

    // When user selects a panel, show that panel's current color in the picker (no live sync to avoid blinking)
    useEffect(() => {
        if (!selectedSection) return;
        const sideKey = SECTION_TO_SIDE_KEY[selectedSection];
        if (!sideKey) return;
        const current = sideColors[sideKey];
        const defaultColor = extTexColor || '#9f6e33';
        const toShow = (current && String(current).trim() !== '') ? current : defaultColor;
        setSelectedColor((prev) => (prev === toShow ? prev : toShow));
    }, [selectedSection, sideColors, extTexColor]);

    const ARROW_STEP = 3;
    const handleArrowMove = (dx, dy) => {
        if (!selectedImage) return;
        const pos = imagePositions[selectedImage] || { x: 0, y: 0 };
        const size = imageSizes[selectedImage] || { width: 100, height: 100 };
        const newPos = clampPositionToViewBox({ x: pos.x + dx, y: pos.y + dy }, size);
        setImagePositions((prev) => ({ ...prev, [selectedImage]: newPos }));
    };
    const selectedImageRef = useRef(selectedImage);
    const imagePositionsRef = useRef(imagePositions);
    const imageSizesRef = useRef(imageSizes);
    const deleteSelectedImageRef = useRef(deleteSelectedImage);
    selectedImageRef.current = selectedImage;
    imagePositionsRef.current = imagePositions;
    imageSizesRef.current = imageSizes;
    deleteSelectedImageRef.current = deleteSelectedImage;

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;
            const id = selectedImageRef.current;
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (id) {
                    e.preventDefault();
                    deleteSelectedImageRef.current?.();
                }
                return;
            }
            if (!id) return;
            const pos = imagePositionsRef.current[id] || { x: 0, y: 0 };
            const size = imageSizesRef.current[id] || { width: 100, height: 100 };
            let dx = 0, dy = 0;
            switch (e.key) {
                case 'ArrowLeft': e.preventDefault(); dx = -ARROW_STEP; break;
                case 'ArrowRight': e.preventDefault(); dx = ARROW_STEP; break;
                case 'ArrowUp': e.preventDefault(); dy = -ARROW_STEP; break;
                case 'ArrowDown': e.preventDefault(); dy = ARROW_STEP; break;
                default: return;
            }
            const newPos = clampPositionToViewBox({ x: pos.x + dx, y: pos.y + dy }, size);
            setImagePositions((prev) => ({ ...prev, [id]: newPos }));
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    // Clear image selection when clicking outside the SVG (e.g. sidebar, empty area, outside the box)
    useEffect(() => {
        const onDocumentMouseDown = (e) => {
            if (!selectedImage) return;
            const target = e.target;
            if (svgRef.current?.contains(target)) return;
            if (target.closest('button') || target.closest('input') || target.closest('select') || target.closest('label') || target.closest('[role="button"]')) return;
            setSelectedImage(null);
        };
        document.addEventListener('mousedown', onDocumentMouseDown);
        return () => document.removeEventListener('mousedown', onDocumentMouseDown);
    }, [selectedImage]);

    const panelPointerEvents = selectedItem === 'images' ? 'none' : 'all';

    return (
        <>
            <div className="w-full flex justify-start flex-col">
                <div className="px-4 py-2 bg-headingTxtColor text-white rounded-t-lg">
                    <div className="text-base font-semibold text-white flex items-center justify-start gap-4 flex-row">
                        <span
                            className={`flex items-center flex-row gap-1 font-medium text-sm cursor-pointer ${selectedItem === 'color' && 'font-bold decoration-2 underline underline-offset-4'}`}
                            onClick={() => setSelectedItem('color')}
                        >
                            <span><IoMdColorPalette /> </span>
                            <span>Add Color</span>
                        </span>
                        <span
                            className={`flex items-center flex-row gap-1 font-medium text-sm cursor-pointer ${selectedItem === 'images' && 'font-bold decoration-2 underline underline-offset-4'}`}
                            onClick={() => setSelectedItem('images')}
                        >
                            <span><FaImages /> </span>
                            <span>Add Images</span>
                        </span>
                    </div>
                </div>
                <div className="w-full bg-white border-2 border-headingTxtColor">
                    {selectedItem === 'color' && (
                        <div className="px-4 py-3 flex flex-col gap-3">
                            <p className="text-xs text-gray-600">Select a panel on the box net below, pick a color, then click Apply to 3D. Use Remove color to clear the selected panel. Make sure you are in <strong>Add Color</strong> mode (not Add Images) so panel clicks work—including the brown panel to the right of the center.</p>
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-base font-semibold text-gray-800">Color</span>
                                <label className="flex items-center gap-2 cursor-pointer border-2 border-gray-300 rounded-lg p-1.5 bg-gray-50 hover:border-headingTxtColor">
                                    <span className="w-8 h-8 rounded border border-gray-400 shrink-0" style={{ backgroundColor: selectedColor }} aria-hidden />
                                    <input
                                        type="color"
                                        value={selectedColor || '#9f6e33'}
                                        onChange={(e) => setSelectedColor(e.target.value)}
                                        className="w-12 h-8 cursor-pointer border-0 bg-transparent block"
                                        title="Pick color"
                                    />
                                </label>
                                {selectedSection && (
                                    <button
                                        type="button"
                                        className="px-3 py-1.5 rounded border border-amber-300 bg-amber-50 text-amber-800 text-sm font-medium hover:bg-amber-100"
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteFromSelectedSide(); }}
                                        title="Remove color from selected panel"
                                    >
                                        Remove color
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                    {selectedItem === 'images' && (
                        <div className="px-4 py-2 flex flex-col gap-2">
                            <p className="text-xs text-gray-500">
                                Add an image—it appears in the center. Drag it anywhere on the box net. Side selection is off here so you can grab and move images easily.
                            </p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="text-sm"
                            />
                        </div>
                    )}
                </div>
                <div className="bg-white px-2 rounded-b-lg">
                    <p className="text-xs text-gray-500 pt-2 px-1">
                        Apply to 3D updates the box preview. Select an image and press <kbd className="px-1 py-0.5 rounded bg-gray-200 text-gray-700 font-mono text-[10px]">Delete</kbd> or use Delete image to remove it.
                    </p>
                    <div
                        className="relative z-10 py-3 flex items-center gap-2 flex-wrap border-b border-gray-100 bg-white"
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        role="toolbar"
                    >
                        {selectedItem === 'images' && selectedImage && (
                            <>
                                <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                    <FaGrip className="text-headingTxtColor" title="Drag image to move" />
                                    Move:
                                </span>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        className="p-1.5 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 disabled:opacity-50"
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleArrowMove(-ARROW_STEP, 0); }}
                                        title="Left"
                                    >
                                        <FaArrowLeft className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        className="p-1.5 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 disabled:opacity-50"
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleArrowMove(0, -ARROW_STEP); }}
                                        title="Up"
                                    >
                                        <FaArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        className="p-1.5 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 disabled:opacity-50"
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleArrowMove(0, ARROW_STEP); }}
                                        title="Down"
                                    >
                                        <FaArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        className="p-1.5 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 disabled:opacity-50"
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleArrowMove(ARROW_STEP, 0); }}
                                        title="Right"
                                    >
                                        <FaArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <span className="text-xs text-gray-500">or use keyboard arrows / drag</span>
                                <button
                                    type="button"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 text-sm font-medium"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteSelectedImage(); }}
                                    title="Remove this image (or press Delete / Backspace)"
                                >
                                    <FaTrash className="w-3.5 h-3.5" />
                                    Delete image
                                </button>
                            </>
                        )}
                        <button
                            type="button"
                            className={classNames('ml-auto px-4 py-2 text-sm font-semibold rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed')}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); applyDesignTo3D(); }}
                            disabled={selectedItem === 'color' && !selectedSection}
                            title={selectedItem === 'color' ? 'Apply color to selected panel and update 3D preview' : 'Apply design to 3D box preview'}
                        >
                            {applied ? 'Applying...' : 'Apply to 3D'}
                        </button>
                    </div>
                    <div className="w-full relative" ref={containerRef}>
                        <svg
                            ref={svgRef}
                            width="400"
                            height="400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 245.76 245.76"
                            className='w-full h-full border overflow-hidden'
                            onPointerDownCapture={handleSvgPointerDownCapture}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={() => setHoveredImage(null)}
                            onClick={handleSvgClick}
                        >
                            <defs>
                                <style>
                                    {`
                                        .cls-2 {
                                            fill:${extTexColor};
                                        }
                                        .cls-3 {
                                            fill:#d7c29f;
                                        }
                                        .cls-lidFront {
                                            fill:${sideColors.lidFront}
                                        }
                                        .cls-top {
                                            fill:${sideColors.top}
                                        }
                                        .cls-front {
                                            fill:${sideColors.front}
                                        }
                                        .cls-back {
                                            fill:${sideColors.back}
                                        }
                                        .cls-bottom {
                                            fill:${sideColors.bottom}
                                        }
                                        .cls-left {
                                            fill:${sideColors.left}
                                        }
                                        .cls-right {
                                            fill:${sideColors.right}
                                        }
                                        .cls-trnsprnt {
                                            fill: transparent
                                        }
                                `}
                                </style>

                                <clipPath id="clip-dieline">
                                    <path
                                        d="M99.78,195.39c-.6-.07-1.21-.21-1.81-.22H3.73c-1.82,0-1.82,0-1.82-1.81V149c0-1.55,0-1.55,1.6-1.55H99l0-.39c-.43,0-.86-.09-1.29-.09-7.23,0-14.46,0-21.7,0-1.17,0-1.47-.34-1.47-1.48q.06-22.12,0-44.24c0-1.19.27-1.58,1.52-1.57q10.43.09,20.86,0a33.44,33.44,0,0,0,4.18-.54l0-.38-9.49-1.7c-4.21-.75-8.43-1.49-12.64-2.25-1.5-.27-3-.6-4.5-.85-2.86-.49-4.14-2.37-4.16-5-.08-9.35-.06-18.7,0-28.05,0-2.94,1.59-4.78,4.66-5.3C79.31,54.86,83.66,54,88,53.25c3.9-.69,7.81-1.35,11.71-2l.08-.31a5.47,5.47,0,0,0-1.34-.33q-12.11,0-24.22,0c-1.44,0-2.88,0-4.32,0-.84,0-1.13-.26-1.1-1.1.28-8.23,1.31-16.31,4.27-24.07,2.51-6.56,6-12.49,11.31-17.14,4.22-3.68,9-5.94,14.84-5.92q23.44.09,46.88,0a21.36,21.36,0,0,1,13,4.44c5.62,4.14,9.29,9.74,12.09,16a58.78,58.78,0,0,1,4.42,15.3c.56,3.78.55,7.65.8,11.49.08,1.1-.67,1-1.35,1q-14.08,0-28.18,0a7.81,7.81,0,0,0-1.42.24l.05.34c3,.52,6,1,9,1.56s6,1,9.06,1.51c2.55.44,5.1.92,7.65,1.37a5.52,5.52,0,0,1,4.25,5q-.1,14.15,0,28.3a5.55,5.55,0,0,1-4.21,5.27c-3.87.66-7.75,1.29-11.62,2-4.41.76-8.81,1.55-13.22,2.33a5.78,5.78,0,0,0-2,.61,12.22,12.22,0,0,0,2.73.62q11.21.08,22.42,0c1.06,0,1.36.3,1.36,1.36q0,22.29,0,44.59c0,1.1-.38,1.33-1.39,1.33-7.31,0-14.63,0-21.94,0h-1.26l0,.33a13.54,13.54,0,0,0,1.4.14h70.14c8,0,16,0,24,0,1.25,0,1.52.38,1.52,1.56,0,14.87,0,29.74,0,44.6,0,1.58,0,1.59-1.57,1.59H147.35a3.62,3.62,0,0,0-1.79.48h1.5c6.95,0,13.91,0,20.86,0,1.14,0,1.4.35,1.4,1.44q0,22.29,0,44.59c0,1.14-.29,1.5-1.46,1.5q-45.21,0-90.41,0c-1.17,0-1.46-.36-1.46-1.5q.06-22.29,0-44.59c0-1.09.26-1.45,1.4-1.44,7.43,0,14.87,0,22.3,0Z"
                                    />
                                </clipPath>
                                {Object.entries(SECTION_BOUNDS).map(([id, b]) => (
                                    <clipPath key={id} id={`clip-${id}`}>
                                        <rect x={b.x} y={b.y} width={b.width} height={b.height} />
                                    </clipPath>
                                ))}
                            </defs>
                            <g id="Layer_2" data-name="Layer 2">
                                <g id="MailerTexture">
                                    <path
                                        d="M99.78,195.39c-.6-.07-1.21-.21-1.81-.22H3.73c-1.82,0-1.82,0-1.82-1.81V149c0-1.55,0-1.55,1.6-1.55H99l0-.39c-.43,0-.86-.09-1.29-.09-7.23,0-14.46,0-21.7,0-1.17,0-1.47-.34-1.47-1.48q.06-22.12,0-44.24c0-1.19.27-1.58,1.52-1.57q10.43.09,20.86,0a33.44,33.44,0,0,0,4.18-.54l0-.38-9.49-1.7c-4.21-.75-8.43-1.49-12.64-2.25-1.5-.27-3-.6-4.5-.85-2.86-.49-4.14-2.37-4.16-5-.08-9.35-.06-18.7,0-28.05,0-2.94,1.59-4.78,4.66-5.3C79.31,54.86,83.66,54,88,53.25c3.9-.69,7.81-1.35,11.71-2l.08-.31a5.47,5.47,0,0,0-1.34-.33q-12.11,0-24.22,0c-1.44,0-2.88,0-4.32,0-.84,0-1.13-.26-1.1-1.1.28-8.23,1.31-16.31,4.27-24.07,2.51-6.56,6-12.49,11.31-17.14,4.22-3.68,9-5.94,14.84-5.92q23.44.09,46.88,0a21.36,21.36,0,0,1,13,4.44c5.62,4.14,9.29,9.74,12.09,16a58.78,58.78,0,0,1,4.42,15.3c.56,3.78.55,7.65.8,11.49.08,1.1-.67,1-1.35,1q-14.08,0-28.18,0a7.81,7.81,0,0,0-1.42.24l.05.34c3,.52,6,1,9,1.56s6,1,9.06,1.51c2.55.44,5.1.92,7.65,1.37a5.52,5.52,0,0,1,4.25,5q-.1,14.15,0,28.3a5.55,5.55,0,0,1-4.21,5.27c-3.87.66-7.75,1.29-11.62,2-4.41.76-8.81,1.55-13.22,2.33a5.78,5.78,0,0,0-2,.61,12.22,12.22,0,0,0,2.73.62q11.21.08,22.42,0c1.06,0,1.36.3,1.36,1.36q0,22.29,0,44.59c0,1.1-.38,1.33-1.39,1.33-7.31,0-14.63,0-21.94,0h-1.26l0,.33a13.54,13.54,0,0,0,1.4.14h70.14c8,0,16,0,24,0,1.25,0,1.52.38,1.52,1.56,0,14.87,0,29.74,0,44.6,0,1.58,0,1.59-1.57,1.59H147.35a3.62,3.62,0,0,0-1.79.48h1.5c6.95,0,13.91,0,20.86,0,1.14,0,1.4.35,1.4,1.44q0,22.29,0,44.59c0,1.14-.29,1.5-1.46,1.5q-45.21,0-90.41,0c-1.17,0-1.46-.36-1.46-1.5q.06-22.29,0-44.59c0-1.09.26-1.45,1.4-1.44,7.43,0,14.87,0,22.3,0Z"
                                        className="cls-2 overflow-hidden"
                                        pointerEvents="none"
                                    />
                                    <rect
                                        id="lidFront"
                                        x="98.81" y="2.61"
                                        width="48.1" height="47.59"
                                        pointerEvents={panelPointerEvents}
                                        onClick={(e) => {
                                            e.stopPropagation(); handleSectionClick('section1');
                                        }}
                                        className={classNames('cls-lidFront', { selected: selectedSection === 'section1' })}
                                    />
                                    <rect
                                        id="lidTop"
                                        x="98.81"
                                        y="52.44"
                                        width="48.1"
                                        height="44.54"
                                        pointerEvents={panelPointerEvents}
                                        onClick={(e) => {
                                            e.stopPropagation(); handleSectionClick('section2');
                                        }}
                                        className={classNames('cls-top', { selected: selectedSection === 'section2' })}
                                    />
                                    <rect
                                        id="back"
                                        x="98.81"
                                        y="101.66"
                                        width="48.1"
                                        height="43.73"
                                        pointerEvents={panelPointerEvents}
                                        onClick={(e) => {
                                            e.stopPropagation(); handleSectionClick('section3');
                                        }}
                                        className={classNames('cls-back', { selected: selectedSection === 'section3' })}
                                    />
                                    <rect
                                        id="bottom"
                                        x="98.81"
                                        y="148.24"
                                        width="48.1"
                                        height="46.07"
                                        pointerEvents={panelPointerEvents}
                                        onClick={(e) => {
                                            e.stopPropagation(); handleSectionClick('section4');
                                        }}
                                        className={classNames('cls-bottom', { selected: selectedSection === 'section4' })}
                                    />
                                    <rect
                                        id="front"
                                        x="98.81"
                                        y="196.24"
                                        width="48.1"
                                        height="45.56"
                                        pointerEvents={panelPointerEvents}
                                        onClick={(e) => {
                                            e.stopPropagation(); handleSectionClick('section5');
                                        }}
                                        className={classNames('cls-front', { selected: selectedSection === 'section5' })}
                                    />
                                    <rect
                                        id="right"
                                        x="147.93"
                                        y="148.24"
                                        width="48.97"
                                        height="45.81"
                                        pointerEvents={panelPointerEvents}
                                        onClick={(e) => {
                                            e.stopPropagation(); handleSectionClick('section6');
                                        }}
                                        className={classNames('cls-left', { selected: selectedSection === 'section6' })}
                                    />
                                    <rect
                                        id="left"
                                        x="45.58"
                                        y="148.24"
                                        width="51.71"
                                        height="46.07"
                                        pointerEvents={panelPointerEvents}
                                        onClick={(e) => {
                                            e.stopPropagation(); handleSectionClick('section7');
                                        }}
                                        className={classNames('cls-right', { selected: selectedSection === 'section7' })}
                                    />
                                </g>
                            </g>

                            {Object.keys(images).map((key) => {
                                const clipId = 'clip-dieline';
                                const pos = imagePositions[key] || { x: 0, y: 0 };
                                const size = imageSizes[key] || { width: 100, height: 100 };
                                const cx = pos.x + size.width / 2;
                                const cy = pos.y + size.height / 2;
                                const rot = imageRotations[key] || 0;
                                const isSelected = selectedImage === key;
                                const isHovered = hoveredImage === key;
                                const showStrongOutline = isSelected || isHovered;
                                const hitPadding = 28;
                                const grabHandleSize = 40;
                                const grabHandleY = pos.y - grabHandleSize - 8;
                                return (
                                    <g
                                        key={key}
                                        style={{ cursor: dragging && isSelected ? 'grabbing' : 'grab' }}
                                        onMouseEnter={() => setHoveredImage(key)}
                                        onMouseLeave={() => setHoveredImage(null)}
                                    >
                                        {/* Large invisible hit area so the image is easy to grab and pick up again */}
                                        <rect
                                            x={pos.x - hitPadding}
                                            y={pos.y - hitPadding}
                                            width={size.width + hitPadding * 2}
                                            height={size.height + hitPadding * 2}
                                            fill="transparent"
                                            transform={`rotate(${rot}, ${cx}, ${cy})`}
                                            onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, key); }}
                                            style={{ cursor: dragging && isSelected ? 'grabbing' : 'grab' }}
                                        />
                                        {/* Always show a subtle outline so images are easy to find; stronger when selected/hovered (not exported to 3D) */}
                                        <rect
                                            data-no-export
                                            x={pos.x - 2}
                                            y={pos.y - 2}
                                            width={size.width + 4}
                                            height={size.height + 4}
                                            fill="none"
                                            stroke={showStrongOutline ? (isSelected ? '#2563eb' : '#94a3b8') : '#d1d5db'}
                                            strokeWidth={showStrongOutline ? (isSelected ? 3 : 2) : 1.5}
                                            strokeDasharray={showStrongOutline && !isSelected ? '6 4' : 'none'}
                                            transform={`rotate(${rot}, ${cx}, ${cy})`}
                                            pointerEvents="none"
                                        />
                                        <image
                                            href={images[key]}
                                            x={pos.x}
                                            y={pos.y}
                                            width={size.width}
                                            height={size.height}
                                            transform={`rotate(${rot}, ${cx}, ${cy})`}
                                            onMouseDown={(event) => handleMouseDown(event, key)}
                                            onDoubleClick={(event) => handleRotateMouseDown(event, key)}
                                            clipPath={`url(#${clipId})`}
                                            style={{ cursor: dragging && isSelected ? 'grabbing' : 'grab', pointerEvents: 'none' }}
                                        />
                                        {/* Visible grab handle - drag this to move image anywhere in the panel (not exported to 3D) */}
                                        {showStrongOutline && (
                                            <g
                                                data-no-export
                                                transform={`rotate(${rot}, ${cx}, ${cy})`}
                                                onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, key); }}
                                                style={{ cursor: dragging && isSelected ? 'grabbing' : 'grab' }}
                                                title="Drag to move image"
                                            >
                                                <rect
                                                    x={cx - grabHandleSize / 2}
                                                    y={grabHandleY}
                                                    width={grabHandleSize}
                                                    height={grabHandleSize}
                                                    rx={6}
                                                    fill="#2563eb"
                                                    stroke="#1d4ed8"
                                                    strokeWidth={2}
                                                />
                                                <text
                                                    x={cx}
                                                    y={grabHandleY + grabHandleSize / 2}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                    fill="white"
                                                    fontSize={20}
                                                    fontWeight="bold"
                                                >
                                                    ⋮⋮
                                                </text>
                                            </g>
                                        )}
                                        {isSelected && renderResizeHandles(key)}
                                        {isSelected && renderRotateHandle(key)}
                                    </g>
                                );
                            })}
                            <rect
                                id="lidFront2"
                                x="98.81" y="2.61"
                                width="48.1" height="47.59"
                                pointerEvents={panelPointerEvents}
                                onClick={(e) => {
                                    e.stopPropagation(); handleSectionClick('section1');
                                }}
                                className={classNames('cls-trnsprnt', { selected: selectedSection === 'section1' })}
                            />
                            <rect
                                id="lidTop2"
                                x="98.81"
                                y="52.44"
                                width="48.1"
                                height="44.54"
                                pointerEvents={panelPointerEvents}
                                onClick={(e) => {
                                    e.stopPropagation(); handleSectionClick('section2');
                                }}
                                className={classNames('cls-trnsprnt', { selected: selectedSection === 'section2' })}
                            />
                            <rect
                                id="back2"
                                x="98.81"
                                y="101.66"
                                width="48.1"
                                height="43.73"
                                pointerEvents={panelPointerEvents}
                                onClick={(e) => {
                                    e.stopPropagation(); handleSectionClick('section3');
                                }}
                                className={classNames('cls-trnsprnt', { selected: selectedSection === 'section3' })}
                            />
                            <rect
                                id="bottom2"
                                x="98.81"
                                y="148.24"
                                width="48.1"
                                height="46.07"
                                pointerEvents={panelPointerEvents}
                                onClick={(e) => {
                                    e.stopPropagation(); handleSectionClick('section4');
                                }}
                                className={classNames('cls-trnsprnt', { selected: selectedSection === 'section4' })}
                            />
                            <rect
                                id="front2"
                                x="98.81"
                                y="196.24"
                                width="48.1"
                                height="45.56"
                                pointerEvents={panelPointerEvents}
                                onClick={(e) => {
                                    e.stopPropagation(); handleSectionClick('section5');
                                }}
                                className={classNames('cls-trnsprnt', { selected: selectedSection === 'section5' })}
                            />

                            <rect
                                id="left2"
                                x="45.58"
                                y="148.24"
                                width="51.71"
                                height="46.07"
                                pointerEvents={panelPointerEvents}
                                onClick={(e) => {
                                    e.stopPropagation(); handleSectionClick('section7');
                                }}
                                className={classNames('cls-trnsprnt', { selected: selectedSection === 'section7' })}
                            />
                            {/* Right panel (section6) – brown panel to the right of the red one; primary overlay + large hit area drawn last so it stays on top of images */}
                            <rect
                                id="right2"
                                x="147.93"
                                y="148.24"
                                width="48.97"
                                height="45.81"
                                pointerEvents={panelPointerEvents}
                                onClick={(e) => {
                                    e.stopPropagation(); handleSectionClick('section6');
                                }}
                                className={classNames('cls-trnsprnt', { selected: selectedSection === 'section6' })}
                            />
                            {/* Section6 hit – large rect drawn last so this panel is always clickable in Add Color mode (not exported to 3D) */}
                            <rect
                                data-no-export
                                id="right2-hit"
                                x="140"
                                y="142"
                                width="70"
                                height="58"
                                fill="white"
                                fillOpacity="0.001"
                                pointerEvents={panelPointerEvents}
                                onClick={(e) => {
                                    e.stopPropagation(); handleSectionClick('section6');
                                }}
                                className={classNames('cls-trnsprnt', { selected: selectedSection === 'section6' })}
                                style={{ cursor: selectedItem === 'color' ? 'pointer' : 'default' }}
                            />
                        </svg>

                        {/* HTML overlay for section6 (brown panel right of red): bypasses SVG hit-testing so this panel is always clickable in Add Color mode */}
                        {selectedItem === 'color' && (
                            <div
                                className="absolute inset-0 pointer-events-none"
                                aria-hidden
                            >
                                <div
                                    className="absolute cursor-pointer pointer-events-auto border-2 border-transparent hover:border-green-400/50 rounded-sm"
                                    style={{
                                        left: `${((147.93 - 4) / 245.76) * 100}%`,
                                        top: `${((148.24 - 4) / 245.76) * 100}%`,
                                        width: `${((48.97 + 8) / 245.76) * 100}%`,
                                        height: `${((45.81 + 8) / 245.76) * 100}%`,
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        handleSectionClick('section6');
                                    }}
                                    onPointerDown={(e) => {
                                        e.stopPropagation();
                                        handleSectionClick('section6');
                                    }}
                                    title="Click to select this panel for color"
                                />
                            </div>
                        )}

                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default DesignContainer;