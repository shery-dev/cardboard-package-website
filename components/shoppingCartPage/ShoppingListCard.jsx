"use client"
import { TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";

export default function ShoppingListCard(props) {
    const [quantity, setQuantity] = useState(props?.quantity);

    useEffect(() => {
        setQuantity(props?.quantity);
    }, [props?.quantity]);

    const handleQuantityChange = (e) => {
        const raw = e.target.value;
        if (raw === "") {
            setQuantity("");
            return;
        }
        const num = parseInt(raw, 10);
        if (Number.isNaN(num) || num < 1) return;
        const capped = Math.min(999, num);
        setQuantity(capped);
        props.onUpdateQuantity(props.id, capped);
    };

    const CUSTOM_BOX_IMAGE = "/products/Food.png";
    const rawSrc = props?.imgSrc;
    const isCustomBox = props?.isCustomBox;
    let imgSrc;
    if (isCustomBox) {
        imgSrc = rawSrc?.startsWith("data:") ? rawSrc : CUSTOM_BOX_IMAGE;
    } else {
        imgSrc = !rawSrc
            ? "/img/logo.svg"
            : rawSrc.startsWith("data:")
                ? rawSrc
                : rawSrc.startsWith("/")
                    ? rawSrc
                    : `/api/v1/fetchImg/${rawSrc}`;
    }

    const dim = props?.dimension;
    const dimensionText = dim
        ? `${dim.length ?? ""} × ${dim.width ?? ""} × ${dim.depth ?? ""} In`
        : null;

    return (
        <>
            <div className="relative shrink-0">
                <img
                    src={imgSrc}
                    alt={props?.name || "item"}
                    className="h-48 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
                    width={200}
                    height={200}
                />
            </div>
            <div className=" py-2 w-full">
                <div className=" w-full flex justify-between items-center flex-row">
                    <span>
                        {props?.categoryPath && (
                            <p className="text-sm font-medium text-gray-500 mb-0.5">
                                {props.categoryPath}
                            </p>
                        )}
                        <h5 className=" capitalize text-2xl font-bold tracking-tight text-gray-900">
                            {props?.name}
                        </h5>
                        {dimensionText && (
                            <span className="text-sm font-medium text-gray-500 mt-1 block">
                                {dimensionText}
                            </span>
                        )}
                        {(props?.pieceLabel || props?.material) && (
                            <span className="text-sm font-medium text-gray-500 mt-1 block">
                                Pack: {props.pieceLabel || props.material}
                            </span>
                        )}
                    </span>
                    <span
                        className=" capitalize text-2xl font-bold cursor-pointer text-red-700 hover:text-red-500"
                        onClick={() => props.onDelete(props.id)}
                    >
                        <IoIosCloseCircle />
                    </span>
                </div>
                <div className=" flex justify-between items-start flex-col gap-4">
                    {props?.designViewUrl && (
                        <a
                            href={props.designViewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-headingTxtColor hover:text-headingHover underline"
                        >
                            View design in new tab
                        </a>
                    )}
                    <span className=" text-lg font-bold text-gray-400">
                        $ {Number(props?.price).toFixed(2)}
                    </span>
                    <span className="flex justify-end items-center flex-row gap-2">
                        <span className=" text-lg font-medium text-gray-400">
                            Quantity:
                        </span>
                        <TextInput
                            type="number"
                            min={1}
                            max={999}
                            step={1}
                            value={quantity}
                            className=" w-28"
                            onBlur={() => { if (quantity === "" || quantity < 1) { const q = Math.max(1, Number(quantity) || 1); setQuantity(q); props.onUpdateQuantity(props.id, q); } }}
                            onKeyDown={(e) => e.key === "e" && e.preventDefault()}
                            onWheel={(e) => e.currentTarget.blur()}
                            onChange={handleQuantityChange}
                        />
                    </span>
                </div>
            </div>
        </>
    );
}
