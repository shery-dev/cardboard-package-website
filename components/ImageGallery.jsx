import Image from 'next/image'
import React from 'react'

const ImageGallery = (props) => {
    return (
        <div className="mx-0 sm:mx-4 lg:mx-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="w-full">
                    <Image
                        src={props.imgSrc.img1}
                        alt='img 1'
                        width={500}
                        height={500}
                        className="w-full h-auto"
                    />
                </div>
                <div className="w-full">
                    <Image
                        src={props.imgSrc.img2}
                        alt='img 2'
                        width={500}
                        height={500}
                        className="w-full h-auto"
                    />
                </div>
                <div className="md:col-span-2 lg:row-span-2 xl:row-span-2">
                    <Image
                        src={props.imgSrc.img3}
                        alt='img 3'
                        width={500}
                        height={500}
                        className="w-full h-auto"
                    />
                </div>
                <div className="md:col-span-2 lg:row-span-2 xl:row-span-2">
                    <Image
                        src={props.imgSrc.img4}
                        alt='img 4'
                        width={500}
                        height={500}
                        className="w-full h-auto"
                    />
                </div>
                <div>
                    <Image
                        src={props.imgSrc.img5}
                        alt='img 5'
                        width={500}
                        height={500}
                        className="w-full h-auto"
                    />
                </div>
                <div>
                    <Image
                        src={props.imgSrc.img6}
                        alt='img 6'
                        width={500}
                        height={500}
                        className="w-full h-auto"
                    />
                </div>
            </div>
        </div>
    )
}

export default ImageGallery
