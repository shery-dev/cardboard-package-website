"use client";

import React, { useEffect, useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";

export default function RollUpdateForm() {
    const [rollType, setRollType] = useState("");
    const [rate, setRate] = useState("");
    const [size, setSize] = useState("");
    const [quantity, setQuantity] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Track loading state
    const [error, setError] = useState(null); // Track API error

    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams()

    const { id } = params;
    const selectedSize = searchParams.get('selectedSize')
    const thickness = searchParams.get('thickness')


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `/api/v1/getRollById/${id}`
                );

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                const data = await response.json();
                const rollData = data?.data;

                setRollType(rollData?.Type); // Assuming "cardboardname" stores product name
                setRate(rollData?.Rate);
                setSize(selectedSize)
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

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `/api/v1/get-roll-by-id-size/${id}/${thickness}/${selectedSize}`
                );

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                const data = await response.json();
                setQuantity(data?.data?.Quantity)

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/api/v1/update-roll-by-id-put/${id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        selectedSize,
                        thickness,
                        rate,
                        quantity,
                    }),
                }
            );

            if (!response.ok) {
                console.log("Response not OK!")
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            Swal.fire({
                title: "Success!",
                text: data?.message,
                icon: "success",
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push(`/admin/rolls`);
                }
            });
        } catch (error) {
            console.error("Error:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="w-full flex flex-col gap-4">
            <div className="flex justify-between items-center flex-row gap-2">
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="rollType" value="Roll Type" />
                    </div>
                    <TextInput
                        id="rollType"
                        type="text" // Changed to text for product name
                        required
                        value={rollType}
                        onChange={(e) => setRollType(e.target.value)}
                        disabled
                    />
                </div>
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="rate" value="Rate (Rs.)" />
                    </div>
                    <TextInput
                        id="rate"
                        type="number"
                        required
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex justify-between items-center flex-row gap-2">
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
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="quantity" value="Quantity (In Stock)" />
                    </div>
                    <TextInput
                        id="quantity"
                        type="number"
                        required
                        value={quantity}
                        onChange={(e) =>
                            setQuantity(e.target.value)
                        }
                        disabled
                    />
                </div>
            </div>
            <Button
                gradientDuoTone="greenToBlue"
                disabled={isLoading}
                onClick={handleSubmit}
            >
                {isLoading ? "Updating..." : "Update"}
            </Button>
        </form>
    );
}
