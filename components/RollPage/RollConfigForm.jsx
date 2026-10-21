"use client";

import { Card, Button, Radio, Label } from 'flowbite-react';
import Link from 'next/link';
import { getRollData } from '@/app/(home)/rolls/page';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/Context';

const RollConfigForm = () => {
    const [data, setData] = useState(null)
    const [selectedRoll, setSelectedRoll] = useState({})
    const [rollType, setRollType] = useState("thick");
    const [sizes, setSizes] = useState([])
    const [selectedSize, setSelectedSize] = useState(0)
    const [quantity, setQuantity] = useState(500);
    const [price, setPrice] = useState(0)
    const [pricePerPiece, setPricePerPiece] = useState(0)

    const { setItemsList } = useAppContext();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getRollData()
            setData(data.data);
        }
        fetchData()
    }, [])

    useEffect(() => {
        setSizes([])
        setSelectedSize('0')
        if (selectedRoll.Sizes) {
            setSizes(selectedRoll.Sizes[rollType])
        }
    }, [selectedRoll, rollType])

    useEffect(() => {
        if (selectedRoll.Rate && parseInt(selectedSize) > 0) {
            const pricePP = selectedRoll.Rate * selectedSize;
            if (pricePP) {
                setPricePerPiece(pricePP)
                setPrice(pricePP * quantity)
            }
        } else {
            setPricePerPiece(0)
            setPrice(0)
        }

    }, [selectedRoll, rollType, selectedSize, quantity])

    const handleClick = () => {
        if (price) {
            const item = {
                id: selectedRoll?._id,
                ThreeD: false,
                name: selectedRoll?.Type,
                img: selectedRoll?.images[0],
                quantity: quantity,
                pricePerPiece: pricePerPiece,
                price: price,
                thickness: 3,
            };
            setItemsList((prev) => [...prev, item])
            window.scroll(0, 0);
            setSelectedRoll({})
            setSizes([])
            setSelectedSize(0)
            setQuantity(500)
            setPrice(0)
            setPricePerPiece(0)
        }
    };

    return (
        <>
            <Card className=" w-full">
                <div className="mb-2 flex items-center justify-between gap-2">
                    <h5 className="text-xl font-bold leading-none text-gray-800">Configure & Price</h5>
                    <Link href="#" className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                        Share
                    </Link>
                </div>
                <hr class="h-px bg-gray-300 border-0"></hr>
                <form className="flex flex-col gap-4">
                    <div className=" flex justify-between items-center flex-row">
                        <label htmlFor="rollProduct" className=" w-1/4 text-headingTxtColor">Product:</label>
                        <select
                            id="rollProduct"
                            className=" w-3/4 block py-2.5 px-0 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                            onChange={(e) => {
                                if (e.target.value) {
                                    setSelectedRoll(JSON.parse(e.target.value))
                                } else {
                                    setSelectedRoll({})
                                }
                            }}
                        >
                            <option value="">Choose a product</option>
                            {
                                data?.map((roll) => (
                                    <option
                                        key={roll._id}
                                        value={JSON.stringify(roll)}
                                    >
                                        {roll.Type}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div className=" flex justify-start items-center flex-row">
                        <label htmlFor="underline_select" className=" w-1/4 text-headingTxtColor">Type:</label>
                        <span className=" flex justify-start items-center flex-row gap-4 border-0 border-b-2 border-gray-200 w-3/4 py-2">
                            <div className="flex items-center gap-2">
                                <Radio
                                    id="thick"
                                    name="rollType"
                                    value="thick"
                                    className="h-4 w-4 border border-gray-300 text-mainBgColor focus:ring-2 focus:ring-mainBgColor "
                                    onClick={() => setRollType("thick")}
                                    defaultChecked
                                    disabled={!selectedRoll.Type}
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
                                    disabled={!selectedRoll.Type}
                                />
                                <Label htmlFor="thin">Thin</Label>
                            </div>
                        </span>
                    </div>
                    <div className=" flex justify-between items-center flex-row">
                        <label htmlFor="rollSizes" className=" w-1/4 text-headingTxtColor">Size:</label>
                        <select
                            id="rollSizes"
                            className=" w-3/4 block py-2.5 px-0 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                            onChange={(e) => {
                                if (e.target.value) {
                                    setSelectedSize(e.target.value)
                                } else {
                                    setSelectedSize({})
                                }
                            }}
                            value={selectedSize}
                            disabled={!selectedRoll.Type}
                        >
                            <option value={0}>Choose a size</option>
                            {
                                sizes?.map((size) => (
                                    <option
                                        key={size._id}
                                        value={size.Size}
                                    >
                                        {size.Size}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div className=" flex justify-between items-center flex-row">
                        <label htmlFor="rollQuantity" className="w-1/4 text-headingTxtColor">Quantity:</label>
                        <input
                            type='number'
                            id="rollQuantity"
                            className=" w-3/4 block py-2.5 px-0 text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                            min={500}
                            step={500}
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            onKeyDown={(e) => e.preventDefault()}
                            onWheel={(e) => e.preventDefault()}
                        />
                    </div>
                    <div className=" flex justify-center items-center flex-row gap-4">
                        <label htmlFor="underline_select" className=" text-mainBgColor text-3xl font-bold">
                            Rs. {price ? price : 0}
                        </label>
                        <span
                            id="underline_select"
                            className=" text-gray-600 text-sm"
                        >
                            = (Rs. {pricePerPiece ? pricePerPiece : 0} each X {quantity})
                        </span>
                    </div>
                    <Button
                        gradientDuoTone="pinkToOrange"
                        disabled={price ? false : true}
                        onClick={(e) => {
                            e.preventDefault()
                            handleClick()
                        }}
                    >
                        Add to Cart
                    </Button>
                </form>
            </Card>
        </>
    )
}

export default RollConfigForm