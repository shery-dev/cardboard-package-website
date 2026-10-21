// "use client";

// import { useEffect, useRef, useState } from "react";
// import { FaImages } from "react-icons/fa6";
// import { IoMdColorPalette } from "react-icons/io";
// import classNames from 'classnames';
// import { useAppContext } from "@/context/Context";

// const PizzaDesignContainer = () => {
//     const [selectedItem, setSelectedItem] = useState('color')
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [rotating, setRotating] = useState(false);
//     const [selectedSection, setSelectedSection] = useState(null);
//     const [images, setImages] = useState({});
//     const [dragging, setDragging] = useState(false);
//     const [resizing, setResizing] = useState(false);
//     const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//     const [imagePositions, setImagePositions] = useState({});
//     const [imageSizes, setImageSizes] = useState({});
//     const svgRef = useRef();
//     const canvasRef = useRef(null);
//     const containerRef = useRef(null);
//     const [applied, setApplied] = useState(false)
//     const [imageRotations, setImageRotations] = useState({});


//     const { extTexColor, sideColors, setSideColors, selectedColor, setSelectedColor, setSelectedSide, setExtTexImgBlob } = useAppContext();

//     const convertSvgToJpg = () => {
//         const svgElement = svgRef.current;
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');

//         const width = svgElement.clientWidth;
//         const height = svgElement.clientHeight;

//         const exportWidth = width * 8;
//         const exportHeight = height * 8;
//         canvas.width = exportWidth;
//         canvas.height = exportHeight;

//         const svgData = new XMLSerializer().serializeToString(svgElement);
//         const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
//         const url = URL.createObjectURL(svgBlob);

//         const img = new Image();
//         img.onload = () => {
//             ctx.clearRect(0, 0, exportWidth, exportHeight);
//             ctx.drawImage(img, 0, 0, exportWidth, exportHeight);

//             const dataUrl = canvas.toDataURL('image/jpeg', 1.0);

//             const byteString = atob(dataUrl.split(',')[1]);
//             const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
//             const ab = new ArrayBuffer(byteString.length);
//             const ia = new Uint8Array(ab);
//             for (let i = 0; i < byteString.length; i++) {
//                 ia[i] = byteString.charCodeAt(i);
//             }
//             const blob = new Blob([ab], { type: mimeString });

//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 const arrayBuffer = reader.result;
//             };
//             reader.readAsArrayBuffer(blob);

//             const blobUrl = URL.createObjectURL(blob);
//             const image = new Image();
//             image.src = blobUrl;
//             setExtTexImgBlob(blobUrl);
//         };

//         img.src = url;
//     };

//     const handleSectionClick = (id) => {
//         setSelectedImage(null)
//         setSelectedSection(id);
//     };

//     const handleImageUpload = (event) => {
//         if (selectedSection) {
//             setSelectedImage(null)
//             const timeInstant = Date.now()
//             const file = event.target.files[0];
//             if (file) {
//                 const reader = new FileReader();
//                 reader.onload = (e) => {
//                     setImages(prevImages => ({
//                         ...prevImages,
//                         [`${selectedSection}-${timeInstant}`]: e.target.result
//                     }));
//                     setImagePositions(prevPositions => ({
//                         ...prevPositions,
//                         [`${selectedSection}-${timeInstant}`]: { x: 10, y: 10 }
//                     }));
//                     setImageSizes(prevSizes => ({
//                         ...prevSizes,
//                         [`${selectedSection}-${timeInstant}`]: { width: 100, height: 100 }
//                     }));
//                     setImageRotations(prevRotations => ({
//                         ...prevRotations,
//                         [`${selectedSection}-${timeInstant}`]: 0
//                     }));
//                     setSelectedImage(`${selectedSection}-${timeInstant}`);
//                     event.target.value = null
//                 };
//                 reader.readAsDataURL(file);
//             }
//         }
//     };

//     const deleteImage = () => {
//         if (selectedImage) {
//             setImages(prevImages => {
//                 const newImages = { ...prevImages };
//                 delete newImages[selectedImage];
//                 return newImages;
//             });

//             setImagePositions(prevPositions => {
//                 const newPositions = { ...prevPositions };
//                 delete newPositions[selectedImage];
//                 return newPositions;
//             });

//             setImageSizes(prevSizes => {
//                 const newSizes = { ...prevSizes };
//                 delete newSizes[selectedImage];
//                 return newSizes;
//             });

//             setImageRotations(prevRotations => {
//                 const newRotations = { ...prevRotations };
//                 delete newRotations[selectedImage];
//                 return newRotations;
//             });

//             setSelectedImage(null);
//         }
//     };

//     const handleMouseDown = (event, id) => {
//         event.stopPropagation();
//         setDragging(true);
//         setSelectedImage(id);
//         const svgRect = svgRef.current.getBoundingClientRect();
//         setDragStart({
//             x: event.clientX - svgRect.left - (imagePositions[id]?.x || 0),
//             y: event.clientY - svgRect.top - (imagePositions[id]?.y || 0),
//         });
//     };


//     const handleResizeMouseDown = (event, id) => {
//         event.stopPropagation();
//         setResizing(true);
//         setSelectedImage(id);
//         const svgRect = svgRef.current.getBoundingClientRect();
//         setDragStart({
//             x: event.clientX - svgRect.left,
//             y: event.clientY - svgRect.top,
//         });
//     };

//     const handleMouseMove = (event) => {
//         if (dragging && selectedImage) {
//             const svgRect = svgRef.current.getBoundingClientRect();
//             const newX = event.clientX - svgRect.left - dragStart.x;
//             const newY = event.clientY - svgRect.top - dragStart.y;
//             setImagePositions(prevPositions => ({
//                 ...prevPositions,
//                 [selectedImage]: { x: newX, y: newY },
//             }));
//         } else if (resizing && selectedImage) {
//             const svgRect = svgRef.current.getBoundingClientRect();
//             const newWidth = event.clientX - svgRect.left - (imagePositions[selectedImage]?.x || 0);
//             const newHeight = event.clientY - svgRect.top - (imagePositions[selectedImage]?.y || 0);
//             setImageSizes(prevSizes => ({
//                 ...prevSizes,
//                 [selectedImage]: { width: newWidth, height: newHeight },
//             }));
//         } else if (rotating && selectedImage) {
//             const svgRect = svgRef.current.getBoundingClientRect();
//             const centerX = (imagePositions[selectedImage]?.x || 0) + (imageSizes[selectedImage]?.width || 0) / 2;
//             const centerY = (imagePositions[selectedImage]?.y || 0) + (imageSizes[selectedImage]?.height || 0) / 2;

//             const newRotation = Math.atan2(event.clientY - svgRect.top - centerY, event.clientX - svgRect.left - centerX) * (180 / Math.PI);
//             setImageRotations(prevRotations => ({
//                 ...prevRotations,
//                 [selectedImage]: newRotation,
//             }));
//         }
//     };

//     const handleMouseUp = () => {
//         setDragging(false);
//         setResizing(false);
//         setRotating(false);
//     };
//     const handleSvgClick = (event) => {
//         // Check if the click is on an image or resize/rotate handle
//         if (!event.target.closest('image') && !event.target.closest('rect') && !event.target.closest('circle')) {
//             setSelectedImage(null);
//         }
//     };

//     const renderResizeHandles = (imageId) => {
//         const position = imagePositions[imageId];
//         const size = imageSizes[imageId];
//         if (!position || !size) return null;

//         const handleSize = 10;
//         const handles = [
//             { x: position.x, y: position.y }, // top-left
//             { x: position.x + size.width, y: position.y }, // top-right
//             { x: position.x, y: position.y + size.height }, // bottom-left
//             { x: position.x + size.width, y: position.y + size.height }, // bottom-right
//         ];

//         return handles.map((handle, index) => (
//             <rect
//                 key={index}
//                 x={handle.x - handleSize / 2}
//                 y={handle.y - handleSize / 2}
//                 width={handleSize}
//                 height={handleSize}
//                 fill="blue"
//                 cursor="nwse-resize"
//                 onMouseDown={(event) => handleResizeMouseDown(event, imageId)}
//             />
//         ));
//     };

