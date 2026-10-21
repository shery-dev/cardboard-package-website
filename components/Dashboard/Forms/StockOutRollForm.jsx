"use client";

import React, { useEffect, useState } from "react";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function StockOutRollForm() {
    const [rolls, setRolls] = useState([]);
    const [mainType, setMainType] = useState("");
    const [thickness, setThickness] = useState("");
    const [sizes, setSizes] = useState([]);
    const [selectedSizeId, setSelectedSizeId] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedRollName, setSelectedRollName] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [isLoading, setIsLoading] = useState(false); // Track loading state
    const [error, setError] = useState(null); // Track API error

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Set loading state to true
            setError(null); // Clear any previous error

            try {
                const response = await fetch(`/api/v1/getRolls`);
                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                const data = await response.json();
                setRolls(data?.data)
            } catch (error) {
                console.error("Error:", error);
                setError(error.message); // Set error message
            } finally {
                setIsLoading(false); // Set loading state back to false after API call
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true); // Set loading state to true
        setError(null); // Clear any previous error

        try {
            const formData = new FormData();
            formData.append('Quantity', quantity);
            formData.append('operation', "decrement");
            formData.append('size', selectedSize);
            formData.append('mainType', selectedRollName);
            const response = await fetch(`/api/v1/updateRollQuantity/${mainType}/${selectedSizeId}`, {
                method: "PUT",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            Swal.fire({
                title: "Success!",
                text: data?.message,
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/admin/rolls')
                }
            })
        } catch (error) {
            console.error("Error:", error);
            setError(error.message); // Set error message
        } finally {
            setIsLoading(false); // Set loading state back to false after API call
        }
    };

    useEffect(() => {

        if (mainType !== "" && mainType !== undefined && thickness !== "" && thickness !== undefined) {
            const selectedRoll = rolls?.filter((roll) => roll._id === mainType)
            setSelectedRollName(selectedRoll[0]?.Type)
            setSizes(selectedRoll[0].Sizes[thickness])
        }
    }, [mainType, thickness])

    useEffect(() => {
        const selectedSizeObj = sizes?.filter((size) => size._id === selectedSizeId)
        setSelectedSize(selectedSizeObj[0]?.Size)
    }, [selectedSizeId])
    
    return (
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex justify-between items-center flex-row gap-2">
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="mainType">Type Name</Label>
                    </div>
                    <Select
                        id="mainType"
                        onChange={(e) => setMainType(e.target.value)}
                        disabled={isLoading}
                    >
                        <option value={""}>
                            {
                                isLoading ? "Fetching..." : "Select roll type"
                            }
                        </option>
                        {
                            rolls?.map((roll) => (
                                <option
                                    key={roll?._id}
                                    value={roll?._id}
                                >
                                    {roll?.Type}
                                </option>
                            ))
                        }
                    </Select>
                </div>
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="thickness">Roll Type</Label>
                    </div>
                    <Select
                        id="thickness"
                        value={thickness}
                        onChange={(e) => setThickness(e.target.value)}
                        disabled={mainType === ""}
                    >
                        <option value="">Select thickness</option>
                        <option value="thick">Thick</option>
                        <option value="thin">Thin</option>
                    </Select>
                </div>
            </div>
            <div className="flex justify-between items-center flex-row gap-2">
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="size">Size</Label>
                    </div>
                    <Select
                        id="size"
                        value={selectedSizeId}
                        onChange={(e) => setSelectedSizeId(e.target.value)}
                        disabled={(mainType === "") || (thickness === "")}
                    >
                        <option value={""}>Select a size</option>
                        {
                            sizes?.map((size) => (
                                <option
                                    key={size?._id}
                                    value={size?._id}
                                >
                                    {size?.Size}
                                </option>
                            ))
                        }
                    </Select>
                </div>
            </div>
            <div className="flex justify-between items-center flex-col gap-2">
                <div className=" w-full">
                    <h2 className=' text-2xl pb-2 font-medium text-gray-800 bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-[length:6%_4px] bg-no-repeat bg-left-bottom'>
                        Deduct Stock
                    </h2>
                </div>
                <div className="w-full">
                    <div className="mb-2 block">
                        <Label htmlFor="quantity">Quantity</Label>
                    </div>
                    <TextInput
                        id="quantity"
                        type="number"
                        required
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        disabled={(mainType === "") || (thickness === "") || (selectedSizeId === "")}
                    />
                </div>
            </div>
            <Button
                gradientDuoTone="greenToBlue"
                onClick={handleSubmit}
                disabled={(mainType === "") || (thickness === "") || (selectedSizeId === "") || (quantity <= 0)}
            >
                {quantity <= 0 ? "Invalid quantity..." : "Add"}
            </Button>
        </form>
    );
}