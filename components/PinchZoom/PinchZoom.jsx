"use client";

import Image from 'next/image'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'

const PinchZoom = ({imgSrc}) => {
    return (
        <>
            <TransformWrapper>
                <TransformComponent>
                    <Image 
                        height={300}
                        width={600}
                        src={imgSrc}
                        alt='zoom-img'
                    />
                </TransformComponent>
            </TransformWrapper>
        </>
    )
}

export default PinchZoom