//     const renderRotateHandle = (imageId) => {
//         const position = imagePositions[imageId];
//         const size = imageSizes[imageId];
//         if (!position || !size) return null;

//         const handleSize = 10;
//         const handle = {
//             x: position.x + size.width / 2,
//             y: position.y - 20, // Adjust the distance of the handle from the image
//         };

//         return (
//             <circle
//                 cx={handle.x}
//                 cy={handle.y}
//                 r={handleSize}
//                 fill="red"
//                 cursor="crosshair"
//                 onMouseDown={(event) => handleRotateMouseDown(event, imageId)}
//             />
//         );
//     };



//     const handleRotateMouseDown = (event, id) => {
//         event.stopPropagation();
//         setRotating(true);
//         setSelectedImage(id);
//         const svgRect = svgRef.current.getBoundingClientRect();
//         setDragStart({
//             x: event.clientX - svgRect.left,
//             y: event.clientY - svgRect.top,
//         });
//     };

//     const handleRotateMouseMove = (event) => {
//         if (selectedSection) {
//             const svgRect = svgRef.current.getBoundingClientRect();
//             const centerX = (imagePositions[selectedSection]?.x || 10) + (imageSizes[selectedSection]?.width || 100) / 2;
//             const centerY = (imagePositions[selectedSection]?.y || 10) + (imageSizes[selectedSection]?.height || 100) / 2;

//             const mouseX = event.clientX - svgRect.left;
//             const mouseY = event.clientY - svgRect.top;

//             const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);

//             setImageRotations({
//                 ...imageRotations,
//                 [selectedSection]: angle,
//             });
//         }
//     };

//     const handleRotateMouseUp = () => {
//         document.removeEventListener('mousemove', handleRotateMouseMove);
//         document.removeEventListener('mouseup', handleRotateMouseUp);
//     };
//     useEffect(() => {

//         if (selectedSection === 'section1') {
//             setSideColors((prev) => ({
//                 ...prev,
//                 lidTop: selectedColor
//             }))
//         } else if (selectedSection === 'section2') {
//             setSideColors((prev) => ({
//                 ...prev,
//                 bottom: selectedColor
//             }))
//         } else if (selectedSection === 'section3') {
//             setSideColors((prev) => ({
//                 ...prev,
//                 lidFront: selectedColor
//             }))
//         } else if (selectedSection === 'section4') {
//             setSideColors((prev) => ({
//                 ...prev,
//                 bottomBack: selectedColor
//             }))
//         } else if (selectedSection === 'section5') {
//             setSideColors((prev) => ({
//                 ...prev,
//                 bottomFront: selectedColor
//             }))
//         } else if (selectedSection === 'section6') {
//             setSideColors((prev) => ({
//                 ...prev,
//                 bottomRight: selectedColor
//             }))
//         } else if (selectedSection === 'section7') {
//             setSideColors((prev) => ({
//                 ...prev,
//                 bottomLeft: selectedColor
//             }))
//         }else if (selectedSection === 'section8') {
//             setSideColors((prev) => ({
//                 ...prev,
//                 lidLeft: selectedColor
//             }))
//         }else if (selectedSection === 'section9') {
//             setSideColors((prev) => ({
//                 ...prev,
//                 lidRight: selectedColor
//             }))
//         }

//     }, [selectedColor])

//     useEffect(() => {
//         if (selectedSection === 'section1') {
//             setSelectedSide('lidTop')
//         } else if (selectedSection === 'section2') {
//             setSelectedSide('bottom')
//         } else if (selectedSection === 'section3') {
//             setSelectedSide('lidFront')
//         } else if (selectedSection === 'section4') {
//             setSelectedSide('bottomBack')
//         } else if (selectedSection === 'section5') {
//             setSelectedSide('bottomFront')
//         } else if (selectedSection === 'section6') {
//             setSelectedSide('bottomRight')
//         } else if (selectedSection === 'section7') {
//             setSelectedSide('bottomLeft')
//         }else if (selectedSection === 'section8') {
//             setSelectedSide('lidLeft')
//         }else if (selectedSection === 'section9') {
//             setSelectedSide('lidRight')
//         }
//     }, [selectedSection])


//     return (
//         <>
//             <div className="w-full flex justify-start flex-col">
//                 <div className="px-4 py-2 bg-headingTxtColor text-white rounded-t-lg">
//                     <div className="text-base font-semibold text-white flex items-center justify-start gap-4 flex-row">
//                         <span
//                             className={`flex items-center flex-row gap-1 font-medium text-sm cursor-pointer ${selectedItem === 'color' && 'font-bold decoration-2 underline underline-offset-4'}`}
//                             onClick={() => setSelectedItem('color')}
//                         >
//                             <span><IoMdColorPalette /> </span>
//                             <span>Add Color</span>
//                         </span>
//                         <span
//                             className={`flex items-center flex-row gap-1 font-medium text-sm cursor-pointer ${selectedItem === 'images' && 'font-bold decoration-2 underline underline-offset-4'}`}
//                             onClick={() => setSelectedItem('images')}
//                         >
//                             <span><FaImages /> </span>
//                             <span>Add Images</span>
//                         </span>
//                     </div>
//                 </div>
//                 <div className="w-full bg-white border-2 border-headingTxtColor">
//                     {selectedItem === 'color' && (
//                         <div className="px-4 py-2 flex justify-between items-center">
//                             <span className="text-base font-semibold text-gray-700">Color</span>
//                             <input
//                                 type="color"
//                                 value={selectedColor}
//                                 onChange={(e) => setSelectedColor(e.target.value)}
//                             />
//                         </div>
//                     )}
//                     {selectedItem === 'images' && (
//                         <div className="px-4 py-2 flex justify-between items-center">
//                             <input type="file" onChange={handleImageUpload} />
//                         </div>
//                     )}
//                 </div>
//                 <div className="bg-white px-2 rounded-b-lg">
//                     <div className=" pb-4 flex justify-end items-center gap-4">
//                         <button
//                             className={classNames('px-1 py-2 text-sm font-semibold bg-green-500 text-white rounded-md mt-4')}
//                             onClick={convertSvgToJpg}
//                             disabled={!Object.keys(images).length && applied}
//                         >
//                             {
//                                 applied ? 'Applying...' : 'Apply'
//                             }
//                         </button>
//                         <button
//                             className={classNames('px-1 py-2 text-sm font-semibold bg-red-500 text-white rounded-md mt-4', { 'opacity-50 cursor-not-allowed': !Object.keys(images).length })}
//                             onClick={deleteImage}
//                             disabled={!Object.keys(images).length}
//                         >
//                             Delete
//                         </button>
//                     </div>
//                     <div className="w-full" ref={containerRef}>
//                         {/* <svg
//                             ref={svgRef}
//                             width="400"
//                             height="400"
//                             xmlns="http://www.w3.org/2000/svg"
//                             onMouseMove={handleMouseMove}
//                             onMouseUp={handleMouseUp}
//                             viewBox="0 0 245.76 245.76"
//                             className=' w-full'
//                         >
//                             <defs>
//                                 <style>
//                                     {
//                                         `
//                                         .cls-2 {
//                                             fill:${extTexColor};
//                                         }
//                                         .cls-3 {
//                                             fill:#d7c29f;
//                                         }
//                                         .cls-lidFront {
//                                             fill:${sideColors.lidFront}
//                                         }
//                                         .cls-top {
//                                             fill:${sideColors.top}
//                                         }
//                                         .cls-front {
//                                             fill:${sideColors.front}
//                                         }
//                                         .cls-back {
//                                             fill:${sideColors.back}
//                                         }
//                                         .cls-bottom {
//                                             fill:${sideColors.bottom}
//                                         }
//                                         .cls-left {
//                                             fill:${sideColors.left}
//                                         }
//                                         .cls-right {
//                                             fill:${sideColors.right}
//                                         }
//                                     `
//                                     }
//                                 </style>
//                             </defs>
//                             <g id="Layer_2" data-name="Layer 2">
//                                 <g id="MailerTexture">
//                                     <path className=" cls-2"
//                                         d="M99.78,195.39c-.6-.07-1.21-.21-1.81-.22H3.73c-1.82,0-1.82,0-1.82-1.81V149c0-1.55,0-1.55,1.6-1.55H99l0-.39c-.43,0-.86-.09-1.29-.09-7.23,0-14.46,0-21.7,0-1.17,0-1.47-.34-1.47-1.48q.06-22.12,0-44.24c0-1.19.27-1.58,1.52-1.57q10.43.09,20.86,0a33.44,33.44,0,0,0,4.18-.54l0-.38-9.49-1.7c-4.21-.75-8.43-1.49-12.64-2.25-1.5-.27-3-.6-4.5-.85-2.86-.49-4.14-2.37-4.16-5-.08-9.35-.06-18.7,0-28.05,0-2.94,1.59-4.78,4.66-5.3C79.31,54.86,83.66,54,88,53.25c3.9-.69,7.81-1.35,11.71-2l.08-.31a5.47,5.47,0,0,0-1.34-.33q-12.11,0-24.22,0c-1.44,0-2.88,0-4.32,0-.84,0-1.13-.26-1.1-1.1.28-8.23,1.31-16.31,4.27-24.07,2.51-6.56,6-12.49,11.31-17.14,4.22-3.68,9-5.94,14.84-5.92q23.44.09,46.88,0a21.36,21.36,0,0,1,13,4.44c5.62,4.14,9.29,9.74,12.09,16a58.78,58.78,0,0,1,4.42,15.3c.56,3.78.55,7.65.8,11.49.08,1.1-.67,1-1.35,1q-14.08,0-28.18,0a7.81,7.81,0,0,0-1.42.24l.05.34c3,.52,6,1,9,1.56s6,1,9.06,1.51c2.55.44,5.1.92,7.65,1.37a5.52,5.52,0,0,1,4.25,5q-.1,14.15,0,28.3a5.55,5.55,0,0,1-4.21,5.27c-3.87.66-7.75,1.29-11.62,2-4.41.76-8.81,1.55-13.22,2.33a5.78,5.78,0,0,0-2,.61,12.22,12.22,0,0,0,2.73.62q11.21.08,22.42,0c1.06,0,1.36.3,1.36,1.36q0,22.29,0,44.59c0,1.1-.38,1.33-1.39,1.33-7.31,0-14.63,0-21.94,0h-1.26l0,.33a13.54,13.54,0,0,0,1.4.14h70.14c8,0,16,0,24,0,1.25,0,1.52.38,1.52,1.56,0,14.87,0,29.74,0,44.6,0,1.58,0,1.59-1.57,1.59H147.35a3.62,3.62,0,0,0-1.79.48h1.5c6.95,0,13.91,0,20.86,0,1.14,0,1.4.35,1.4,1.44q0,22.29,0,44.59c0,1.14-.29,1.5-1.46,1.5q-45.21,0-90.41,0c-1.17,0-1.46-.36-1.46-1.5q.06-22.29,0-44.59c0-1.09.26-1.45,1.4-1.44,7.43,0,14.87,0,22.3,0Z" />
//                                     <rect id="lidFront" x="98.81" y="2.61" width="48.1" height="47.59" onClick={(e) => { e.stopPropagation(); handleSectionClick('section1'); }} className={classNames('cls-lidFront', { selected: selectedSection === 'section1' })} />
//                                     <rect id="lidTop" x="98.81" y="52.44" width="48.1" height="44.54" onClick={(e) => { e.stopPropagation(); handleSectionClick('section2'); }} className={classNames('cls-top', { selected: selectedSection === 'section2' })} />
//                                     <rect id="back" x="98.81" y="101.66" width="48.1" height="43.73" onClick={(e) => { e.stopPropagation(); handleSectionClick('section3'); }} className={classNames('cls-back', { selected: selectedSection === 'section3' })} />
//                                     <rect id="bottom" x="98.81" y="148.24" width="48.1" height="46.07" onClick={(e) => { e.stopPropagation(); handleSectionClick('section4'); }} className={classNames('cls-bottom', { selected: selectedSection === 'section4' })} />
//                                     <rect id="front" x="98.81" y="196.24" width="48.1" height="45.56" onClick={(e) => { e.stopPropagation(); handleSectionClick('section5'); }} className={classNames('cls-front', { selected: selectedSection === 'section5' })} />
//                                     <rect id="right" x="147.93" y="148.24" width="48.97" height="45.81" onClick={(e) => { e.stopPropagation(); handleSectionClick('section6'); }} className={classNames('cls-left', { selected: selectedSection === 'section6' })} />
//                                     <rect id="left" x="45.58" y="148.24" width="51.71" height="46.07" onClick={(e) => { e.stopPropagation(); handleSectionClick('section7'); }} className={classNames('cls-right', { selected: selectedSection === 'section7' })} />
//                                 </g>
//                             </g>

//                             {Object.keys(images).map(id => (
//                                 images[id] && (
//                                     <g key={id}>
//                                         <image
//                                             href={images[id]}
//                                             x={imagePositions[id]?.x || 10}
//                                             y={imagePositions[id]?.y || 10}
//                                             width={imageSizes[id]?.width || 100}
//                                             height={imageSizes[id]?.height || 100}
//                                             onMouseDown={(e) => handleMouseDown(e, id)}
//                                             style={{ cursor: 'move' }}
//                                             transform={`rotate(${imageRotations[id] || 0}, ${(imagePositions[id]?.x || 10) + (imageSizes[id]?.width || 100) / 2}, ${(imagePositions[id]?.y || 10) + (imageSizes[id]?.height || 100) / 2})`}
//                                         />
//                                         {selectedSection === id && (
//                                             <>
//                                                 <rect
//                                                     x={(imagePositions[id]?.x || 10) + (imageSizes[id]?.width || 100) - 10}
//                                                     y={(imagePositions[id]?.y || 10) + (imageSizes[id]?.height || 100) - 10}
//                                                     width="10"
//                                                     height="10"
//                                                     fill="blue"
//                                                     onMouseDown={handleResizeMouseDown}
//                                                     style={{ cursor: 'nwse-resize' }}
//                                                 />
//                                                 <circle
//                                                     cx={(imagePositions[id]?.x || 10) + (imageSizes[id]?.width || 100) / 2}
//                                                     cy={(imagePositions[id]?.y || 10) - 2}
//                                                     r="5"
//                                                     fill="red"
//                                                     onMouseDown={(e) => handleRotateMouseDown(e, id)}
//                                                     style={{ cursor: 'pointer' }}
//                                                 />
//                                             </>
//                                         )}
//                                     </g>
//                                 )
//                             ))}

//                         </svg> */}

//                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300.8 396"
//                             className=' w-full'
//                             ref={svgRef}
//                             height="400"
//                             onMouseMove={handleMouseMove}
//                             onMouseUp={handleMouseUp}
//                             onClick={handleSvgClick}

//                         >
//                             <defs>
//                                 <style>
//                                     {`
//                                       .cls-1{fill:#a27b43}
//                                       .cls-2{fill:#ba803f}
//                                       .cls-bottom {
//                                             fill:${sideColors.bottom}
//                                         }
//                                         .cls-bottomRight {
//                                             fill:${sideColors.bottomRight}
//                                         }
//                                         .cls-bottomLeft {
//                                             fill:${sideColors.bottomLeft}
//                                         }
//                                         .cls-bottomBack {
//                                             fill:${sideColors.bottomBack}
//                                         }
//                                         .cls-bottomFront {
//                                             fill:${sideColors.bottomFront}
//                                         }

//                                         .cls-lidTop {
//                                             fill:${sideColors.lidTop}
//                                         }
//                                         .cls-lidRight {
//                                             fill:${sideColors.lidRight}
//                                         }
//                                             .cls-lidLeft {
//                                             fill:${sideColors.lidLeft}
//                                         }
//                                         .cls-lidFront {
//                                             fill:${sideColors.lidFront}
//                                         }
//                                    `}
//                                     <clipPath id="clip-dieline">
//                                     <path
//                                         d="M188.46,390.36l.45-1.09c-.28-.27-.18-.45.14-.58l.15-.56c-.3-.28-.17-.44.16-.54a3.7,3.7,0,0,1,.5-.89c.11-.67.21-1.34.28-2a3.38,3.38,0,0,1,.57-1.54c.07-.42.14-.85.17-1.27a.66.66,0,0,1,.56-.54l.21-1.06c-.05-.2-.1-.4-.14-.6-.29-.31-.29-.32.13-.51a.3.3,0,0,1,.21,0c.11-.46.23-.92.34-1.39l-.16-.27c-.25-.36-.25-.36.16-.55l.4-.75a1.28,1.28,0,0,1,.35-1.26,4.83,4.83,0,0,1,3.12-1.55c.19,0,.41.14.62.23a.24.24,0,0,1-.08.25l.82-.2a.81.81,0,0,1,.81-.6c.4,0,.81,0,1.22,0a4.88,4.88,0,0,1,1.81-.7l3.63-1.09c.35-.11.72-.26,1,.15l.25.12.81-.2a4,4,0,0,1,.63-.48c.71-.31,1.44-.57,2.15-.86a2.18,2.18,0,0,1,1.32-.25l1.26-.48a.76.76,0,0,1,.09-.18c.07-.45.44-.37.74-.4l2,0,.38-.14,0-.07c.08-.2.15-.4.22-.6q0-50.52,0-101V215.11c0-.56.05-1.12.08-1.68l-.4-.49c-.44-.13-.89-.22-1.31-.39a3,3,0,0,1-.63-.46l-.27-.4-.39-.13c-.53.13-.83-.16-1-.61-.53-.15-1.06-.31-1.59-.44s-.9-.19-1.35-.28a1.1,1.1,0,0,1-1.28-.37A10.19,10.19,0,0,1,204,210a1,1,0,0,1-1.27.14,3.23,3.23,0,0,1-1.74-2.08,9.73,9.73,0,0,1-.31-1.92c0-1.68,0-3.36,0-5,0-.47,0-1,.59-1.16,0-1.38.09-2.77.13-4.15a11.45,11.45,0,0,0-.3-3.45,4.68,4.68,0,0,1,0-2.2,3.7,3.7,0,0,1,1.43-3,.86.86,0,0,1,1.14-.09l1.08-.25c.28-.53.32-.55.89-.34l.54,0c.78-.6.91-.61,1.77,0l1.49-.4a.58.58,0,0,1,.71-.35l.58-.25c.24-.63.85-.69,1.37-.89l.63-.21a2.06,2.06,0,0,0,.61-.31,10.52,10.52,0,0,1,2.48-1.68c0-.56-.07-1.12-.07-1.68V32.33c0-.47,0-.94,0-1.41L215,29.66l-.42-.19c-.55.14-.6.12-.83-.55h0a.7.7,0,0,1-.62-.49l-.55-.31a5.61,5.61,0,0,1-1.09-.05c-1.57-.45-3.13-.94-4.69-1.42a2,2,0,0,1-1.29-1c-.59-.23-1.26-.28-1.67-.83a1.26,1.26,0,0,1-.53-1.2,1,1,0,0,1,.2-1.27c.31-.36.68-.65,1.21-.4l1.66-.32a2.21,2.21,0,0,1,1.56-.49c.7,0,1.4-.06,2.1-.09a1.36,1.36,0,0,1,1.44-.47l.51-.12a.26.26,0,0,1,0-.23.89.89,0,0,1,.89-.5l.22-.1a3.69,3.69,0,0,1,2.24-1.38l.38-.51c0-.61-.06-1.21-.06-1.82V0H0V18.28c.25.21.66.25.75.64l.13.18c.77.65,1.55,1.3,2.31,2,.13.11.17.31.26.47l1.83,1.1.62-.11a.53.53,0,0,1,.87.2c.45.09.92.15,1.37.27s1,.26,1.24.8a.62.62,0,0,0,.24.08c.61.33.75.56.59,1a.93.93,0,0,1-.9.72.73.73,0,0,0-.22.09c-.12.17-.24.33-.35.5a1.41,1.41,0,0,1-1.15.69c-.27,0-.55,0-.83.06a4.63,4.63,0,0,0-3,1.16c-.36.32-.75.57-1.24.24L.61,29.81,0,30.09V184.5a6,6,0,0,1,2.59.45,2,2,0,0,0,.68.15,2.71,2.71,0,0,1,1.85.86,1.69,1.69,0,0,0,1.38.56,2.43,2.43,0,0,1,1.91.68,1.65,1.65,0,0,0,1.15.42c.28,0,.56,0,.84,0a3.09,3.09,0,0,1,2.9,3c0,.18-.22.37-.33.55q0,5.58,0,11.14c0,1.07,0,2.14-.06,3.2l.19.28c.5,1,.44,1.25-.4,2-.27.64.18,1.21.14,1.83-.11.46-.11.46-.48.27l-1.63.17a1.86,1.86,0,0,1-1.3.91.57.57,0,0,1-.71-.24l-.48.09a.84.84,0,0,1-.72.54l-1.87.35a4.27,4.27,0,0,1-2.8.85,1.17,1.17,0,0,1-1.09.41,3.71,3.71,0,0,0-1.72.16V367.88a2.43,2.43,0,0,0,1.48.24,1.43,1.43,0,0,1,1.38.5,3.57,3.57,0,0,0,2.88,1.43.8.8,0,0,1,.68.7l0,.06a2.9,2.9,0,0,1,2,.2c.51.08,1.08,0,1.42.56l.78.22.89-.11c.22-.05.46-.2.63-.14.74.25,1.46.58,2.19.84a9.47,9.47,0,0,0,1.46.37,1.24,1.24,0,0,1,1.09.73.2.2,0,0,1,0,.22l1.34.26,1.15-.13c.17,0,.36-.12.51-.07.82.25,1.64.52,2.43.84.26.1.31.43.28.72l.21,1.25.51.31c.39.23.4.3,0,.57a.53.53,0,0,0-.11.21,2.11,2.11,0,0,1-.1,1.46v.52l.35.38c.72.49.75.61.5,1.63a.26.26,0,0,0,.06.24s.1,0,.13,0a1.85,1.85,0,0,1,.43,2.29c0,.37.08.73.11,1.09,1.18.69,1.29,1,.87,2.53l-.12.62.24.86a.24.24,0,0,1,.21-.05c.94.23,1,.31,1.14,1.09l-.1.3c0,.28,0,.55,0,.82l.18.26c.42.57.42.61,0,1.22H27l-.1-.08.31.92.64.77c.42.38.43.44.08.91l-.11.51H186.23c.44-1.42.88-2.85,1.34-4.27C187.75,391.2,187.88,390.64,188.46,390.36Z"
//                                     />
//                                 </clipPath>
//                                 </style>
//                             </defs>
//                             <g id="Layer_2" data-name="Layer 2">
//                                 <g id="Layer_1-2" data-name="Layer 1">
//                                     <path className="cls-1" d="M188.46,390.36l.45-1.09c-.28-.27-.18-.45.14-.58l.15-.56c-.3-.28-.17-.44.16-.54a3.7,3.7,0,0,1,.5-.89c.11-.67.21-1.34.28-2a3.38,3.38,0,0,1,.57-1.54c.07-.42.14-.85.17-1.27a.66.66,0,0,1,.56-.54l.21-1.06c-.05-.2-.1-.4-.14-.6-.29-.31-.29-.32.13-.51a.3.3,0,0,1,.21,0c.11-.46.23-.92.34-1.39l-.16-.27c-.25-.36-.25-.36.16-.55l.4-.75a1.28,1.28,0,0,1,.35-1.26,4.83,4.83,0,0,1,3.12-1.55c.19,0,.41.14.62.23a.24.24,0,0,1-.08.25l.82-.2a.81.81,0,0,1,.81-.6c.4,0,.81,0,1.22,0a4.88,4.88,0,0,1,1.81-.7l3.63-1.09c.35-.11.72-.26,1,.15l.25.12.81-.2a4,4,0,0,1,.63-.48c.71-.31,1.44-.57,2.15-.86a2.18,2.18,0,0,1,1.32-.25l1.26-.48a.76.76,0,0,1,.09-.18c.07-.45.44-.37.74-.4l2,0,.38-.14,0-.07c.08-.2.15-.4.22-.6q0-50.52,0-101V215.11c0-.56.05-1.12.08-1.68l-.4-.49c-.44-.13-.89-.22-1.31-.39a3,3,0,0,1-.63-.46l-.27-.4-.39-.13c-.53.13-.83-.16-1-.61-.53-.15-1.06-.31-1.59-.44s-.9-.19-1.35-.28a1.1,1.1,0,0,1-1.28-.37A10.19,10.19,0,0,1,204,210a1,1,0,0,1-1.27.14,3.23,3.23,0,0,1-1.74-2.08,9.73,9.73,0,0,1-.31-1.92c0-1.68,0-3.36,0-5,0-.47,0-1,.59-1.16,0-1.38.09-2.77.13-4.15a11.45,11.45,0,0,0-.3-3.45,4.68,4.68,0,0,1,0-2.2,3.7,3.7,0,0,1,1.43-3,.86.86,0,0,1,1.14-.09l1.08-.25c.28-.53.32-.55.89-.34l.54,0c.78-.6.91-.61,1.77,0l1.49-.4a.58.58,0,0,1,.71-.35l.58-.25c.24-.63.85-.69,1.37-.89l.63-.21a2.06,2.06,0,0,0,.61-.31,10.52,10.52,0,0,1,2.48-1.68c0-.56-.07-1.12-.07-1.68V32.33c0-.47,0-.94,0-1.41L215,29.66l-.42-.19c-.55.14-.6.12-.83-.55h0a.7.7,0,0,1-.62-.49l-.55-.31a5.61,5.61,0,0,1-1.09-.05c-1.57-.45-3.13-.94-4.69-1.42a2,2,0,0,1-1.29-1c-.59-.23-1.26-.28-1.67-.83a1.26,1.26,0,0,1-.53-1.2,1,1,0,0,1,.2-1.27c.31-.36.68-.65,1.21-.4l1.66-.32a2.21,2.21,0,0,1,1.56-.49c.7,0,1.4-.06,2.1-.09a1.36,1.36,0,0,1,1.44-.47l.51-.12a.26.26,0,0,1,0-.23.89.89,0,0,1,.89-.5l.22-.1a3.69,3.69,0,0,1,2.24-1.38l.38-.51c0-.61-.06-1.21-.06-1.82V0H0V18.28c.25.21.66.25.75.64l.13.18c.77.65,1.55,1.3,2.31,2,.13.11.17.31.26.47l1.83,1.1.62-.11a.53.53,0,0,1,.87.2c.45.09.92.15,1.37.27s1,.26,1.24.8a.62.62,0,0,0,.24.08c.61.33.75.56.59,1a.93.93,0,0,1-.9.72.73.73,0,0,0-.22.09c-.12.17-.24.33-.35.5a1.41,1.41,0,0,1-1.15.69c-.27,0-.55,0-.83.06a4.63,4.63,0,0,0-3,1.16c-.36.32-.75.57-1.24.24L.61,29.81,0,30.09V184.5a6,6,0,0,1,2.59.45,2,2,0,0,0,.68.15,2.71,2.71,0,0,1,1.85.86,1.69,1.69,0,0,0,1.38.56,2.43,2.43,0,0,1,1.91.68,1.65,1.65,0,0,0,1.15.42c.28,0,.56,0,.84,0a3.09,3.09,0,0,1,2.9,3c0,.18-.22.37-.33.55q0,5.58,0,11.14c0,1.07,0,2.14-.06,3.2l.19.28c.5,1,.44,1.25-.4,2-.27.64.18,1.21.14,1.83-.11.46-.11.46-.48.27l-1.63.17a1.86,1.86,0,0,1-1.3.91.57.57,0,0,1-.71-.24l-.48.09a.84.84,0,0,1-.72.54l-1.87.35a4.27,4.27,0,0,1-2.8.85,1.17,1.17,0,0,1-1.09.41,3.71,3.71,0,0,0-1.72.16V367.88a2.43,2.43,0,0,0,1.48.24,1.43,1.43,0,0,1,1.38.5,3.57,3.57,0,0,0,2.88,1.43.8.8,0,0,1,.68.7l0,.06a2.9,2.9,0,0,1,2,.2c.51.08,1.08,0,1.42.56l.78.22.89-.11c.22-.05.46-.2.63-.14.74.25,1.46.58,2.19.84a9.47,9.47,0,0,0,1.46.37,1.24,1.24,0,0,1,1.09.73.2.2,0,0,1,0,.22l1.34.26,1.15-.13c.17,0,.36-.12.51-.07.82.25,1.64.52,2.43.84.26.1.31.43.28.72l.21,1.25.51.31c.39.23.4.3,0,.57a.53.53,0,0,0-.11.21,2.11,2.11,0,0,1-.1,1.46v.52l.35.38c.72.49.75.61.5,1.63a.26.26,0,0,0,.06.24s.1,0,.13,0a1.85,1.85,0,0,1,.43,2.29c0,.37.08.73.11,1.09,1.18.69,1.29,1,.87,2.53l-.12.62.24.86a.24.24,0,0,1,.21-.05c.94.23,1,.31,1.14,1.09l-.1.3c0,.28,0,.55,0,.82l.18.26c.42.57.42.61,0,1.22H27l-.1-.08.31.92.64.77c.42.38.43.44.08.91l-.11.51H186.23c.44-1.42.88-2.85,1.34-4.27C187.75,391.2,187.88,390.64,188.46,390.36Z" />
//                                     <rect  x="11.05" y="29.32" width="191.59" height="149.69" onClick={(e) => { e.stopPropagation(); handleSectionClick('section1'); }} className={classNames('cls-lidTop', { selected: selectedSection === 'section1' })} />
//                                     <rect  x="11.05" y="215.22" width="189.15" height="148.88" onClick={(e) => { e.stopPropagation(); handleSectionClick('section2'); }} className={classNames('cls-bottom', { selected: selectedSection === 'section2' })} />
//                                     <rect  x="11.05" width="191.59" height="26.47" onClick={(e) => { e.stopPropagation(); handleSectionClick('section3'); }} className={classNames('cls-lidFront', { selected: selectedSection === 'section3' })} />
//                                     <rect  x="14.31" y="181.46" width="183.86" height="30.92" onClick={(e) => { e.stopPropagation(); handleSectionClick('section4'); }} className={classNames('cls-bottomBack', { selected: selectedSection === 'section4' })} />
//                                     <rect  x="28.14" y="365.73" width="158.09" height="30.27" onClick={(e) => { e.stopPropagation(); handleSectionClick('section5'); }} className={classNames('cls-bottomFront', { selected: selectedSection === 'section5' })} />
//                                     <rect  x="202.64" y="215.22" width="13.07" height="148.88" onClick={(e) => { e.stopPropagation(); handleSectionClick('section6'); }} className={classNames('cls-bottomRight', { selected: selectedSection === 'section6' })} />
//                                     <rect  y="215.22" width="9.02" height="148.88" onClick={(e) => { e.stopPropagation(); handleSectionClick('section7'); }} className={classNames('cls-bottomRight', { selected: selectedSection === 'section7' })} />
//                                     <rect  y="30.09" width="9.02" height="148.92" onClick={(e) => { e.stopPropagation(); handleSectionClick('section8'); }} className={classNames('cls-lidLeft', { selected: selectedSection === 'section8' })}  />
//                                     <rect  x="204.27" y="29.47" width="10.35" height="149.55" onClick={(e) => { e.stopPropagation(); handleSectionClick('section9'); }} className={classNames('cls-lidRight', { selected: selectedSection === 'section9' })} />
//                                 </g>
//                             </g>
//                             {Object.keys(images).map((key) => (
//                                 <g key={key}>
//                                     <image
//                                         href={images[key]}
//                                         x={imagePositions[key]?.x || 0}
//                                         y={imagePositions[key]?.y || 0}
//                                         width={imageSizes[key]?.width || 100}
//                                         height={imageSizes[key]?.height || 100}
//                                         transform={`rotate(${imageRotations[key] || 0}, ${(imagePositions[key]?.x || 0) + (imageSizes[key]?.width || 0) / 2}, ${(imagePositions[key]?.y || 0) + (imageSizes[key]?.height || 0) / 2})`}
//                                         onMouseDown={(event) => handleMouseDown(event, key)}
//                                         onDoubleClick={(event) => handleRotateMouseDown(event, key)}
//                                         clipPath={`url(#clip-dieline)`}
//                                     />
//                                     {selectedImage === key && renderResizeHandles(key)}
//                                     {selectedImage === key && renderRotateHandle(key)}
//                                 </g>
//                             ))}
//                             {/* <rect  x="11.05" y="29.32" width="191.59" height="149.69" onClick={(e) => { e.stopPropagation(); handleSectionClick('section1'); }} className={classNames('cls-lidTop', { selected: selectedSection === 'section1' })} />
//                                     <rect  x="11.05" y="215.22" width="189.15" height="148.88" onClick={(e) => { e.stopPropagation(); handleSectionClick('section2'); }} className={classNames('cls-bottom', { selected: selectedSection === 'section2' })} />
//                                     <rect  x="11.05" width="191.59" height="26.47" onClick={(e) => { e.stopPropagation(); handleSectionClick('section3'); }} className={classNames('cls-lidFront', { selected: selectedSection === 'section3' })} />
//                                     <rect  x="14.31" y="181.46" width="183.86" height="30.92" onClick={(e) => { e.stopPropagation(); handleSectionClick('section4'); }} className={classNames('cls-bottomBack', { selected: selectedSection === 'section4' })} />
//                                     <rect  x="28.14" y="365.73" width="158.09" height="30.27" onClick={(e) => { e.stopPropagation(); handleSectionClick('section5'); }} className={classNames('cls-bottomFront', { selected: selectedSection === 'section5' })} />
//                                     <rect  x="202.64" y="215.22" width="13.07" height="148.88" onClick={(e) => { e.stopPropagation(); handleSectionClick('section6'); }} className={classNames('cls-bottomRight', { selected: selectedSection === 'section6' })} />
//                                     <rect  y="215.22" width="9.02" height="148.88" onClick={(e) => { e.stopPropagation(); handleSectionClick('section7'); }} className={classNames('cls-bottomRight', { selected: selectedSection === 'section7' })} />
//                                     <rect  y="30.09" width="9.02" height="148.92" onClick={(e) => { e.stopPropagation(); handleSectionClick('section8'); }} className={classNames('cls-lidLeft', { selected: selectedSection === 'section8' })}  />
//                                     <rect  x="204.27" y="29.47" width="10.35" height="149.55" onClick={(e) => { e.stopPropagation(); handleSectionClick('section9'); }} className={classNames('cls-lidRight', { selected: selectedSection === 'section9' })} /> */}
//                         </svg>

