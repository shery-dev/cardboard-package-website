"use client";

import { useAppContext } from "@/context/Context";
import ProductForm from "./ProductForm";
import ToolsOptionsContainer from "./ToolsOptionsContainer";
import SideBar3D from "./SideBar3D";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

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
    const { activeItem, setSelectedSize, setViewType, setMaterial, setSideColors, setImages, setImagePositions, setImageSizes, setImageRotations, setExtTexImg, selectBoxPreset } = useAppContext();
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

    return (
        <>
            <div
                ref={mainDivRef}
                className="grid grid-cols-12 grid-rows-1 gap-1.5 h-full min-h-0 overflow-hidden py-1"
            >
                <div className="h-full min-h-0 rounded-l-xl overflow-hidden bg-gray-100 shadow-sm">
                    <SideBar3D />
                </div>
                <div
                    className={`w-full col-span-2 px-1.5 pt-1 bg-gray-100 shadow-sm min-h-0 overflow-auto ${activeItem === 'design' ? 'min-w-[calc(23.333%+400px)] max-h-[calc(100%-180px)] pb-[180px]' : 'pb-[190px]'}`}
                >
                    <ToolsOptionsContainer data={data} />
                </div>
                <div className="min-h-0 overflow-hidden col-span-6 col-start-4 row-start-1">
                    {children}
                </div>
                <div className="col-span-3 col-start-10 row-start-1 pt-1 pb-[180px] h-full min-h-0 flex flex-col">
                    <ProductForm data={
                        id === 'main' ? data : (subProdData ? subProdData[0] : '')
                    } />
                </div>
            </div>
        </>
    );
};

export default MainAppContainer;

