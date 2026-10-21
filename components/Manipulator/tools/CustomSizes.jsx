"use client";

import { useAppContext } from "@/context/Context";
import { TextInput } from "flowbite-react";
import { useEffect, useState } from "react";

const CustomSizes = () => {
    const { selectedSize, setSelectedSize } = useAppContext();
    const [localSize, setLocalSize] = useState(selectedSize);

    useEffect(() => {
        setLocalSize(selectedSize);
    }, [selectedSize]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalSize(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (value !== '' && !isNaN(Number(value))) {
            setSelectedSize(prevState => ({
                ...prevState,
                [name]: Number(value)
            }));
        }
    };

    return (
        <div className="w-full flex items-center flex-col gap-1">
            <div className="w-full flex items-center justify-between flex-row">
                <span className="w-1/2 font-semibold text-gray-600">Length</span>
                <span className="w-1/2">
                    <TextInput
                        type="number"
                        name="length"
                        min="1"
                        step="0.5"
                        value={localSize?.length ?? ''}
                        onChange={handleInputChange}
                    />
                </span>
            </div>
            <div className="w-full flex items-center justify-between flex-row">
                <span className="w-1/2 font-semibold text-gray-600">Width</span>
                <span className="w-1/2">
                    <TextInput
                        type="number"
                        name="width"
                        min="1"
                        step="0.5"
                        value={localSize?.width ?? ''}
                        onChange={handleInputChange}
                    />
                </span>
            </div>
            <div className="w-full flex items-center justify-between flex-row">
                <span className="w-1/2 font-semibold text-gray-600">Depth</span>
                <span className="w-1/2">
                    <TextInput
                        type="number"
                        name="depth"
                        min="0.5"
                        step="0.5"
                        value={localSize?.depth ?? ''}
                        onChange={handleInputChange}
                    />
                </span>
            </div>
        </div>
    );
};

export default CustomSizes;
