"use client"

import { useEffect, useState } from "react";
import { Button, TextInput, Select, Radio, Label } from "flowbite-react";
import { useAppContext } from "@/context/Context";

const RollDP = ({ data }) => {
    const [quantity, setQuantity] = useState(500);
    const [size, setSize] = useState({});
    const [rollType, setRollType] = useState("thick");
    const [roll, setRoll] = useState([]);
    const [pricePerPiece, setPricePerPiece] = useState(0);
    const [price, setPrice] = useState(0);

    const { setItemsList } = useAppContext();

    const handleQuantityCounter = (actionType) => {
        if (actionType === 'inc') {
            setQuantity((prev) => prev + 500);
        } else {
            setQuantity((prev) => (prev > 500 ? prev - 500 : 500));
        }
    };

    useEffect(() => {
        if (data?.Sizes) {
            setSize(data?.Sizes[rollType][0]);
        }
    }, [data, rollType]);

    useEffect(() => {
        if (data?.Sizes) {
            const prod = data?.Sizes[rollType];
            setRoll(prod);
        }
    }, [data, rollType]);

    useEffect(() => {
        if (roll.length > 0) {
            setSize(roll[0]);
        }
    }, [roll]);

    useEffect(() => {
        const pricePP = data?.Rate * size?.Size;
        setPricePerPiece(pricePP);
        setPrice(pricePP * quantity);
    }, [size, quantity]);

    const handleClick = () => {
        if (price) {
            const item = {
                id: data?._id,
                ThreeD: false,
                name: data?.Type,
                img: data?.images[0],
                quantity: quantity,
                pricePerPiece: pricePerPiece,
                price: price,
                thickness: 3,
            };
            setItemsList((prev) => [...prev, item]);
            window.scroll(0, 0);
        }
    };

    return (
        <div className=" my-2">
            <h2 className=" capitalize font-bold text-3xl">{data?.Type}</h2>
            <p className="my-2 font-normal text-justify">{data?.description}</p>
            <hr className="bg-gray-300 border-1 border-top border-gray-300" />

            <ul className=" my-2">
                <li className="flex justify-between items-center flex-row mb-2">
                    <span className="font-semibold text-gray-900">Type</span>
                    <span className=" flex justify-between items-center flex-row gap-4">
                        <div className="flex items-center gap-2">
                            <Radio
                                id="thick"
                                name="rollType"
                                value="thick"
                                className="h-4 w-4 border border-gray-300 text-mainBgColor focus:ring-2 focus:ring-mainBgColor "
                                onClick={() => setRollType("thick")}
                                defaultChecked
                            />
                            <Label htmlFor="thick">Thick</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Radio
                                id="thin"
                                name="rollType"
                                value="thin"
                                className="h-4 w-4 border border-gray-300 text-mainBgColor focus:ring-2 focus:ring-mainBgColor "
                                onClick={() => setRollType("thin")}
                            />
                            <Label htmlFor="thin">Thin</Label>
                        </div>
                    </span>
                </li>
                <li className="flex justify-between items-center flex-row mb-2">
                    <span className="font-semibold text-gray-900">Sizes</span>
                    <Select
                        className=" w-36 border-gray-300 bg-gray-50 text-gray-900 focus:border-mainBgColor focus:ring-mainBgColor"
                        onChange={(e) => {
                            setSize(() => JSON.parse(e.target.value));
                        }}
                        value={JSON.stringify(size)}
                    >
                        {roll?.map((size) => (
                            <option
                                key={size?.Size}
                                value={JSON.stringify(size)}
                            >
                                {size?.Size}
                            </option>
                        ))}
                    </Select>
                </li>
                <li className="flex justify-between items-center flex-row mb-2">
                    <span className="font-semibold text-gray-900">Price Per Piece</span>
                    <span>Rs. {pricePerPiece}</span>
                </li>
                <li className="flex justify-between items-center flex-row mb-2">
                    <span className="font-semibold text-gray-900">Quantity</span>
                    <span className="flex justify-end items-center flex-row gap-2">
                        <Button
                            className=" border border-transparent bg-mainBgColor text-white focus:ring-4 focus:ring-red-300 enabled:hover:bg-mainBgHover"
                            onClick={() => handleQuantityCounter('dec')}
                        >
                            -
                        </Button>
                        <TextInput type="text" className=" w-20" value={quantity} disabled readOnly />
                        <Button
                            className=" border border-transparent bg-mainBgColor text-white focus:ring-4 focus:ring-red-300 enabled:hover:bg-mainBgHover"
                            onClick={() => handleQuantityCounter('inc')}
                        >
                            +
                        </Button>
                    </span>
                </li>
                <li className="flex justify-between items-center flex-row mb-2">
                    <span className="font-semibold text-gray-900">Total Price</span>
                    <span>Rs. {price}</span>
                </li>
                <li className="flex justify-between items-center flex-col mt-4 w-full">
                    <Button
                        className=" w-full border border-transparent bg-mainBgColor text-white focus:ring-4 focus:ring-red-300 enabled:hover:bg-mainBgHover "
                        onClick={handleClick}
                    >
                        Add to Cart
                    </Button>
                </li>
            </ul>
        </div>
    );
};

export default RollDP;