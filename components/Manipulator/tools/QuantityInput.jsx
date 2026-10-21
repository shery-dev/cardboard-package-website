'use client';

import { useAppContext } from "@/context/Context";
import { TextInput } from "flowbite-react";
import { useState } from "react";

const MIN_QUANTITY = 500;

const QuantityInput = () => {
    const { quantity, setQuantity } = useAppContext();
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const v = e.target.value;
        setQuantity(v);
        const n = Number(v);
        if (v !== "" && !Number.isNaN(n) && n < MIN_QUANTITY) {
            setMessage(`Minimum quantity is ${MIN_QUANTITY}. Please add 500 or more.`);
        } else {
            setMessage("");
        }
    };

    const handleBlur = () => {
        const n = Number(quantity);
        if (quantity !== "" && !Number.isNaN(n) && n < MIN_QUANTITY) {
            setQuantity(String(MIN_QUANTITY));
            setMessage(`Quantity updated to ${MIN_QUANTITY}. Minimum is 500.`);
        }
    };

    return (
        <>
            <div className="w-full flex items-start justify-start flex-col gap-2">
                <span className="w-full text-sm font-semibold text-gray-600">Enter quantity (min {MIN_QUANTITY})</span>
                <span className="w-full">
                    <TextInput
                        type="number"
                        min={MIN_QUANTITY}
                        value={quantity}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </span>
                {message && (
                    <p className="text-amber-600 text-xs">{message}</p>
                )}
            </div>
        </>
    );
};

export default QuantityInput;