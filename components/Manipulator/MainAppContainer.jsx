"use client";

import { useAppContext } from "@/context/Context";
import ProductForm from "./ProductForm";
import ToolsOptionsContainer from "./ToolsOptionsContainer";
import SideBar3D from "./SideBar3D";
import UniversalDieNetContainer from "./assets/UniversalDieNetContainer";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FaCube, FaPenRuler, FaTableColumns, FaPen } from "react-icons/fa6";

async function getData() {
    try {
        const res = await fetch("/api/v1/cardboard-types");
        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        let data = await res.json();
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        return null; // Return null or appropriate default data in case of error
    }
}

async function getSubProductData(id) {
    try {
        const res = await fetch(`/api/v1/getSingleProductById/${id}`);
        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        let data = await res.json();
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        return null; // Return null or appropriate default data in case of error
    }
}

const MainAppContainer = ({ children }) => {
    const mainDivRef = useRef(null);
    const {
        activeItem,
        setActiveItem,
        setSelectedSize,
        setViewType,
        setMaterial,
        setSideColors,
        setImages,
        setImagePositions,
        setImageSizes,
        setImageRotations,
        setExtTexImg,
        selectBoxPreset,
        selectedSize,
        material,
        activeBoxPreset,
        viewMode,
        setViewMode,
        projectName,
        setProjectName
    } = useAppContext();
    const [data, setData] = useState('');
    const [subProdData, setSubProdData] = useState(null);

    const searchParams = useSearchParams();
    const id = searchParams.get('type');
    const designId = searchParams.get('designId');
    const presetParam = searchParams.get('preset');

    useEffect(() => {
        if (presetParam && selectBoxPreset) {
            selectBoxPreset(presetParam);
        }
    }, [presetParam, selectBoxPreset]);

    useEffect(() => {
        if (id === 'main' && designId) {
            const loadDesign = async () => {
                try {
                    const res = await fetch(`/api/v1/saved-designs/${designId}`);
                    if (!res.ok) return;
                    const json = await res.json();
                    const d = json.data;
                    if (d) {
                        if (d.colour && setSideColors) setSideColors(d.colour);
                        if (d.images && setImages) setImages(d.images);
                        if (d.imagePosition && setImagePositions) setImagePositions(d.imagePosition);
                        if (d.imagesizes && setImageSizes) setImageSizes(d.imagesizes);
                        if (d.imageRotation && setImageRotations) setImageRotations(d.imageRotation);
                        if (d.materail && setExtTexImg) setExtTexImg(d.materail);
                    }
                } catch (e) {
                    console.error('Failed to load saved design', e);
                }
            };
            loadDesign();
        }
    }, [id, designId, setSideColors, setImages, setImagePositions, setImageSizes, setImageRotations, setExtTexImg]);

    useEffect(() => {
        let isMounted = true;
        if (id === 'main') {
            const dataFetcher = async () => {
                const fetchedData = await getData();
                if (!isMounted) return;
                const selectedBoxData = fetchedData?.data?.find(
                    (box) => box.cardboardname === 'Mailer Boxes' || box.cardboardname === 'Corrugated Boxes'
                ) || fetchedData?.data?.[2] || fetchedData?.data?.[0];
                const length = Number(searchParams.get("length"));
                const width = Number(searchParams.get("width"));
                const depth = Number(searchParams.get("depth"));
                const materialParam = searchParams.get("material");
                if (materialParam && ["Kraft", "White", "Dreamcoat"].includes(materialParam)) {
                    setMaterial(materialParam);
                }
                if (length && width && depth) {
                    setSelectedSize({ length, width, depth });
                }
                setData(selectedBoxData);
                setViewType("main-type");
            };
            dataFetcher();
        } else {
            const dataFetcher = async () => {
                const length = Number(searchParams.get("length")) || 10;
                const width = Number(searchParams.get("width")) || 10;
                const depth = Number(searchParams.get("depth")) || 4;
                if (!isMounted) return;
                setSelectedSize({ length, width, depth });

                if (id) {
                    const fetchedData = await getSubProductData(id);
                    if (!isMounted) return;
                    setSubProdData(fetchedData?.data);
                    if (fetchedData?.data?.[0]?.dimensions) {
                        setSelectedSize({
                            length: Number(fetchedData.data[0].dimensions.length) || length,
                            width: Number(fetchedData.data[0].dimensions.width) || width,
                            depth: Number(fetchedData.data[0].dimensions.depth) || depth,
                        });
                    }
                }
                setViewType("sub-type");
            };
            dataFetcher();
        }
        return () => {
            isMounted = false;
        };
    }, [id]);

    // Determine Packlane-style Active Step
    const currentStep =
        activeItem === 'quantity' ? 3 :
        (activeItem === 'design' || activeItem === 'featureproduct' || activeItem === 'feature-products') ? 2 : 1;

    return (
        <div ref={mainDivRef} className="w-full h-full flex flex-col overflow-hidden bg-[#FAF7F2]">
            {/* Packlane-Style Top Header Bar */}
            <header className="w-full shrink-0 h-13 px-4 bg-white border-b border-[#DCCFC2] flex items-center justify-between shadow-2xs z-20">
                {/* Left: Editable Project Title & Specs */}
                <div className="flex items-center gap-2.5">
                    <div>
                        <div className="flex items-center gap-1.5">
                            <input
                                type="text"
                                value={projectName !== undefined && projectName !== '' ? projectName : (activeBoxPreset?.name || 'Custom Box')}
                                onChange={(e) => setProjectName && setProjectName(e.target.value)}
                                className="text-sm font-bold text-[#2B211B] bg-transparent hover:bg-[#FAF7F2] focus:bg-white focus:ring-1 focus:ring-[#A94F32] rounded px-1 -ml-1 border border-transparent focus:border-[#DCCFC2] outline-none max-w-[220px] transition-colors truncate"
                                title="Click to rename project"
                            />
                            <FaPen className="text-[10px] text-[#6B584D]/40" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A94F32] bg-[#A94F32]/10 px-1.5 py-0.5 rounded ml-1">
                                {activeBoxPreset?.category || 'Custom Box'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#6B584D]">
                            <span className="font-semibold text-[#2B211B]">
                                {selectedSize ? `${selectedSize.length}″ × ${selectedSize.width}″ × ${selectedSize.depth}″` : '10″ × 10″ × 4″'}
                            </span>
                            <span>•</span>
                            <span className="capitalize">{material || 'Kraft'}</span>
                        </div>
                    </div>
                </div>

                {/* Center: 3-Step Packlane Workflow Stepper */}
                <nav aria-label="Customizer Steps" className="hidden lg:flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveItem('size')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                            currentStep === 1
                                ? "bg-[#2B211B] text-[#FFFDFC] shadow-xs"
                                : "text-[#6B584D] hover:bg-[#F2ECE4] hover:text-[#2B211B]"
                        }`}
                    >
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 1 ? "bg-[#C7A882] text-[#2B211B]" : "bg-[#DCCFC2] text-[#6B584D]"}`}>1</span>
                        <span>Size & Material</span>
                    </button>

                    <div className="w-4 h-[1px] bg-[#DCCFC2]" />

                    <button
                        type="button"
                        onClick={() => setActiveItem('design')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                            currentStep === 2
                                ? "bg-[#2B211B] text-[#FFFDFC] shadow-xs"
                                : "text-[#6B584D] hover:bg-[#F2ECE4] hover:text-[#2B211B]"
                        }`}
                    >
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 2 ? "bg-[#C7A882] text-[#2B211B]" : "bg-[#DCCFC2] text-[#6B584D]"}`}>2</span>
                        <span>Design & Artwork</span>
                    </button>

                    <div className="w-4 h-[1px] bg-[#DCCFC2]" />

                    <button
                        type="button"
                        onClick={() => setActiveItem('quantity')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                            currentStep === 3
                                ? "bg-[#2B211B] text-[#FFFDFC] shadow-xs"
                                : "text-[#6B584D] hover:bg-[#F2ECE4] hover:text-[#2B211B]"
                        }`}
                    >
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${currentStep === 3 ? "bg-[#C7A882] text-[#2B211B]" : "bg-[#DCCFC2] text-[#6B584D]"}`}>3</span>
                        <span>Quantity & Pricing</span>
                    </button>
                </nav>

                {/* Right: Studio Mode Switcher + Step Navigation */}
                <div className="flex items-center gap-2.5">
                    {/* Packlane Studio 3-Way Mode Switcher */}
                    <div className="flex items-center gap-0.5 bg-[#FAF7F2] p-1 rounded-lg border border-[#DCCFC2]">
                        <button
                            type="button"
                            onClick={() => setViewMode && setViewMode('3d')}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                                viewMode === '3d'
                                    ? "bg-[#2B211B] text-[#FFFDFC] shadow-xs"
                                    : "text-[#6B584D] hover:text-[#2B211B]"
                            }`}
                            title="Full 3D Box Model"
                        >
                            <FaCube className="text-[11px]" />
                            <span className="hidden sm:inline">3D</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (setViewMode) setViewMode('2d');
                                if (setActiveItem) setActiveItem('design');
                            }}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                                viewMode === '2d'
                                    ? "bg-[#2B211B] text-[#FFFDFC] shadow-xs"
                                    : "text-[#6B584D] hover:text-[#2B211B]"
                            }`}
                            title="2D CAD Die Net"
                        >
                            <FaPenRuler className="text-[11px]" />
                            <span className="hidden sm:inline">2D Net</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (setViewMode) setViewMode('split');
                                if (setActiveItem) setActiveItem('design');
                            }}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                                viewMode === 'split'
                                    ? "bg-[#2B211B] text-[#FFFDFC] shadow-xs"
                                    : "text-[#6B584D] hover:text-[#2B211B]"
                            }`}
                            title="Split View: 2D Net with Live 3D Dock"
                        >
                            <FaTableColumns className="text-[11px]" />
                            <span className="hidden sm:inline">Split</span>
                        </button>
                    </div>

                    {currentStep < 3 ? (
                        <button
                            type="button"
                            onClick={() => setActiveItem(currentStep === 1 ? 'design' : 'quantity')}
                            className="bg-[#2B211B] hover:bg-[#A94F32] text-[#FFFDFC] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-xs"
                        >
                            Next Step →
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setActiveItem('size')}
                            className="text-[#6B584D] hover:text-[#2B211B] text-xs font-bold px-2 py-1"
                        >
                            ← Back to Sizing
                        </button>
                    )}
                </div>
            </header>

            {/* Packlane Workspace: Left Dock, Active Tool Drawer, Center Studio Canvas, Right Summary */}
            <div className="w-full flex-1 min-h-0 flex overflow-hidden p-2 gap-2">
                {/* Left Tool Rail (64px) */}
                <div className="w-16 shrink-0 h-full rounded-xl overflow-hidden shadow-xs">
                    <SideBar3D />
                </div>

                {/* Active Tool Options Drawer */}
                <div className={`h-full shrink-0 overflow-y-auto bg-white rounded-xl border border-[#DCCFC2] p-2.5 shadow-xs transition-all duration-200 ${
                    activeItem === 'design' ? 'w-[450px]' : 'w-[290px]'
                }`}>
                    <ToolsOptionsContainer data={data} />
                </div>

                {/* Center Studio Viewport (Packlane Responsive Canvas) */}
                <div className="flex-1 min-w-0 h-full relative overflow-hidden rounded-xl border border-[#DCCFC2] bg-white">
                    {/* 2D Flat CAD Net (Active in '2d' and 'split' modes) */}
                    {(viewMode === '2d' || viewMode === 'split') && (
                        <div className="w-full h-full">
                            <UniversalDieNetContainer isFullCanvas={true} />
                        </div>
                    )}

                    {/* 3D Box Model Viewport:
                        - In '3d' mode: full center stage
                        - In 'split' mode: floating corner dock (Packlane signature #tdIframe style)
                        - In '2d' mode: visually hidden (preserves WebGL context without re-instantiation)
                    */}
                    <div
                        className={
                            viewMode === '3d'
                                ? "w-full h-full"
                                : viewMode === 'split'
                                ? "absolute top-3 right-3 w-[300px] h-[230px] rounded-xl overflow-hidden border-2 border-[#2B211B]/20 shadow-2xl z-30 transition-all hover:scale-[1.02] bg-white"
                                : "hidden"
                        }
                    >
                        {children}
                    </div>
                </div>

                {/* Right Order Summary & Pricing Sidebar */}
                <div className="w-[280px] xl:w-[310px] shrink-0 h-full">
                    <ProductForm data={
                        id === 'main' ? data : (subProdData ? subProdData[0] : '')
                    } />
                </div>
            </div>
        </div>
    );
};

export default MainAppContainer;

