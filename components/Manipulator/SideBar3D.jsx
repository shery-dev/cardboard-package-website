"use client";
import { HiColorSwatch } from "react-icons/hi";
import { MdOutlinePhotoSizeSelectSmall } from "react-icons/md";
import { FaBrush, FaStar, FaBoxesPacking } from "react-icons/fa6";
import { CiCalculator2 } from "react-icons/ci";
import { useAppContext } from '@/context/Context'

const SideBar3D = () => {
    const { activeItem, setActiveItem } = useAppContext()

    const navItems = [
        { id: 'boxtype', label: 'Box Type', icon: <FaBoxesPacking /> },
        { id: 'size', label: 'Size', icon: <MdOutlinePhotoSizeSelectSmall /> },
        { id: 'material', label: 'Material', icon: <HiColorSwatch /> },
        { id: 'design', label: '2D Net', icon: <FaBrush /> },
        { id: 'featureproduct', label: 'Brands', icon: <FaStar /> },
        { id: 'quantity', label: 'Pricing', icon: <CiCalculator2 /> },
    ];

    return (
        <nav aria-label="Customizer Tools" className="w-full h-full py-2 px-1 flex flex-col items-center gap-1.5 bg-[#FAF7F2] border-r border-[#DCCFC2]">
            {navItems.map((item) => {
                const isActive = activeItem === item.id || (item.id === 'featureproduct' && activeItem === 'feature-products');
                return (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveItem(item.id)}
                        className={`flex flex-col items-center justify-center w-full py-2 px-1 rounded-lg transition-all text-center group ${
                            isActive
                                ? "bg-[#2B211B] text-[#FFFDFC] shadow-xs"
                                : "text-[#6B584D] hover:bg-[#F2ECE4] hover:text-[#2B211B]"
                        }`}
                    >
                        <span className={`text-xl transition-transform group-hover:scale-105 ${isActive ? "text-[#C7A882]" : "text-[#6B584D]"}`}>
                            {item.icon}
                        </span>
                        <span className="text-[10px] font-bold tracking-tight uppercase mt-1 leading-none">
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
};

export default SideBar3D;
