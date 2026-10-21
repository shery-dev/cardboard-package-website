import Image from 'next/image';
import React, { useState } from 'react';

const Magnifier = ({ smallImageSrc, largeImageSrc, alt }) => {
    const [magnifiedX, setMagnifiedX] = useState(null);
    const [magnifiedY, setMagnifiedY] = useState(null);
    const [magWidth, setMagWidth] = useState(null);
    const [magHeight, setMagHeight] = useState(null);


    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        setMagWidth(width)
        setMagHeight(height)
        setMagnifiedX(x);
        setMagnifiedY(y);
    };

    const handleMouseLeave = () => {
        setMagnifiedX(null);
        setMagnifiedY(null);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <div
                style={{ position: 'relative' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <Image
                    height={400}
                    width={400}
                    src={smallImageSrc ? smallImageSrc : ""}
                    alt={alt}
                    style={{ width: '400px', height: 'auto' }}
                />
                {magnifiedX !== null && magnifiedY !== null && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '100%',
                            transform: 'translate(10%, -50%)',
                            width: magWidth,
                            height: magHeight,
                            background: `url(${largeImageSrc})`,
                            backgroundSize: '800px 800px', // adjust this according to your large image size
                            backgroundPosition: `-${magnifiedX * magWidth}px -${magnifiedY * magHeight}px`, // adjust this according to your large image size
                            border: '2px solid #000',
                            zIndex: 9999,
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default Magnifier;