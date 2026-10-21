"use client";

import React, { useEffect, useState } from "react";
import { Button, Label, TextInput, Select } from "flowbite-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import VendorDetailsTable from "../Tables/VendorDetailsTable";

export default function ReelUpdateForm() {
    const [reelType, setReelType] = useState("");
    const [size, setSize] = useState("");
    const [item, setItem] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Track loading state
    const [error, setError] = useState(null); // Track API error

    const params = useParams();
    const searchParams = useSearchParams()

    const { id } = params;
    const selectedSize = searchParams.get('selectedSize')



    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `/api/v1/getReelByIdSize/${id}/${selectedSize}`
                );

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                const data = await response.json();
                const reelData = data?.data[0];
                setReelType(reelData?.Type); // Assuming "cardboardname" stores product name
                setSize(selectedSize)
                const wetObj = reelData.Sizes.find((Size) => Size.size == selectedSize.size)
                const weights = wetObj.Weight;
                const weightTypes = weights.map(item => item.weight_type);
                const uniqueWeightTypes = [...new Set(weightTypes)];
                setItem(uniqueWeightTypes)

            } catch (error) {
                console.error("Error:", error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const getVendors = async (weight) => {
        if (weight) {
            try {
                const response = await fetch(
                    `/api/v1/getVendorsByWeight/${id}/${selectedSize}/${weight}`
                );

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                const data = await response.json();
                const vendorsData = data?.weights;
                setVendors(vendorsData)
            } catch (error) {
                console.error("Error:", error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        } else {
            setVendors([])
        }
    };

    return (
        <form className="w-full flex flex-col gap-4 py-8">
            <div className="flex justify-between items-center flex-row gap-2">
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="reelType" value="Reel Type" />
                    </div>
                    <TextInput
                        id="reelType"
                        type="text" // Changed to text for product name
                        required
                        value={reelType}
                        onChange={(e) => setReelType(e.target.value)}
                        disabled
                    />
                </div>
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="size" value="Size" />
                    </div>
                    <TextInput
                        id="size"
                        type="number"
                        required
                        value={size}
                        onChange={(e) =>
                            setSize(e.target.value)
                        }
                        disabled
                    />
                </div>
            </div>
            <div className="flex justify-between items-center flex-row gap-2">
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="weights" value="Weight" />
                    </div>
                    <div className="w-full">
                        <Select
                            onChange={(e) => getVendors(e.target.value)}
                            required
                        >
                            <option value="">Select a Weight</option>
                            {item?.map((weight, index) => (
                                <option key={index} value={weight}>
                                    {weight}
                                </option>
                            ))}
                        </Select>
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center flex-col gap-2 mt-12">
                <div className=" w-full">
                    <h2 className=' text-2xl pb-2 font-medium text-gray-800 bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-[length:6%_4px] bg-no-repeat bg-left-bottom'>
                        Vendor Details
                    </h2>
                </div>
                <div className="w-full">
                    <VendorDetailsTable
                        vendors={vendors}
                        mainId={id}
                        mainSize={selectedSize}
                    />
                </div>
            </div>
        </form>
    );
}
