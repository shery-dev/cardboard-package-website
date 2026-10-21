"use client";

import React, { useEffect, useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function CostForm() {
    const [labourCost, setLabourCost] = useState("");
    const [rentPrice, setRentPrice] = useState("");
    const [printedSidesCost, setPrintedSidesCost] = useState("");
    const [imagePrintedSidesCost, setImagePrintedSidesCost] = useState("");
    const [isLoading, setIsLoading] = useState(false); // Track loading state
    const [error, setError] = useState(null); // Track API error

    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true); // Set loading state to true
          setError(null); // Clear any previous error
    
          try {
            const { id } = params;
            const response = await fetch(`/api/v1/getCostById/${id}`);
    
            if (!response.ok) {
              throw new Error(`API request failed with status ${response.status}`);
            }
    
            const data = await response.json();
            setLabourCost(data?.labor);
            setRentPrice(data?.rent);
            setPrintedSidesCost(data?.printedSides);
            setImagePrintedSidesCost(data?.imagePrintedSide);
          } catch (error) {
            console.error("Error:", error);
            setError(error.message); // Set error message
          } finally {
            setIsLoading(false); // Set loading state back to false after API call
          }
        };
    
        if (params.id) { // Check if ID exists in params
          fetchData();
        }
      }, [params.id]);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true); // Set loading state to true
        setError(null); // Clear any previous error

        try {
            const { id } = params;
            const response = await fetch(`/api/v1/update-costs/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    labour: labourCost,
                    rent: rentPrice,
                    psCost: printedSidesCost,
                    ipsCost: imagePrintedSidesCost,
                }),
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
                    router.push('/admin')
                }
            })
        } catch (error) {
            console.error("Error:", error);
            setError(error.message); // Set error message
        } finally {
            setIsLoading(false); // Set loading state back to false after API call
        }
    };


    return (
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex justify-between items-center flex-row gap-2">
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="labour" value="Labour Cost (Rs.)" />
                    </div>
                    <TextInput
                        id="labour"
                        type="number"
                        required
                        value={labourCost}
                        onChange={(e) => setLabourCost(e.target.value)}
                    />
                </div>
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="rent" value="Rent Price (Rs.)" />
                    </div>
                    <TextInput
                        id="rent"
                        type="number"
                        required
                        value={rentPrice}
                        onChange={(e) => setRentPrice(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex justify-between items-center flex-row gap-2">
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="printedSides" value="Printed Sides Cost (Rs.)" />
                    </div>
                    <TextInput
                        id="printedSides"
                        type="number"
                        required
                        value={printedSidesCost}
                        onChange={(e) => setPrintedSidesCost(e.target.value)}
                    />
                </div>
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="imagePrintedSides" value="Image Printed Sides Cost (Rs.)" />
                    </div>
                    <TextInput
                        id="imagePrintedSides"
                        type="number"
                        required
                        value={imagePrintedSidesCost}
                        onChange={(e) => setImagePrintedSidesCost(e.target.value)}
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