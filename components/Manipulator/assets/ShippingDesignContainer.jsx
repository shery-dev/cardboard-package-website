"use client";

import { useEffect, useRef, useState } from "react";
import { FaImages } from "react-icons/fa6";
import { IoMdColorPalette } from "react-icons/io";
import { FaArrowRotateLeft } from "react-icons/fa6";
import classNames from 'classnames';
import { useAppContext } from "@/context/Context";

const ShippingDesignContainer = () => {
    const [selectedItem, setSelectedItem] = useState('color');
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
    const svgRef = useRef();
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [applied, setApplied] = useState(false);

    const { extTexColor, sideColors, setSideColors, selectedColor, setSelectedColor, setSelectedSide, setExtTexImgBlob } = useAppContext();

    const convertSvgToJpg = () => {
        const svgElement = svgRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const width = svgElement.clientWidth;
        const height = svgElement.clientHeight;

        const exportWidth = width * 8;
        const exportHeight = height * 8;
        canvas.width = exportWidth;
        canvas.height = exportHeight;

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
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

            const reader = new FileReader();
            reader.onloadend = () => {
                const arrayBuffer = reader.result;
            };
            reader.readAsArrayBuffer(blob);

            const blobUrl = URL.createObjectURL(blob);
            const image = new Image();
            image.src = blobUrl;
            setExtTexImgBlob(blobUrl);
        };

        img.src = url;
    };

    const handleSectionClick = (id) => {
        setSelectedImage(null)
        setSelectedSection(id);
    };

    const handleImageUpload = (event) => {
        if (selectedSection) {
            setSelectedImage(null)
            const timeInstant = Date.now()
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImages(prevImages => ({
                        ...prevImages,
                        [`${selectedSection}-${timeInstant}`]: e.target.result
                    }));
                    setImagePositions(prevPositions => ({
                        ...prevPositions,
                        [`${selectedSection}-${timeInstant}`]: { x: 10, y: 10 }
                    }));
                    setImageSizes(prevSizes => ({
                        ...prevSizes,
                        [`${selectedSection}-${timeInstant}`]: { width: 100, height: 100 }
                    }));
                    setImageRotations(prevRotations => ({
                        ...prevRotations,
                        [`${selectedSection}-${timeInstant}`]: 0
                    }));
                    setSelectedImage(`${selectedSection}-${timeInstant}`);
                    event.target.value = null
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const deleteImage = () => {
        if (selectedImage) {
            setImages(prevImages => {
                const newImages = { ...prevImages };
                delete newImages[selectedImage];
                return newImages;
            });

            setImagePositions(prevPositions => {
                const newPositions = { ...prevPositions };
                delete newPositions[selectedImage];
                return newPositions;
            });

            setImageSizes(prevSizes => {
                const newSizes = { ...prevSizes };
                delete newSizes[selectedImage];
                return newSizes;
            });

            setImageRotations(prevRotations => {
                const newRotations = { ...prevRotations };
                delete newRotations[selectedImage];
                return newRotations;
            });

            setSelectedImage(null);
        }
    };

    const handleMouseDown = (event, id) => {
        event.stopPropagation();
        setDragging(true);
        setSelectedImage(id);
        const svgRect = svgRef.current.getBoundingClientRect();
        setDragStart({
            x: event.clientX - svgRect.left - (imagePositions[id]?.x || 0),
            y: event.clientY - svgRect.top - (imagePositions[id]?.y || 0),
        });
    };

    const handleResizeMouseDown = (event, id) => {
        event.stopPropagation();
        setResizing(true);
        setSelectedImage(id);
        const svgRect = svgRef.current.getBoundingClientRect();
        setDragStart({
            x: event.clientX - svgRect.left,
            y: event.clientY - svgRect.top,
        });
    };

    const handleMouseMove = (event) => {
        if (dragging && selectedImage) {
            const svgRect = svgRef.current.getBoundingClientRect();
            const newX = event.clientX - svgRect.left - dragStart.x;
            const newY = event.clientY - svgRect.top - dragStart.y;
            setImagePositions(prevPositions => ({
                ...prevPositions,
                [selectedImage]: { x: newX, y: newY },
            }));
        } else if (resizing && selectedImage) {
            const svgRect = svgRef.current.getBoundingClientRect();
            const newWidth = event.clientX - svgRect.left - (imagePositions[selectedImage]?.x || 0);
            const newHeight = event.clientY - svgRect.top - (imagePositions[selectedImage]?.y || 0);
            setImageSizes(prevSizes => ({
                ...prevSizes,
                [selectedImage]: { width: newWidth, height: newHeight },
            }));
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

    const handleSvgClick = (event) => {
        // Check if the click is on an image or resize/rotate handle
        if (!event.target.closest('image') && !event.target.closest('rect') && !event.target.closest('circle')) {
            setSelectedImage(null);
        }
    };

    const renderResizeHandles = (imageId) => {
        const position = imagePositions[imageId];
        const size = imageSizes[imageId];
        if (!position || !size) return null;

        const handleSize = 10;
        const handles = [
            { x: position.x, y: position.y }, // top-left
            { x: position.x + size.width, y: position.y }, // top-right
            { x: position.x, y: position.y + size.height }, // bottom-left
            { x: position.x + size.width, y: position.y + size.height }, // bottom-right
        ];

        return handles.map((handle, index) => (
            <rect
                key={index}
                x={handle.x - handleSize / 2}
                y={handle.y - handleSize / 2}
                width={handleSize}
                height={handleSize}
                fill="blue"
                cursor="nwse-resize"
                onMouseDown={(event) => handleResizeMouseDown(event, imageId)}
            />
        ));
    };

    const renderRotateHandle = (imageId) => {
        const position = imagePositions[imageId];
        const size = imageSizes[imageId];
        if (!position || !size) return null;

        const handleSize = 10;
        const handle = {
            x: position.x + size.width / 2,
            y: position.y - 20, // Adjust the distance of the handle from the image
        };

        return (
            <circle
                cx={handle.x}
                cy={handle.y}
                r={handleSize}
                fill="red"
                cursor="crosshair"
                onMouseDown={(event) => handleRotateMouseDown(event, imageId)}
            />
        );
    };

    useEffect(() => {
        if (selectedSection === 'section1') {
            setSelectedSide('front')
        } else if (selectedSection === 'section2') {
            setSelectedSide('left')
        } else if (selectedSection === 'section3') {
            setSelectedSide('right')
        } else if (selectedSection === 'section4') {
            setSelectedSide('back')
        } else if (selectedSection === 'section5') {
            setSelectedSide('bottom')
        }
    }, [selectedSection])

    useEffect(() => {

        if (selectedSection === 'section1') {
            setSideColors((prev) => ({
                ...prev,
                front: selectedColor
            }))
        } else if (selectedSection === 'section2') {
            setSideColors((prev) => ({
                ...prev,
                left: selectedColor
            }))
        } else if (selectedSection === 'section3') {
            setSideColors((prev) => ({
                ...prev,
                right: selectedColor
            }))
        } else if (selectedSection === 'section4') {
            setSideColors((prev) => ({
                ...prev,
                back: selectedColor
            }))
        } else if (selectedSection === 'section5') {
            setSideColors((prev) => ({
                ...prev,
                bottom: selectedColor
            }))

        }

    }, [selectedColor])

    useEffect(() => {
        if (selectedSection) {
            const timer = setTimeout(() => {
                convertSvgToJpg();
            }, 80);
            return () => clearTimeout(timer);
        }
    }, [sideColors]);

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
                        <div className="px-4 py-2 flex justify-between items-center">
                            <span className="text-base font-semibold text-gray-700">Color</span>
                            <input
                                type="color"
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                className=" border-none cursor-pointer"
                            />
                        </div>
                    )}
                    {selectedItem === 'images' && (
                        <div className="px-4 py-2 flex justify-between items-center">
                            <input
                                type="file"
                                accept="image/*"

                                onChange={handleImageUpload}
                            />
                        </div>
                    )}
                </div>
                <div className="bg-white px-2 rounded-b-lg">
                    <div className=" pb-4 flex justify-end items-center gap-4">
                        <button
                            className={classNames('px-3 py-2 text-sm font-semibold bg-green-500 text-white rounded-md mt-4 hover:bg-green-600 transition-colors')}
                            onClick={convertSvgToJpg}
                            disabled={applied}
                        >
                            {
                                applied ? 'Applying...' : 'Apply Design'
                            }
                        </button>
                        <button
                            className={classNames('px-1 py-2 text-sm font-semibold bg-red-500 text-white rounded-md mt-4', { 'opacity-50 cursor-not-allowed': !Object.keys(images).length })}
                            onClick={deleteImage}
                            disabled={!Object.keys(images).length}
                        >
                            Delete
                        </button>
                    </div>
                    <div className="w-full" ref={containerRef}>
                        <svg
                            version="1.1"
                            id="Layer_1"

                            ref={svgRef}
                            width="1920"
                            height="1080"
                            viewBox="0 0 1920 1080"
                            style={{ enableBackground: "new 0 0 1920 1080" }}
                            xmlSpace="preserve"
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onClick={handleSvgClick}
                        >
                            <defs>
                                <style >
                                    {`
                                  .st0{fill:#AA7B3C;}
	                              .st1{fill:#AA8B68;}
	                              .st2{fill:#B2906B;}
                                  .cls-front {
                                            fill:${sideColors.front}
                                        }
                                        .cls-left {
                                            fill:${sideColors.left}
                                        }
                                        .cls-right {
                                            fill:${sideColors.right}
                                        }
                                        .cls-back {
                                            fill:${sideColors.back}
                                        }
                                        .cls-bottom {
                                            fill:${sideColors.bottom}
                                        }
                                        .cls-trnsprnt {
                                            fill: transparent
                                        }
      `}
                                </style>
                                <clipPath id="clip-dieline">
                                    <path d="M968.1,0c170.4,0,340.9,0,511.3,0c0,0,0,1.1,0,1.1c-0.6,3.3-1.7,6.6-1.7,9.9c-0.1,97.8,0,195.7,0,293.5
		c0,0-0.2-0.2-0.2-0.2c-136.4,0-272.9,0.1-409.3,0.1c-33.5,0-66.9,0.2-100.4,0.2l0-0.1c0.1-6.4,0.2-12.9,0.2-19.3
		c0.1-94.1,0.1-188.3,0.2-282.4C968.2,1.9,968.2,0.9,968.1,0z
	 M8.5,0c169.9,0,339.7,0,509.6,0c0.1,7.6,0.3,15.1,0.3,22.7c0,72.2,0,144.5,0,216.7c0,21.7-0.3,43.3-0.4,65
		c-169.7,0-339.5,0-509.2-0.1c-0.1-4.8-0.2-9.6-0.2-14.4C8.5,193.3,8.5,96.6,8.5,0z
	M518.1,1077.6c-169.9,0-339.7,0-509.6,0c0.2-0.8,0.5-1.5,0.5-2.3c0-100.7-0.1-201.4-0.2-302
		c169.7,0,339.5,0,509.2-0.1C518.1,874.7,518.1,976.1,518.1,1077.6z M1477.7,1077.6c-169.9,0-339.7,0-509.6,0c0-1,0-1.9,0-2.9c0-100.6,0-201.1,0-301.7l-0.3-0.3
		c4,0.2,7.9,0.4,11.9,0.4c166,0.1,331.9,0.1,497.9,0.1C1477.6,874.7,1477.7,976.1,1477.7,1077.6z
	 M1498.2,0c136.4,0,272.7,0,409.1,0c0,4,0,8.1,0,12.1c0,98.9,0.1,197.8,0.1,296.7c-1.4,0.1-2.8,0.3-4.3,0.3
		c-132.6,0-265.3,0-397.9,0c-2.2,0-4.4-0.5-6.5-0.8c-0.3-1.9-0.6-3-0.6-4.1C1498,202.8,1498.1,101.4,1498.2,0z M1907.2,1077.6c-136.4,0-272.7,0-409.1,0c-0.1-4-0.2-7.9-0.2-11.9c0-95.4,0-190.8,0-286.3
		c0-3.4,0.4-6.9,0.6-11c4.1,0,7.5,0,10.8,0c80.4,0,160.8,0,241.1,0c52.3,0,104.5,0.2,156.8,0.3
		C1907.3,871.7,1907.2,974.6,1907.2,1077.6z
	M947.6,1080c-136.9,0-273.8,0-410.8,0l0-1.1c0.6-4.9,1.6-9.8,1.7-14.7c0.2-97.7,0.2-195.5,0.3-293.2
		c132.3-0.1,264.5-0.1,396.8-0.2c3.4,0,6.8,0.2,10.2,0.3c0,76.3,0,152.6,0.1,229c0,25.7,0.2,51.4,0.4,77.1
		C946.8,1078.1,947.2,1079.1,947.6,1080z
	M536.9,0c136.9,0,273.8,0,410.8,0c-0.4,0.9-0.9,1.9-1.3,2.8c-0.1,4.4-0.4,8.8-0.4,13.2
		c-0.1,97.6-0.1,195.2-0.1,292.8c-1.7,0.1-3.4,0.3-5.1,0.3c-134-0.1-267.9-0.1-401.9-0.2c-0.1-97.7-0.1-195.5-0.3-293.2
		c0-4.9-1.1-9.8-1.7-14.7C536.8,1.1,536.9,0,536.9,0z
M1477.6,768.2c-166,0-332.1,0.1-498.1,0.1c-4,0-7.9,0.3-11.9,0.5c-0.4-0.2-0.8-0.4-1.2-0.5
		c-2.3-0.9-4.6-1.8-6.9-2.8c0-151.2,0-302.3,0-453.5c2.3-0.9,4.6-1.8,6.9-2.8c0.4-0.2,0.8-0.4,1.2-0.5c4,0.2,7.9,0.5,11.9,0.5
		c166.1,0.1,332.1,0.1,498.2,0.1c2.9,0.9,5.7,1.9,8.6,2.8c0,151.1,0,302.2,0,453.3C1483.3,766.4,1480.4,767.3,1477.6,768.2z M1489.7,312.2c3.1-0.1,6.2-0.3,9.4-0.3c134.6,0,269.3,0,403.9,0c3.4,0,6.7,0,10.6,0c0,151.4,0,301.8,0,453.1
		c-2,0.3-4.2,0.9-6.4,0.9c-137.8,0-275.5,0-413.3,0c-1.4,0-2.8-0.2-4.2-0.3C1489.7,614.3,1489.7,463.2,1489.7,312.2z M518,768.3c-169.7,0-339.5,0-509.2,0c-2.9-0.9-5.7-1.7-8.6-2.6C0.1,721.4,0,677.2,0,632.9
		c0-107,0.1-214,0.2-321c2.9-0.9,5.7-1.7,8.6-2.6c169.7,0,339.5,0,509.2,0c2.8,0.9,5.7,1.9,8.5,2.8c0,151.1,0,302.3,0,453.4
		C523.7,766.4,520.9,767.3,518,768.3z M530.1,312.1c3.1-0.1,6.2-0.4,9.4-0.4c135.2,0,270.4,0,405.6,0c3.3,0,6.7,0,10.5,0c0,151.4,0,301.8,0,453.2
		c-2,0.3-4.1,0.9-6.3,0.9c-138.3,0-276.6,0-415,0c-1.4,0-2.8-0.2-4.2-0.3C530.1,614.4,530.1,463.2,530.1,312.1z"/>
                                </clipPath>

                            </defs>
                            <g>
                                <path class="st2" d="M968.1,0c170.4,0,340.9,0,511.3,0c0,0,0,1.1,0,1.1c-0.6,3.3-1.7,6.6-1.7,9.9c-0.1,97.8,0,195.7,0,293.5
		c0,0-0.2-0.2-0.2-0.2c-136.4,0-272.9,0.1-409.3,0.1c-33.5,0-66.9,0.2-100.4,0.2l0-0.1c0.1-6.4,0.2-12.9,0.2-19.3
		c0.1-94.1,0.1-188.3,0.2-282.4C968.2,1.9,968.2,0.9,968.1,0z"/>
                                <path class="st2" d="M8.5,0c169.9,0,339.7,0,509.6,0c0.1,7.6,0.3,15.1,0.3,22.7c0,72.2,0,144.5,0,216.7c0,21.7-0.3,43.3-0.4,65
		c-169.7,0-339.5,0-509.2-0.1c-0.1-4.8-0.2-9.6-0.2-14.4C8.5,193.3,8.5,96.6,8.5,0z"/>
                                <path class="st2" d="M518.1,1077.6c-169.9,0-339.7,0-509.6,0c0.2-0.8,0.5-1.5,0.5-2.3c0-100.7-0.1-201.4-0.2-302
		c169.7,0,339.5,0,509.2-0.1C518.1,874.7,518.1,976.1,518.1,1077.6z"/>
                                <path class="st2" d="M1477.7,1077.6c-169.9,0-339.7,0-509.6,0c0-1,0-1.9,0-2.9c0-100.6,0-201.1,0-301.7l-0.3-0.3
		c4,0.2,7.9,0.4,11.9,0.4c166,0.1,331.9,0.1,497.9,0.1C1477.6,874.7,1477.7,976.1,1477.7,1077.6z"/>
                                <path class="st2" d="M1498.2,0c136.4,0,272.7,0,409.1,0c0,4,0,8.1,0,12.1c0,98.9,0.1,197.8,0.1,296.7c-1.4,0.1-2.8,0.3-4.3,0.3
		c-132.6,0-265.3,0-397.9,0c-2.2,0-4.4-0.5-6.5-0.8c-0.3-1.9-0.6-3-0.6-4.1C1498,202.8,1498.1,101.4,1498.2,0z"/>
                                <path class="st2" d="M1907.2,1077.6c-136.4,0-272.7,0-409.1,0c-0.1-4-0.2-7.9-0.2-11.9c0-95.4,0-190.8,0-286.3
		c0-3.4,0.4-6.9,0.6-11c4.1,0,7.5,0,10.8,0c80.4,0,160.8,0,241.1,0c52.3,0,104.5,0.2,156.8,0.3
		C1907.3,871.7,1907.2,974.6,1907.2,1077.6z"/>
                                <path class="st2" d="M947.6,1080c-136.9,0-273.8,0-410.8,0l0-1.1c0.6-4.9,1.6-9.8,1.7-14.7c0.2-97.7,0.2-195.5,0.3-293.2
		c132.3-0.1,264.5-0.1,396.8-0.2c3.4,0,6.8,0.2,10.2,0.3c0,76.3,0,152.6,0.1,229c0,25.7,0.2,51.4,0.4,77.1
		C946.8,1078.1,947.2,1079.1,947.6,1080z"/>
                                <path class="st2" d="M536.9,0c136.9,0,273.8,0,410.8,0c-0.4,0.9-0.9,1.9-1.3,2.8c-0.1,4.4-0.4,8.8-0.4,13.2
		c-0.1,97.6-0.1,195.2-0.1,292.8c-1.7,0.1-3.4,0.3-5.1,0.3c-134-0.1-267.9-0.1-401.9-0.2c-0.1-97.7-0.1-195.5-0.3-293.2
		c0-4.9-1.1-9.8-1.7-14.7C536.8,1.1,536.9,0,536.9,0z"/>
                                <path class="st0" d="M1477.6,768.2c-166,0-332.1,0.1-498.1,0.1c-4,0-7.9,0.3-11.9,0.5c-0.4-0.2-0.8-0.4-1.2-0.5
		c-2.3-0.9-4.6-1.8-6.9-2.8c0-151.2,0-302.3,0-453.5c2.3-0.9,4.6-1.8,6.9-2.8c0.4-0.2,0.8-0.4,1.2-0.5c4,0.2,7.9,0.5,11.9,0.5
		c166.1,0.1,332.1,0.1,498.2,0.1c2.9,0.9,5.7,1.9,8.6,2.8c0,151.1,0,302.2,0,453.3C1483.3,766.4,1480.4,767.3,1477.6,768.2z" onClick={(e) => { e.stopPropagation(); handleSectionClick('section3'); }} className={classNames('cls-right', { selected: selectedSection === 'section3' })} />
                                <path class="st0" d="M1489.7,312.2c3.1-0.1,6.2-0.3,9.4-0.3c134.6,0,269.3,0,403.9,0c3.4,0,6.7,0,10.6,0c0,151.4,0,301.8,0,453.1
		c-2,0.3-4.2,0.9-6.4,0.9c-137.8,0-275.5,0-413.3,0c-1.4,0-2.8-0.2-4.2-0.3C1489.7,614.3,1489.7,463.2,1489.7,312.2z" onClick={(e) => { e.stopPropagation(); handleSectionClick('section1'); }} className={classNames('cls-front', { selected: selectedSection === 'section1' })} />
                                <path class="st0" d="M518,768.3c-169.7,0-339.5,0-509.2,0c-2.9-0.9-5.7-1.7-8.6-2.6C0.1,721.4,0,677.2,0,632.9
		c0-107,0.1-214,0.2-321c2.9-0.9,5.7-1.7,8.6-2.6c169.7,0,339.5,0,509.2,0c2.8,0.9,5.7,1.9,8.5,2.8c0,151.1,0,302.3,0,453.4
		C523.7,766.4,520.9,767.3,518,768.3z" onClick={(e) => { e.stopPropagation(); handleSectionClick('section2'); }} className={classNames('cls-left', { selected: selectedSection === 'section2' })} />
                                <path class="st0" d="M530.1,312.1c3.1-0.1,6.2-0.4,9.4-0.4c135.2,0,270.4,0,405.6,0c3.3,0,6.7,0,10.5,0c0,151.4,0,301.8,0,453.2
		c-2,0.3-4.1,0.9-6.3,0.9c-138.3,0-276.6,0-415,0c-1.4,0-2.8-0.2-4.2-0.3C530.1,614.4,530.1,463.2,530.1,312.1z" onClick={(e) => { e.stopPropagation(); handleSectionClick('section4'); }} className={classNames('cls-back', { selected: selectedSection === 'section4' })} />
                            </g>

                            {Object.keys(images).map((key) => (
                                <g key={key}>
                                    <image
                                        href={images[key]}
                                        x={imagePositions[key]?.x || 0}
                                        y={imagePositions[key]?.y || 0}
                                        width={imageSizes[key]?.width || 100}
                                        height={imageSizes[key]?.height || 100}
                                        transform={`rotate(${imageRotations[key] || 0}, ${(imagePositions[key]?.x || 0) + (imageSizes[key]?.width || 0) / 2}, ${(imagePositions[key]?.y || 0) + (imageSizes[key]?.height || 0) / 2})`}
                                        onMouseDown={(event) => handleMouseDown(event, key)}
                                        onDoubleClick={(event) => handleRotateMouseDown(event, key)}
                                        clipPath={`url(#clip-dieline)`}
                                    />
                                    {selectedImage === key && renderResizeHandles(key)}
                                    {selectedImage === key && renderRotateHandle(key)}
                                </g>
                            ))}

                            <path class="st2" d="M968.1,0c170.4,0,340.9,0,511.3,0c0,0,0,1.1,0,1.1c-0.6,3.3-1.7,6.6-1.7,9.9c-0.1,97.8,0,195.7,0,293.5
		c0,0-0.2-0.2-0.2-0.2c-136.4,0-272.9,0.1-409.3,0.1c-33.5,0-66.9,0.2-100.4,0.2l0-0.1c0.1-6.4,0.2-12.9,0.2-19.3
		c0.1-94.1,0.1-188.3,0.2-282.4C968.2,1.9,968.2,0.9,968.1,0z"/>
                            <path class="st2" d="M8.5,0c169.9,0,339.7,0,509.6,0c0.1,7.6,0.3,15.1,0.3,22.7c0,72.2,0,144.5,0,216.7c0,21.7-0.3,43.3-0.4,65
		c-169.7,0-339.5,0-509.2-0.1c-0.1-4.8-0.2-9.6-0.2-14.4C8.5,193.3,8.5,96.6,8.5,0z"/>
                            <path class="st2" d="M518.1,1077.6c-169.9,0-339.7,0-509.6,0c0.2-0.8,0.5-1.5,0.5-2.3c0-100.7-0.1-201.4-0.2-302
		c169.7,0,339.5,0,509.2-0.1C518.1,874.7,518.1,976.1,518.1,1077.6z"/>
                            <path class="st2" d="M1477.7,1077.6c-169.9,0-339.7,0-509.6,0c0-1,0-1.9,0-2.9c0-100.6,0-201.1,0-301.7l-0.3-0.3
		c4,0.2,7.9,0.4,11.9,0.4c166,0.1,331.9,0.1,497.9,0.1C1477.6,874.7,1477.7,976.1,1477.7,1077.6z"/>
                            <path class="st2" d="M1498.2,0c136.4,0,272.7,0,409.1,0c0,4,0,8.1,0,12.1c0,98.9,0.1,197.8,0.1,296.7c-1.4,0.1-2.8,0.3-4.3,0.3
		c-132.6,0-265.3,0-397.9,0c-2.2,0-4.4-0.5-6.5-0.8c-0.3-1.9-0.6-3-0.6-4.1C1498,202.8,1498.1,101.4,1498.2,0z"/>
                            <path class="st2" d="M1907.2,1077.6c-136.4,0-272.7,0-409.1,0c-0.1-4-0.2-7.9-0.2-11.9c0-95.4,0-190.8,0-286.3
		c0-3.4,0.4-6.9,0.6-11c4.1,0,7.5,0,10.8,0c80.4,0,160.8,0,241.1,0c52.3,0,104.5,0.2,156.8,0.3
		C1907.3,871.7,1907.2,974.6,1907.2,1077.6z"/>
                            <path class="st2" d="M947.6,1080c-136.9,0-273.8,0-410.8,0l0-1.1c0.6-4.9,1.6-9.8,1.7-14.7c0.2-97.7,0.2-195.5,0.3-293.2
		c132.3-0.1,264.5-0.1,396.8-0.2c3.4,0,6.8,0.2,10.2,0.3c0,76.3,0,152.6,0.1,229c0,25.7,0.2,51.4,0.4,77.1
		C946.8,1078.1,947.2,1079.1,947.6,1080z"/>
                            <path class="st2" d="M536.9,0c136.9,0,273.8,0,410.8,0c-0.4,0.9-0.9,1.9-1.3,2.8c-0.1,4.4-0.4,8.8-0.4,13.2
		c-0.1,97.6-0.1,195.2-0.1,292.8c-1.7,0.1-3.4,0.3-5.1,0.3c-134-0.1-267.9-0.1-401.9-0.2c-0.1-97.7-0.1-195.5-0.3-293.2
		c0-4.9-1.1-9.8-1.7-14.7C536.8,1.1,536.9,0,536.9,0z"/>
                            <path class="st0" d="M1477.6,768.2c-166,0-332.1,0.1-498.1,0.1c-4,0-7.9,0.3-11.9,0.5c-0.4-0.2-0.8-0.4-1.2-0.5
		c-2.3-0.9-4.6-1.8-6.9-2.8c0-151.2,0-302.3,0-453.5c2.3-0.9,4.6-1.8,6.9-2.8c0.4-0.2,0.8-0.4,1.2-0.5c4,0.2,7.9,0.5,11.9,0.5
		c166.1,0.1,332.1,0.1,498.2,0.1c2.9,0.9,5.7,1.9,8.6,2.8c0,151.1,0,302.2,0,453.3C1483.3,766.4,1480.4,767.3,1477.6,768.2z" onClick={(e) => { e.stopPropagation(); handleSectionClick('section3'); }} className={classNames('cls-trnsprnt', { selected: selectedSection === 'section3' })} />
                            <path class="st0" d="M1489.7,312.2c3.1-0.1,6.2-0.3,9.4-0.3c134.6,0,269.3,0,403.9,0c3.4,0,6.7,0,10.6,0c0,151.4,0,301.8,0,453.1
		c-2,0.3-4.2,0.9-6.4,0.9c-137.8,0-275.5,0-413.3,0c-1.4,0-2.8-0.2-4.2-0.3C1489.7,614.3,1489.7,463.2,1489.7,312.2z" onClick={(e) => { e.stopPropagation(); handleSectionClick('section1'); }} className={classNames('cls-trnsprnt', { selected: selectedSection === 'section1' })} />
                            <path class="st0" d="M518,768.3c-169.7,0-339.5,0-509.2,0c-2.9-0.9-5.7-1.7-8.6-2.6C0.1,721.4,0,677.2,0,632.9
		c0-107,0.1-214,0.2-321c2.9-0.9,5.7-1.7,8.6-2.6c169.7,0,339.5,0,509.2,0c2.8,0.9,5.7,1.9,8.5,2.8c0,151.1,0,302.3,0,453.4
		C523.7,766.4,520.9,767.3,518,768.3z" onClick={(e) => { e.stopPropagation(); handleSectionClick('section2'); }} className={classNames('cls-trnsprnt', { selected: selectedSection === 'section2' })} />
                            <path class="st0" d="M530.1,312.1c3.1-0.1,6.2-0.4,9.4-0.4c135.2,0,270.4,0,405.6,0c3.3,0,6.7,0,10.5,0c0,151.4,0,301.8,0,453.2
		c-2,0.3-4.1,0.9-6.3,0.9c-138.3,0-276.6,0-415,0c-1.4,0-2.8-0.2-4.2-0.3C530.1,614.4,530.1,463.2,530.1,312.1z" onClick={(e) => { e.stopPropagation(); handleSectionClick('section4'); }} className={classNames('cls-trnsprnt', { selected: selectedSection === 'section4' })} />

                        </svg>
                        {/* <svg
                            ref={svgRef}
                            width="400"
                            height="400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 245.76 245.76"
                            className='w-full h-full border overflow-hidden'
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
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
                            </defs>
                            <g id="Layer_2" data-name="Layer 2">
                                <g id="MailerTexture">
                                    <path
                                        d="M99.78,195.39c-.6-.07-1.21-.21-1.81-.22H3.73c-1.82,0-1.82,0-1.82-1.81V149c0-1.55,0-1.55,1.6-1.55H99l0-.39c-.43,0-.86-.09-1.29-.09-7.23,0-14.46,0-21.7,0-1.17,0-1.47-.34-1.47-1.48q.06-22.12,0-44.24c0-1.19.27-1.58,1.52-1.57q10.43.09,20.86,0a33.44,33.44,0,0,0,4.18-.54l0-.38-9.49-1.7c-4.21-.75-8.43-1.49-12.64-2.25-1.5-.27-3-.6-4.5-.85-2.86-.49-4.14-2.37-4.16-5-.08-9.35-.06-18.7,0-28.05,0-2.94,1.59-4.78,4.66-5.3C79.31,54.86,83.66,54,88,53.25c3.9-.69,7.81-1.35,11.71-2l.08-.31a5.47,5.47,0,0,0-1.34-.33q-12.11,0-24.22,0c-1.44,0-2.88,0-4.32,0-.84,0-1.13-.26-1.1-1.1.28-8.23,1.31-16.31,4.27-24.07,2.51-6.56,6-12.49,11.31-17.14,4.22-3.68,9-5.94,14.84-5.92q23.44.09,46.88,0a21.36,21.36,0,0,1,13,4.44c5.62,4.14,9.29,9.74,12.09,16a58.78,58.78,0,0,1,4.42,15.3c.56,3.78.55,7.65.8,11.49.08,1.1-.67,1-1.35,1q-14.08,0-28.18,0a7.81,7.81,0,0,0-1.42.24l.05.34c3,.52,6,1,9,1.56s6,1,9.06,1.51c2.55.44,5.1.92,7.65,1.37a5.52,5.52,0,0,1,4.25,5q-.1,14.15,0,28.3a5.55,5.55,0,0,1-4.21,5.27c-3.87.66-7.75,1.29-11.62,2-4.41.76-8.81,1.55-13.22,2.33a5.78,5.78,0,0,0-2,.61,12.22,12.22,0,0,0,2.73.62q11.21.08,22.42,0c1.06,0,1.36.3,1.36,1.36q0,22.29,0,44.59c0,1.1-.38,1.33-1.39,1.33-7.31,0-14.63,0-21.94,0h-1.26l0,.33a13.54,13.54,0,0,0,1.4.14h70.14c8,0,16,0,24,0,1.25,0,1.52.38,1.52,1.56,0,14.87,0,29.74,0,44.6,0,1.58,0,1.59-1.57,1.59H147.35a3.62,3.62,0,0,0-1.79.48h1.5c6.95,0,13.91,0,20.86,0,1.14,0,1.4.35,1.4,1.44q0,22.29,0,44.59c0,1.14-.29,1.5-1.46,1.5q-45.21,0-90.41,0c-1.17,0-1.46-.36-1.46-1.5q.06-22.29,0-44.59c0-1.09.26-1.45,1.4-1.44,7.43,0,14.87,0,22.3,0Z"
                                        className="cls-2 overflow-hidden"
                                    />
                                    <rect
                                        id="lidFront"
                                        x="98.81" y="2.61"
                                        width="48.1" height="47.59"
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
                                        onClick={(e) => {
                                            e.stopPropagation(); handleSectionClick('section7');
                                        }}
                                        className={classNames('cls-right', { selected: selectedSection === 'section7' })}
                                    />
                                </g>
                            </g>

                            {Object.keys(images).map((key) => (
                                <g key={key}>
                                    <image
                                        href={images[key]}
                                        x={imagePositions[key]?.x || 0}
                                        y={imagePositions[key]?.y || 0}
                                        width={imageSizes[key]?.width || 100}
                                        height={imageSizes[key]?.height || 100}
                                        transform={`rotate(${imageRotations[key] || 0}, ${(imagePositions[key]?.x || 0) + (imageSizes[key]?.width || 0) / 2}, ${(imagePositions[key]?.y || 0) + (imageSizes[key]?.height || 0) / 2})`}
                                        onMouseDown={(event) => handleMouseDown(event, key)}
                                        onDoubleClick={(event) => handleRotateMouseDown(event, key)}
                                        clipPath={`url(#clip-dieline)`}
                                    />
                                    {selectedImage === key && renderResizeHandles(key)}
                                    {selectedImage === key && renderRotateHandle(key)}
                                </g>
                            ))}
                            <rect
                                id="lidFront"
                                x="98.81" y="2.61"
                                width="48.1" height="47.59"
                                onClick={(e) => {
                                    e.stopPropagation(); handleSectionClick('section1');
                                }}
                                className={classNames('cls-trnsprnt', { selected: selectedSection === 'section1' })}
                            />
                            <rect
                                id="lidTop"
                                x="98.81"
                                y="52.44"
                                width="48.1"
                                height="44.54"
                                onClick={(e) => {
                                    e.stopPropagation(); handleSectionClick('section2');
                                }}
                                className={classNames('cls-trnsprnt', { selected: selectedSection === 'section2' })}
                            />
                            <rect
                                id="back"
                                x="98.81"
                                y="101.66"
                                width="48.1"
                                height="43.73"
                                onClick={(e) => {
                                    e.stopPropagation(); handleSectionClick('section3');
                                }}
                                className={classNames('cls-trnsprnt', { selected: selectedSection === 'section3' })}
                            />
                            <rect
                                id="bottom"
                                x="98.81"
                                y="148.24"
                                width="48.1"
                                height="46.07"
                                onClick={(e) => {
                                    e.stopPropagation(); handleSectionClick('section4');
                                }}
                                className={classNames('cls-trnsprnt', { selected: selectedSection === 'section4' })}
                            />
                            <rect
                                id="front"
                                x="98.81"
                                y="196.24"
                                width="48.1"
                                height="45.56"
                                onClick={(e) => {
                                    e.stopPropagation(); handleSectionClick('section5');
                                }}
                                className={classNames('cls-trnsprnt', { selected: selectedSection === 'section5' })}
                            />

                            <rect
                                id="right"
                                x="147.93"
                                y="148.24"
                                width="48.97"
                                height="45.81"
                                onClick={(e) => {
                                    e.stopPropagation(); handleSectionClick('section6');
                                }}
                                className={classNames('cls-trnsprnt', { selected: selectedSection === 'section6' })}
                            />
                            <rect
                                id="left"
                                x="45.58"
                                y="148.24"
                                width="51.71"
                                height="46.07"
                                onClick={(e) => {
                                    e.stopPropagation(); handleSectionClick('section7');
                                }}
                                className={classNames('cls-trnsprnt', { selected: selectedSection === 'section7' })}
                            />
                        </svg> */}

                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShippingDesignContainer;