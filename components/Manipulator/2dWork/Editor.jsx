"use client";

import { useState, useRef } from 'react';
import classNames from 'classnames';

const Editor = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [images, setImages] = useState({});
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePositions, setImagePositions] = useState({});
  const [imageSizes, setImageSizes] = useState({});
  const svgRef = useRef();

  const handleSectionClick = (id) => {
    setSelectedSection(id);
  };

  const handleImageUpload = (event) => {
    if (selectedSection) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages({ ...images, [selectedSection]: e.target.result });
          setImagePositions({ ...imagePositions, [selectedSection]: { x: 10, y: 10 } });
          setImageSizes({ ...imageSizes, [selectedSection]: { width: 100, height: 100 } });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const deleteImage = () => {
    if (selectedSection) {
      const newImages = { ...images };
      delete newImages[selectedSection];
      setImages(newImages);

      const newPositions = { ...imagePositions };
      delete newPositions[selectedSection];
      setImagePositions(newPositions);

      const newSizes = { ...imageSizes };
      delete newSizes[selectedSection];
      setImageSizes(newSizes);
    }
  };

  const handleMouseDown = (event, id) => {
    event.stopPropagation();
    setDragging(true);
    setSelectedSection(id);
    const svgRect = svgRef.current.getBoundingClientRect();
    setDragStart({
      x: event.clientX - svgRect.left - (imagePositions[id]?.x || 0),
      y: event.clientY - svgRect.top - (imagePositions[id]?.y || 0),
    });
  };

  const handleResizeMouseDown = (event) => {
    event.stopPropagation();
    setResizing(true);
    const svgRect = svgRef.current.getBoundingClientRect();
    setDragStart({
      x: event.clientX - svgRect.left,
      y: event.clientY - svgRect.top,
    });
  };

  const handleMouseMove = (event) => {
    if (dragging && selectedSection) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const newX = event.clientX - svgRect.left - dragStart.x;
      const newY = event.clientY - svgRect.top - dragStart.y;
      setImagePositions({
        ...imagePositions,
        [selectedSection]: { x: newX, y: newY },
      });
    } else if (resizing && selectedSection) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const newWidth = event.clientX - svgRect.left - (imagePositions[selectedSection]?.x || 0);
      const newHeight = event.clientY - svgRect.top - (imagePositions[selectedSection]?.y || 0);
      setImageSizes({
        ...imageSizes,
        [selectedSection]: { width: newWidth, height: newHeight },
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(false);
  };

  return (
    <div className=' w-full'>
      <svg
        ref={svgRef}
        width="500"
        height="500"
        xmlns="http://www.w3.org/2000/svg"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        viewBox="0 0 245.76 245.76"
        className=' w-full'
      >
        <defs>
          <style>
            {`.cls-1{fill:#fff;}.cls-2{fill:#e8e8e8;}.cls-3{fill:#f9f9f9;}`}
          </style>
        </defs>
        <g id="Layer_2" data-name="Layer 2">
          <g id="MailerTexture">
            <path className="cls-2"
              d="M99.78,195.39c-.6-.07-1.21-.21-1.81-.22H3.73c-1.82,0-1.82,0-1.82-1.81V149c0-1.55,0-1.55,1.6-1.55H99l0-.39c-.43,0-.86-.09-1.29-.09-7.23,0-14.46,0-21.7,0-1.17,0-1.47-.34-1.47-1.48q.06-22.12,0-44.24c0-1.19.27-1.58,1.52-1.57q10.43.09,20.86,0a33.44,33.44,0,0,0,4.18-.54l0-.38-9.49-1.7c-4.21-.75-8.43-1.49-12.64-2.25-1.5-.27-3-.6-4.5-.85-2.86-.49-4.14-2.37-4.16-5-.08-9.35-.06-18.7,0-28.05,0-2.94,1.59-4.78,4.66-5.3C79.31,54.86,83.66,54,88,53.25c3.9-.69,7.81-1.35,11.71-2l.08-.31a5.47,5.47,0,0,0-1.34-.33q-12.11,0-24.22,0c-1.44,0-2.88,0-4.32,0-.84,0-1.13-.26-1.1-1.1.28-8.23,1.31-16.31,4.27-24.07,2.51-6.56,6-12.49,11.31-17.14,4.22-3.68,9-5.94,14.84-5.92q23.44.09,46.88,0a21.36,21.36,0,0,1,13,4.44c5.62,4.14,9.29,9.74,12.09,16a58.78,58.78,0,0,1,4.42,15.3c.56,3.78.55,7.65.8,11.49.08,1.1-.67,1-1.35,1q-14.08,0-28.18,0a7.81,7.81,0,0,0-1.42.24l.05.34c3,.52,6,1,9,1.56s6,1,9.06,1.51c2.55.44,5.1.92,7.65,1.37a5.52,5.52,0,0,1,4.25,5q-.1,14.15,0,28.3a5.55,5.55,0,0,1-4.21,5.27c-3.87.66-7.75,1.29-11.62,2-4.41.76-8.81,1.55-13.22,2.33a5.78,5.78,0,0,0-2,.61,12.22,12.22,0,0,0,2.73.62q11.21.08,22.42,0c1.06,0,1.36.3,1.36,1.36q0,22.29,0,44.59c0,1.1-.38,1.33-1.39,1.33-7.31,0-14.63,0-21.94,0h-1.26l0,.33a13.54,13.54,0,0,0,1.4.14h70.14c8,0,16,0,24,0,1.25,0,1.52.38,1.52,1.56,0,14.87,0,29.74,0,44.6,0,1.58,0,1.59-1.57,1.59H147.35a3.62,3.62,0,0,0-1.79.48h1.5c6.95,0,13.91,0,20.86,0,1.14,0,1.4.35,1.4,1.44q0,22.29,0,44.59c0,1.14-.29,1.5-1.46,1.5q-45.21,0-90.41,0c-1.17,0-1.46-.36-1.46-1.5q.06-22.29,0-44.59c0-1.09.26-1.45,1.4-1.44,7.43,0,14.87,0,22.3,0Z" />
            <rect id="lidFront" x="98.81" y="2.61" width="48.1" height="47.59" onClick={(e) => { e.stopPropagation(); handleSectionClick('section1'); }} className={classNames('cls-3', { selected: selectedSection === 'section1' })} />
            <rect id="lidTop" x="98.81" y="52.44" width="48.1" height="44.54" onClick={(e) => { e.stopPropagation(); handleSectionClick('section2'); }} className={classNames('cls-3', { selected: selectedSection === 'section2' })} />
            <rect id="back" x="98.81" y="101.66" width="48.1" height="43.73" onClick={(e) => { e.stopPropagation(); handleSectionClick('section3'); }} className={classNames('cls-3', { selected: selectedSection === 'section3' })} />
            <rect id="bottom" x="98.81" y="148.24" width="48.1" height="46.07" onClick={(e) => { e.stopPropagation(); handleSectionClick('section4'); }} className={classNames('cls-3', { selected: selectedSection === 'section4' })} />
            <rect id="front" x="98.81" y="196.24" width="48.1" height="45.56" onClick={(e) => { e.stopPropagation(); handleSectionClick('section5'); }} className={classNames('cls-3', { selected: selectedSection === 'section5' })} />
            <rect id="right" x="147.93" y="148.24" width="48.97" height="45.81" onClick={(e) => { e.stopPropagation(); handleSectionClick('section6'); }} className={classNames('cls-3', { selected: selectedSection === 'section6' })} />
            <rect id="left" x="45.58" y="148.24" width="51.71" height="46.07" onClick={(e) => { e.stopPropagation(); handleSectionClick('section7'); }} className={classNames('cls-3', { selected: selectedSection === 'section7' })} />
          </g>
        </g>

        {Object.keys(images).map(id => (
          images[id] && (
            <g key={id}>
              <image
                href={images[id]}
                x={imagePositions[id]?.x || 10}
                y={imagePositions[id]?.y || 10}
                width={imageSizes[id]?.width || 100}
                height={imageSizes[id]?.height || 100}
                onMouseDown={(e) => handleMouseDown(e, id)}
                style={{ cursor: 'move' }}
              />
              {selectedSection === id && (
                <rect
                  x={(imagePositions[id]?.x || 10) + (imageSizes[id]?.width || 100) - 10}
                  y={(imagePositions[id]?.y || 10) + (imageSizes[id]?.height || 100) - 10}
                  width="10"
                  height="10"
                  fill="red"
                  onMouseDown={handleResizeMouseDown}
                  style={{ cursor: 'nwse-resize' }}
                />
              )}
            </g>
          )
        ))}

      </svg>
      {selectedSection && (
        <div>
          <button onClick={deleteImage}>Delete Image</button>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
      )}
    </div>
  );
};

export default Editor;