//                         <canvas ref={canvasRef} style={{ display: 'none' }} />
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default PizzaDesignContainer;

"use client";

import { useEffect, useRef, useState } from "react";
import { FaImages } from "react-icons/fa6";
import { IoMdColorPalette } from "react-icons/io";
import { FaArrowRotateLeft } from "react-icons/fa6";
import classNames from 'classnames';
import { useAppContext } from "@/context/Context";

const PizzaDesignContainer = () => {
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
            setSelectedSide('lidTop')
        } else if (selectedSection === 'section2') {
            setSelectedSide('bottom')
        } else if (selectedSection === 'section3') {
            setSelectedSide('lidFront')
        } else if (selectedSection === 'section4') {
            setSelectedSide('bottomBack')
        } else if (selectedSection === 'section5') {
            setSelectedSide('bottomFront')
        } else if (selectedSection === 'section6') {
            setSelectedSide('bottomRight')
        } else if (selectedSection === 'section7') {
            setSelectedSide('bottomLeft')
        } else if (selectedSection === 'section8') {
            setSelectedSide('lidLeft')
        } else if (selectedSection === 'section9') {
            setSelectedSide('lidRight')
        }
    }, [selectedSection])
    useEffect(() => {

        if (selectedSection === 'section1') {
            setSideColors((prev) => ({
                ...prev,
                lidTop: selectedColor
            }))
        } else if (selectedSection === 'section2') {
            setSideColors((prev) => ({
                ...prev,
                bottom: selectedColor
            }))
        } else if (selectedSection === 'section3') {
            setSideColors((prev) => ({
                ...prev,
                lidFront: selectedColor
            }))
        } else if (selectedSection === 'section4') {
            setSideColors((prev) => ({
                ...prev,
                bottomBack: selectedColor
            }))
        } else if (selectedSection === 'section5') {
            setSideColors((prev) => ({
                ...prev,
                bottomFront: selectedColor
            }))
        } else if (selectedSection === 'section6') {
            setSideColors((prev) => ({
                ...prev,
                bottomRight: selectedColor
            }))
        } else if (selectedSection === 'section7') {
            setSideColors((prev) => ({
                ...prev,
                bottomLeft: selectedColor
            }))
        } else if (selectedSection === 'section8') {
            setSideColors((prev) => ({
                ...prev,
                lidLeft: selectedColor
            }))
        } else if (selectedSection === 'section9') {
            setSideColors((prev) => ({
                ...prev,
                lidRight: selectedColor
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
                            ref={svgRef}
                            width="215.7"
                            height="396"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 215.7 396"
                            
                            className='w-full h-full border overflow-hidden'
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onClick={handleSvgClick}
                        >
                            <defs>
                                <style>
                                    {`
                                      .cls-1{fill:#d3d2d2}
                                      .cls-2{fill:${extTexColor}}
                                      .cls-bottom {
                                            fill:${sideColors.bottom}
                                        }
                                        .cls-bottomRight {
                                            fill:${sideColors.bottomRight}
                                        }
                                        .cls-bottomLeft {
                                            fill:${sideColors.bottomLeft}
                                        }
                                        .cls-bottomBack {
                                            fill:${sideColors.bottomBack}
                                        }
                                        .cls-bottomFront {
                                            fill:${sideColors.bottomFront}
                                        }
                                        
                                        .cls-lidTop {
                                            fill:${sideColors.lidTop}
                                        }
                                        .cls-lidRight {
                                            fill:${sideColors.lidRight}
                                        }
                                            .cls-lidLeft {
                                            fill:${sideColors.lidLeft}
                                        }
                                        .cls-lidFront {
                                            fill:${sideColors.lidFront}
                                        }
                                        .cls-trnsprnt {
                                            fill: transparent
                                        }
                                   `}

                                </style>

                                <clipPath id="clip-dieline">
                                    <path
                                        d="M188.46,390.36l.45-1.09c-.28-.27-.18-.45.14-.58l.15-.56c-.3-.28-.17-.44.16-.54a3.7,3.7,0,0,1,.5-.89c.11-.67.21-1.34.28-2a3.38,3.38,0,0,1,.57-1.54c.07-.42.14-.85.17-1.27a.66.66,0,0,1,.56-.54l.21-1.06c-.05-.2-.1-.4-.14-.6-.29-.31-.29-.32.13-.51a.3.3,0,0,1,.21,0c.11-.46.23-.92.34-1.39l-.16-.27c-.25-.36-.25-.36.16-.55l.4-.75a1.28,1.28,0,0,1,.35-1.26,4.83,4.83,0,0,1,3.12-1.55c.19,0,.41.14.62.23a.24.24,0,0,1-.08.25l.82-.2a.81.81,0,0,1,.81-.6c.4,0,.81,0,1.22,0a4.88,4.88,0,0,1,1.81-.7l3.63-1.09c.35-.11.72-.26,1,.15l.25.12.81-.2a4,4,0,0,1,.63-.48c.71-.31,1.44-.57,2.15-.86a2.18,2.18,0,0,1,1.32-.25l1.26-.48a.76.76,0,0,1,.09-.18c.07-.45.44-.37.74-.4l2,0,.38-.14,0-.07c.08-.2.15-.4.22-.6q0-50.52,0-101V215.11c0-.56.05-1.12.08-1.68l-.4-.49c-.44-.13-.89-.22-1.31-.39a3,3,0,0,1-.63-.46l-.27-.4-.39-.13c-.53.13-.83-.16-1-.61-.53-.15-1.06-.31-1.59-.44s-.9-.19-1.35-.28a1.1,1.1,0,0,1-1.28-.37A10.19,10.19,0,0,1,204,210a1,1,0,0,1-1.27.14,3.23,3.23,0,0,1-1.74-2.08,9.73,9.73,0,0,1-.31-1.92c0-1.68,0-3.36,0-5,0-.47,0-1,.59-1.16,0-1.38.09-2.77.13-4.15a11.45,11.45,0,0,0-.3-3.45,4.68,4.68,0,0,1,0-2.2,3.7,3.7,0,0,1,1.43-3,.86.86,0,0,1,1.14-.09l1.08-.25c.28-.53.32-.55.89-.34l.54,0c.78-.6.91-.61,1.77,0l1.49-.4a.58.58,0,0,1,.71-.35l.58-.25c.24-.63.85-.69,1.37-.89l.63-.21a2.06,2.06,0,0,0,.61-.31,10.52,10.52,0,0,1,2.48-1.68c0-.56-.07-1.12-.07-1.68V32.33c0-.47,0-.94,0-1.41L215,29.66l-.42-.19c-.55.14-.6.12-.83-.55h0a.7.7,0,0,1-.62-.49l-.55-.31a5.61,5.61,0,0,1-1.09-.05c-1.57-.45-3.13-.94-4.69-1.42a2,2,0,0,1-1.29-1c-.59-.23-1.26-.28-1.67-.83a1.26,1.26,0,0,1-.53-1.2,1,1,0,0,1,.2-1.27c.31-.36.68-.65,1.21-.4l1.66-.32a2.21,2.21,0,0,1,1.56-.49c.7,0,1.4-.06,2.1-.09a1.36,1.36,0,0,1,1.44-.47l.51-.12a.26.26,0,0,1,0-.23.89.89,0,0,1,.89-.5l.22-.1a3.69,3.69,0,0,1,2.24-1.38l.38-.51c0-.61-.06-1.21-.06-1.82V0H0V18.28c.25.21.66.25.75.64l.13.18c.77.65,1.55,1.3,2.31,2,.13.11.17.31.26.47l1.83,1.1.62-.11a.53.53,0,0,1,.87.2c.45.09.92.15,1.37.27s1,.26,1.24.8a.62.62,0,0,0,.24.08c.61.33.75.56.59,1a.93.93,0,0,1-.9.72.73.73,0,0,0-.22.09c-.12.17-.24.33-.35.5a1.41,1.41,0,0,1-1.15.69c-.27,0-.55,0-.83.06a4.63,4.63,0,0,0-3,1.16c-.36.32-.75.57-1.24.24L.61,29.81,0,30.09V184.5a6,6,0,0,1,2.59.45,2,2,0,0,0,.68.15,2.71,2.71,0,0,1,1.85.86,1.69,1.69,0,0,0,1.38.56,2.43,2.43,0,0,1,1.91.68,1.65,1.65,0,0,0,1.15.42c.28,0,.56,0,.84,0a3.09,3.09,0,0,1,2.9,3c0,.18-.22.37-.33.55q0,5.58,0,11.14c0,1.07,0,2.14-.06,3.2l.19.28c.5,1,.44,1.25-.4,2-.27.64.18,1.21.14,1.83-.11.46-.11.46-.48.27l-1.63.17a1.86,1.86,0,0,1-1.3.91.57.57,0,0,1-.71-.24l-.48.09a.84.84,0,0,1-.72.54l-1.87.35a4.27,4.27,0,0,1-2.8.85,1.17,1.17,0,0,1-1.09.41,3.71,3.71,0,0,0-1.72.16V367.88a2.43,2.43,0,0,0,1.48.24,1.43,1.43,0,0,1,1.38.5,3.57,3.57,0,0,0,2.88,1.43.8.8,0,0,1,.68.7l0,.06a2.9,2.9,0,0,1,2,.2c.51.08,1.08,0,1.42.56l.78.22.89-.11c.22-.05.46-.2.63-.14.74.25,1.46.58,2.19.84a9.47,9.47,0,0,0,1.46.37,1.24,1.24,0,0,1,1.09.73.2.2,0,0,1,0,.22l1.34.26,1.15-.13c.17,0,.36-.12.51-.07.82.25,1.64.52,2.43.84.26.1.31.43.28.72l.21,1.25.51.31c.39.23.4.3,0,.57a.53.53,0,0,0-.11.21,2.11,2.11,0,0,1-.1,1.46v.52l.35.38c.72.49.75.61.5,1.63a.26.26,0,0,0,.06.24s.1,0,.13,0a1.85,1.85,0,0,1,.43,2.29c0,.37.08.73.11,1.09,1.18.69,1.29,1,.87,2.53l-.12.62.24.86a.24.24,0,0,1,.21-.05c.94.23,1,.31,1.14,1.09l-.1.3c0,.28,0,.55,0,.82l.18.26c.42.57.42.61,0,1.22H27l-.1-.08.31.92.64.77c.42.38.43.44.08.91l-.11.51H186.23c.44-1.42.88-2.85,1.34-4.27C187.75,391.2,187.88,390.64,188.46,390.36Z"
                                    />
                                </clipPath>
                            </defs>
                            <g id="Layer_2" data-name="Layer 2">
                                <g id="Layer_1-2" data-name="Layer 1">
                                    <path className="cls-2" d="M188.46,390.36l.45-1.09c-.28-.27-.18-.45.14-.58l.15-.56c-.3-.28-.17-.44.16-.54a3.7,3.7,0,0,1,.5-.89c.11-.67.21-1.34.28-2a3.38,3.38,0,0,1,.57-1.54c.07-.42.14-.85.17-1.27a.66.66,0,0,1,.56-.54l.21-1.06c-.05-.2-.1-.4-.14-.6-.29-.31-.29-.32.13-.51a.3.3,0,0,1,.21,0c.11-.46.23-.92.34-1.39l-.16-.27c-.25-.36-.25-.36.16-.55l.4-.75a1.28,1.28,0,0,1,.35-1.26,4.83,4.83,0,0,1,3.12-1.55c.19,0,.41.14.62.23a.24.24,0,0,1-.08.25l.82-.2a.81.81,0,0,1,.81-.6c.4,0,.81,0,1.22,0a4.88,4.88,0,0,1,1.81-.7l3.63-1.09c.35-.11.72-.26,1,.15l.25.12.81-.2a4,4,0,0,1,.63-.48c.71-.31,1.44-.57,2.15-.86a2.18,2.18,0,0,1,1.32-.25l1.26-.48a.76.76,0,0,1,.09-.18c.07-.45.44-.37.74-.4l2,0,.38-.14,0-.07c.08-.2.15-.4.22-.6q0-50.52,0-101V215.11c0-.56.05-1.12.08-1.68l-.4-.49c-.44-.13-.89-.22-1.31-.39a3,3,0,0,1-.63-.46l-.27-.4-.39-.13c-.53.13-.83-.16-1-.61-.53-.15-1.06-.31-1.59-.44s-.9-.19-1.35-.28a1.1,1.1,0,0,1-1.28-.37A10.19,10.19,0,0,1,204,210a1,1,0,0,1-1.27.14,3.23,3.23,0,0,1-1.74-2.08,9.73,9.73,0,0,1-.31-1.92c0-1.68,0-3.36,0-5,0-.47,0-1,.59-1.16,0-1.38.09-2.77.13-4.15a11.45,11.45,0,0,0-.3-3.45,4.68,4.68,0,0,1,0-2.2,3.7,3.7,0,0,1,1.43-3,.86.86,0,0,1,1.14-.09l1.08-.25c.28-.53.32-.55.89-.34l.54,0c.78-.6.91-.61,1.77,0l1.49-.4a.58.58,0,0,1,.71-.35l.58-.25c.24-.63.85-.69,1.37-.89l.63-.21a2.06,2.06,0,0,0,.61-.31,10.52,10.52,0,0,1,2.48-1.68c0-.56-.07-1.12-.07-1.68V32.33c0-.47,0-.94,0-1.41L215,29.66l-.42-.19c-.55.14-.6.12-.83-.55h0a.7.7,0,0,1-.62-.49l-.55-.31a5.61,5.61,0,0,1-1.09-.05c-1.57-.45-3.13-.94-4.69-1.42a2,2,0,0,1-1.29-1c-.59-.23-1.26-.28-1.67-.83a1.26,1.26,0,0,1-.53-1.2,1,1,0,0,1,.2-1.27c.31-.36.68-.65,1.21-.4l1.66-.32a2.21,2.21,0,0,1,1.56-.49c.7,0,1.4-.06,2.1-.09a1.36,1.36,0,0,1,1.44-.47l.51-.12a.26.26,0,0,1,0-.23.89.89,0,0,1,.89-.5l.22-.1a3.69,3.69,0,0,1,2.24-1.38l.38-.51c0-.61-.06-1.21-.06-1.82V0H0V18.28c.25.21.66.25.75.64l.13.18c.77.65,1.55,1.3,2.31,2,.13.11.17.31.26.47l1.83,1.1.62-.11a.53.53,0,0,1,.87.2c.45.09.92.15,1.37.27s1,.26,1.24.8a.62.62,0,0,0,.24.08c.61.33.75.56.59,1a.93.93,0,0,1-.9.72.73.73,0,0,0-.22.09c-.12.17-.24.33-.35.5a1.41,1.41,0,0,1-1.15.69c-.27,0-.55,0-.83.06a4.63,4.63,0,0,0-3,1.16c-.36.32-.75.57-1.24.24L.61,29.81,0,30.09V184.5a6,6,0,0,1,2.59.45,2,2,0,0,0,.68.15,2.71,2.71,0,0,1,1.85.86,1.69,1.69,0,0,0,1.38.56,2.43,2.43,0,0,1,1.91.68,1.65,1.65,0,0,0,1.15.42c.28,0,.56,0,.84,0a3.09,3.09,0,0,1,2.9,3c0,.18-.22.37-.33.55q0,5.58,0,11.14c0,1.07,0,2.14-.06,3.2l.19.28c.5,1,.44,1.25-.4,2-.27.64.18,1.21.14,1.83-.11.46-.11.46-.48.27l-1.63.17a1.86,1.86,0,0,1-1.3.91.57.57,0,0,1-.71-.24l-.48.09a.84.84,0,0,1-.72.54l-1.87.35a4.27,4.27,0,0,1-2.8.85,1.17,1.17,0,0,1-1.09.41,3.71,3.71,0,0,0-1.72.16V367.88a2.43,2.43,0,0,0,1.48.24,1.43,1.43,0,0,1,1.38.5,3.57,3.57,0,0,0,2.88,1.43.8.8,0,0,1,.68.7l0,.06a2.9,2.9,0,0,1,2,.2c.51.08,1.08,0,1.42.56l.78.22.89-.11c.22-.05.46-.2.63-.14.74.25,1.46.58,2.19.84a9.47,9.47,0,0,0,1.46.37,1.24,1.24,0,0,1,1.09.73.2.2,0,0,1,0,.22l1.34.26,1.15-.13c.17,0,.36-.12.51-.07.82.25,1.64.52,2.43.84.26.1.31.43.28.72l.21,1.25.51.31c.39.23.4.3,0,.57a.53.53,0,0,0-.11.21,2.11,2.11,0,0,1-.1,1.46v.52l.35.38c.72.49.75.61.5,1.63a.26.26,0,0,0,.06.24s.1,0,.13,0a1.85,1.85,0,0,1,.43,2.29c0,.37.08.73.11,1.09,1.18.69,1.29,1,.87,2.53l-.12.62.24.86a.24.24,0,0,1,.21-.05c.94.23,1,.31,1.14,1.09l-.1.3c0,.28,0,.55,0,.82l.18.26c.42.57.42.61,0,1.22H27l-.1-.08.31.92.64.77c.42.38.43.44.08.91l-.11.51H186.23c.44-1.42.88-2.85,1.34-4.27C187.75,391.2,187.88,390.64,188.46,390.36Z" />
                                    <rect  x="11.05" y="29.32" width="191.59" height="149.69" onClick={(e) => { e.stopPropagation(); handleSectionClick('section1'); }} className={classNames('cls-lidTop', { selected: selectedSection === 'section1' })} />
                                    <rect  x="11.05" y="215.22" width="189.15" height="148.88" onClick={(e) => { e.stopPropagation(); handleSectionClick('section2'); }} className={classNames('cls-bottom', { selected: selectedSection === 'section2' })} />
                                    <rect  x="11.05" width="191.59" height="26.47" onClick={(e) => { e.stopPropagation(); handleSectionClick('section3'); }} className={classNames('cls-lidFront', { selected: selectedSection === 'section3' })} />
                                    <rect  x="14.31" y="181.46" width="183.86" height="30.92" onClick={(e) => { e.stopPropagation(); handleSectionClick('section4'); }} className={classNames('cls-bottomBack', { selected: selectedSection === 'section4' })} />
                                    <rect  x="28.14" y="365.73" width="158.09" height="30.27" onClick={(e) => { e.stopPropagation(); handleSectionClick('section5'); }} className={classNames('cls-bottomFront', { selected: selectedSection === 'section5' })} />
                                    <rect  x="202.64" y="215.22" width="13.07" height="148.88" onClick={(e) => { e.stopPropagation(); handleSectionClick('section6'); }} className={classNames('cls-bottomRight', { selected: selectedSection === 'section6' })} />
                                    <rect  y="215.22" width="9.02" height="148.88" onClick={(e) => { e.stopPropagation(); handleSectionClick('section7'); }} className={classNames('cls-bottomRight', { selected: selectedSection === 'section7' })} />
                                    <rect  y="30.09" width="9.02" height="148.92" onClick={(e) => { e.stopPropagation(); handleSectionClick('section8'); }} className={classNames('cls-lidLeft', { selected: selectedSection === 'section8' })}  />
                                    <rect  x="204.27" y="29.47" width="10.35" height="149.55" onClick={(e) => { e.stopPropagation(); handleSectionClick('section9'); }} className={classNames('cls-lidRight', { selected: selectedSection === 'section9' })} />
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
                            <rect id="lidTop"  x="11.05" y="29.32" width="191.59" height="149.69" onClick={(e) => { e.stopPropagation(); handleSectionClick('section1'); }} className={classNames('cls-trnsprnt', { selected: selectedSection === 'section1' })} />
                                    <rect id="bottom"  x="11.05" y="215.22" width="189.15" height="148.88" onClick={(e) => { e.stopPropagation(); handleSectionClick('section2'); }} className={classNames('cls-trnsprnt', { selected: selectedSection === 'section2' })} />
                                    <rect id="lidFront" x="11.05" width="191.59" height="26.47" onClick={(e) => { e.stopPropagation(); handleSectionClick('section3'); }} className={classNames('cls-lidFront', { selected: selectedSection === 'section3' })} />
                                    <rect id="bottomBack" x="14.31" y="181.46" width="183.86" height="30.92" onClick={(e) => { e.stopPropagation(); handleSectionClick('section4'); }} className={classNames('cls-trnsprnt', { selected: selectedSection === 'section4' })} />
                                    <rect  id="bottomFront" x="28.14" y="365.73" width="158.09" height="30.27" onClick={(e) => { e.stopPropagation(); handleSectionClick('section5'); }} className={classNames('cls-trnsprnt', { selected: selectedSection === 'section5' })} />
                                    <rect  id="bottomRight" x="202.64" y="215.22" width="13.07" height="148.88" onClick={(e) => { e.stopPropagation(); handleSectionClick('section6'); }} className={classNames('cls-trnsprnt', { selected: selectedSection === 'section6' })} />
                                    <rect id="bottomRight" y="215.22" width="9.02" height="148.88" onClick={(e) => { e.stopPropagation(); handleSectionClick('section7'); }} className={classNames('cls-trnsprnt', { selected: selectedSection === 'section7' })} />
                                    <rect id="lidLeft" y="30.09" width="9.02" height="148.92" onClick={(e) => { e.stopPropagation(); handleSectionClick('section8'); }} className={classNames('cls-trnsprnt', { selected: selectedSection === 'section8' })}  />
                                    <rect id="lidRight" x="204.27" y="29.47" width="10.35" height="149.55" onClick={(e) => { e.stopPropagation(); handleSectionClick('section9'); }} className={classNames('cls-trnsprnt', { selected: selectedSection === 'section9' })} />
                        </svg>

                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PizzaDesignContainer;