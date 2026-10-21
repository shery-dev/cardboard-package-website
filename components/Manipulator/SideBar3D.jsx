"use client";
import { HiColorSwatch } from "react-icons/hi";
import { MdOutlinePhotoSizeSelectSmall } from "react-icons/md";
import { FaBrush, FaStar, FaBoxesPacking } from "react-icons/fa6";
import { CiCalculator2 } from "react-icons/ci";
import { useAppContext } from '@/context/Context'

const SideBar3D = () => {
    const { activeItem, setActiveItem, viewType } = useAppContext()

    const handleClick = (name) => {
        setActiveItem(name)
    }

    return (
        <>
            <ul className="py-2 px-0 w-full h-full flex items-center flex-col gap-1.5 bg-gray-100">
                <li
                    onClick={() => handleClick('boxtype')}
                    className={`flex items-center justify-center flex-col w-3/4 rounded-lg px-2 py-1.5 cursor-pointer font-medium text-headingTxtColor hover:bg-green-100 ${activeItem === "boxtype" && 'bg-green-100'}`}
                >
                    <span className="text-2xl">
                        <FaBoxesPacking />
                    </span>
                    <span className="text-xs font-bold text-center leading-tight">BOX TYPE</span>
                </li>
                <li
                    onClick={() => handleClick('size')}
                    className={`flex items-center justify-center flex-col w-3/4 rounded-lg px-2 py-1.5 cursor-pointer font-medium text-headingTxtColor hover:bg-green-100 ${activeItem === "size" && 'bg-green-100'}`}
                >
                    <span className="text-2xl">
                        <MdOutlinePhotoSizeSelectSmall />
                    </span>
                    <span className="text-xs font-bold">SIZE</span>
                </li>
                <li
                    onClick={() => handleClick('material')}
                    className={`flex items-center justify-center flex-col w-3/4 rounded-lg px-2 py-1.5 cursor-pointer text-sm font-medium text-headingTxtColor hover:bg-green-100 ${activeItem === "material" && 'bg-green-100'}`}
                >
                    <span className="text-2xl">
                        <HiColorSwatch />
                    </span>
                    <span className="text-xs font-bold">MATERIAL</span>
                </li>
                <li
                    onClick={() => handleClick('design')}
                    className={`flex items-center justify-center flex-col w-3/4 rounded-lg px-2 py-1.5 cursor-pointer text-sm font-medium text-headingTxtColor hover:bg-green-100 ${activeItem === "design" && 'bg-green-100'}`}
                >
                    <span className="text-2xl">
                        <FaBrush />
                    </span>
                    <span className="text-xs font-bold">DESIGN</span>
                </li>
                <li
                    onClick={() => handleClick('quantity')}
                    className={`flex items-center justify-center flex-col w-3/4 rounded-lg px-2 py-1.5 cursor-pointer text-sm font-medium text-headingTxtColor hover:bg-green-100 ${activeItem === "quantity" && 'bg-green-100'}`}
                >
                    <span className="text-2xl">
                        <CiCalculator2 />
                    </span>
                    <span className="text-xs font-bold">QUANTITY</span>
                </li>
                <li
                    onClick={() => handleClick('featureproduct')}
                    className={`flex items-center justify-center flex-col w-3/4 rounded-lg px-2 py-1.5 cursor-pointer text-sm font-medium text-headingTxtColor hover:bg-green-100 ${(activeItem === "featureproduct" || activeItem === "feature-products") && 'bg-green-100'}`}
                >
                    <span className="text-2xl shrink-0">
                        <FaStar />
                    </span>
                    <span className="text-xs font-bold text-center leading-tight">FEATURED BRANDS</span>
                </li>
            </ul>
        </>
    )
}

export default SideBar3D
