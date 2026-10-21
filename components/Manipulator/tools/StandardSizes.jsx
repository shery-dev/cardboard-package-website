"use client";

import { useAppContext } from "@/context/Context";

const StandardSizes = ({ data }) => {
    const { setSelectedSize, activeBoxPreset, selectedSize } = useAppContext();

    // If active preset has standardSizes, use them; otherwise fallback to data
    const presetSizes = activeBoxPreset?.standardSizes;

    if (presetSizes && presetSizes.length > 0) {
        return (
            <ul className="w-full flex items-start flex-col gap-1">
                {presetSizes.map((sizeOption, idx) => {
                    const isSelected =
                        Number(selectedSize?.length) === Number(sizeOption.length) &&
                        Number(selectedSize?.width) === Number(sizeOption.width) &&
                        Number(selectedSize?.depth) === Number(sizeOption.depth);

                    return (
                        <li
                            key={idx}
                            className={`w-full px-2.5 py-2 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                                isSelected
                                    ? "bg-green-100 border-green-500 text-green-900 font-bold"
                                    : "bg-white border-gray-200 text-gray-700 hover:bg-green-50 hover:text-headingTxtColor"
                            }`}
                            onClick={() =>
                                setSelectedSize({
                                    length: sizeOption.length,
                                    width: sizeOption.width,
                                    depth: sizeOption.depth,
                                })
                            }
                        >
                            <div className="flex items-center justify-between">
                                <span>{sizeOption.label}</span>
                                <span className="text-[10px] text-gray-500 font-normal">
                                    {sizeOption.length}×{sizeOption.width}×{sizeOption.depth}″
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    }

    return (
        <ul className="w-full flex items-start flex-col">
            {data?.map((prod) => (
                <li
                    key={prod?._id}
                    className="w-full px-2 py-1 text-gray-600 text-sm font-semibold border-b border-green-100 hover:text-headingTxtColor hover:bg-green-50 hover:cursor-pointer"
                    onClick={() =>
                        setSelectedSize({
                            length: prod?.dimensions?.length,
                            width: prod?.dimensions?.width,
                            depth: prod?.dimensions?.depth,
                        })
                    }
                >
                    {prod?.dimensions?.length} X {prod?.dimensions?.width} X {prod?.dimensions?.depth}
                </li>
            ))}
        </ul>
    );
};

export default StandardSizes;
