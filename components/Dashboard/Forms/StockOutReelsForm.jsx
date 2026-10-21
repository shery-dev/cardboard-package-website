"use client";
import React, { useEffect, useState } from "react";
import { Button, FileInput, Label, Select, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import VendorDetailsWeight from "../Tables/VendorDetailsWeight";

export default function StockOutReelsForm() {
    const [reels, setReels] = useState([]);
    const [mainType, setMainType] = useState("");
    const [typeName, setTypeName] = useState("");
    const [sizes, setSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState("");
    const [vendors, setVendors] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Track loading state
    const [error, setError] = useState(null); // Track API error

    const router = useRouter();

    // useEffect for fetching reels
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Set loading state to true
            setError(null); // Clear any previous error

            try {
                const response = await fetch(`/api/v1/getReels`);
                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                const data = await response.json();
                setReels(data?.data)
            } catch (error) {
                console.error("Error:", error);
                setError(error.message); // Set error message
            } finally {
                setIsLoading(false); // Set loading state back to false after API call
            }
        };
        fetchData();
    }, []);

    // useEffect for updating sizes when mainType changes
    useEffect(() => {
        if (mainType !== "" && mainType !== undefined) {
            const selectedReel = reels?.filter((reel) => reel._id === mainType)
            setTypeName(selectedReel[0].Type)
            setSizes(selectedReel[0].Sizes)
        } else {
            setTypeName("")
            setSelectedSize("")
        }
    }, [mainType])

    useEffect(() => {
        if (selectedSize !== "" && selectedSize !== undefined) {
            const sizeObj = sizes?.filter((size) => size.Size === parseInt(selectedSize))
            setVendors(sizeObj[0].Weight)
        } else {
            setVendors([])
        }
    }, [selectedSize])

    return (
        <form className="w-full flex flex-col gap-4">
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
                                isLoading ? "Fetching..." : "Select reel type"
                            }
                        </option>
                        {
                            reels?.map((reel) => (
                                <option
                                    key={reel?._id}
                                    value={reel?._id}
                                >
                                    {reel?.Type}
                                </option>
                            ))
                        }
                    </Select>
                </div>
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="size">Size</Label>
                    </div>
                    <Select
                        id="size"
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        disabled={(mainType === "")}
                    >
                        <option value={""}>Select a size</option>
                        {
                            sizes?.map((size) => (
                                <option
                                    key={size?._id}
                                    value={size?.Size}
                                >
                                    {size?.Size}
                                </option>
                            ))
                        }
                    </Select>
                </div>
            </div>
            <div className=" w-full">
                <h2 className=' text-2xl pb-2 font-medium text-gray-800 bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-[length:6%_4px] bg-no-repeat bg-left-bottom'>
                    Vendors Details
                </h2>
            </div>
            <VendorDetailsWeight
                vendors={vendors}
                typeId={mainType}
                typeName={typeName}
                mainSize={selectedSize}
            />
        </form>
    );
}
