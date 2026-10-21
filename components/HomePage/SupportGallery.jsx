import Image from 'next/image'
import React from 'react'
import people1 from "@/public/img/People1.png"
import people2 from "@/public/img/People2.png"
import people3 from "@/public/img/People.png"


const SupportGallery = () => {
    return (
        <>
            <div className=' flex justify-center items-center flex-col gap-4 lg:flex-row xl:flex-row'>
                <div className='relative'>
                    <Image
                        width={500}
                        height={500}
                        src={people1}
                        alt='img'
                    />
                    <div className=' absolute top-0 right-0 flex justify-between items-center gap-1 flex-row px-4 py-2 font-normal font-inter text-sm md:font-semibold md:text-base lg:font-bold lg:text-lg xl:font-bold xl:text-lg'>
                        <span className=' text-mainBgColor'></span>
                      
                    </div>
                </div>
                <div className='flex justify-between items-center flex-col gap-4'>
                    <div className='relative'>
                        <Image
                            width={500}
                            height={250}
                            src={people2}
                            alt='img'
                        />
                        <div className=' absolute top-0 flex justify-between items-center gap-1 flex-row px-4 py-2 font-normal font-inter text-sm md:font-semibold md:text-base lg:font-bold lg:text-lg xl:font-bold xl:text-lg'>
                            <span className=' text-black'></span>
                        
                        </div>
                    </div>
                    <div className='relative'>
                        <Image
                            width={500}
                            height={250}
                            src={people3}
                            alt='img'
                        />
                        <div className=' absolute top-0 flex justify-between items-center gap-1 flex-row px-4 py-2 font-normal font-inter text-sm md:font-semibold md:text-base lg:font-bold lg:text-lg xl:font-bold xl:text-lg'>
                            <span className=' text-black'></span>
                           
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SupportGallery
