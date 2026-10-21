"use client";

import { useAppContext } from '@/context/Context';
import { Card, Button } from 'flowbite-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const ReelConfigForm = ({ data }) => {
    const [selectedReel, setSelectedReel] = useState({});
    const [sizes, setSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState({});
    const [selectedWeight, setSelectedWeight] = useState({});
    const [price, setPrice] = useState(0);

    const { setItemsList } = useAppContext();

    useEffect(() => {
        if (selectedReel.Sizes) {
            setSizes(selectedReel.Sizes);
            setSelectedSize(selectedReel.Sizes[0] || {});
            setSelectedWeight({});
            setPrice(0);
        } else {
            setSizes([]);
            setSelectedSize({});
            setSelectedWeight({});
            setPrice(0);
        }
    }, [selectedReel]);

    useEffect(() => {
        if (selectedWeight.weight_type && selectedWeight.Rate) {
            setPrice(selectedWeight.weight_type * selectedWeight.Rate);
        } else {
            setPrice(0);
        }
    }, [selectedWeight]);

    useEffect(() => {
        if (selectedSize.Weight) {
            setSelectedWeight(selectedSize.Weight[0] || {});
        } else {
            setSelectedWeight({});
        }
    }, [selectedSize]);

    const handleClick = () => {
        if (price) {
            const item = {
                id: selectedReel?._id,
                ThreeD: false,
                name: selectedReel?.Type,
                img: selectedWeight?.images[0],
                quantity: 1,
                pricePerPiece: price,
                price: price,
                thickness: 3,
            };
            setItemsList((prev) => [...prev, item]);
            window.scroll(0, 0);
            setSelectedReel({});
            setSelectedSize({});
            setSizes([]);
            setSelectedWeight({});
            setPrice(0);
        }
    };

    return (
        <>
            <Card className="w-full">
                <div className="mb-2 flex items-center justify-between gap-2">
                    <h5 className="text-xl font-bold leading-none text-gray-800">Configure & Price</h5>
                    <Link href="#" className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                        Share
                    </Link>
                </div>
                <hr className="h-px bg-gray-300 border-0" />
                <form className="flex flex-col gap-4">
                    <div className="flex justify-between items-center flex-row">
                        <label htmlFor="reelProducts" className="w-1/4 text-headingTxtColor">Type:</label>
                        <select
                            id="reelProducts"
                            className="w-3/4 block py-2.5 px-0 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                            onChange={(e) => {
                                if (e.target.value) {
                                    setSelectedReel(JSON.parse(e.target.value));
                                } else {
                                    setSelectedReel({});
                                }
                            }}
                        >
                            <option value="">Choose a product</option>
                            {data?.data?.map((reel) => (
                                <option key={reel._id} value={JSON.stringify(reel)}>
                                    {reel.Type}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-between items-center flex-row">
                        <label htmlFor="reelSizes" className="w-1/4 text-headingTxtColor">Size:</label>
                        <select
                            id="reelSizes"
                            className="w-3/4 block py-2.5 px-0 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                            onChange={(e) => {
                                if (e.target.value) {
                                    setSelectedSize(JSON.parse(e.target.value));
                                } else {
                                    setSelectedSize({});
                                }
                            }}
                            disabled={!selectedReel.Type}
                            value={JSON.stringify(selectedSize) || ""}
                        >
                            <option value="">Choose a size</option>
                            {sizes?.map((size) => (
                                <option key={size._id} value={JSON.stringify(size)}>
                                    {size.Size}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-between items-center flex-row">
                        <label htmlFor="reelWeights" className="w-1/4 text-headingTxtColor">Weight:</label>
                        <select
                            id="reelWeights"
                            className="w-3/4 block py-2.5 px-0 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                            onChange={(e) => {
                                if (e.target.value) {
                                    setSelectedWeight(JSON.parse(e.target.value));
                                } else {
                                    setSelectedWeight({});
                                }
                            }}
                            disabled={!selectedSize.Size}
                            value={JSON.stringify(selectedWeight) || ""}
                        >
                            <option value="">Choose a weight</option>
                            {selectedSize?.Weight?.map((weight) => (
                                <option key={weight._id} value={JSON.stringify(weight)}>
                                    {weight.weight_type}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-center items-center flex-row gap-4">
                        <label htmlFor="underline_select" className="text-mainBgColor text-3xl font-bold">
                            Rs. {price ? price : 0}
                        </label>
                        <span id="underline_select" className="text-gray-600 text-sm"></span>
                    </div>
                    <Button
                        gradientDuoTone="pinkToOrange"
                        disabled={!price}
                        onClick={handleClick}
                    >
                        Add to Cart
                    </Button>
                </form>
            </Card>
        </>
    );
}

export default ReelConfigForm;