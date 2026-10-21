"use client";

import React, { useEffect, useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function MaterialForm() {
    const [materialName, setMaterialName] = useState("");
    const [paperRate, setPaperRate] = useState("");
    const [rollRate, setRollRate] = useState("");
    const [gamrige, setGamrige] = useState("");
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
                const response = await fetch(`/api/v1/getMaterialById/${id}`);

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                const data = await response.json();
                setMaterialName(data.materailName);
                setPaperRate(data.paperRate);
                setRollRate(data.rollRate);
                setGamrige(data.gamrige);
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
    }, [params.id]); // Re-run effect on ID change

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true); // Set loading state to true
        setError(null); // Clear any previous error

        try {
            const { id } = params;
            const response = await fetch(`/api/v1/update-materials/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    materialName,
                    paperRate,
                    rollRate,
                    gamrige,
                }),
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            Swal.fire({
                title: "Success!",
                text: data?.message,
                icon: "success",
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push("/admin");
                }
            });
        } catch (error) {
            console.error("Error:", error);
            setError(error.message); // Set error message
        } finally {
            setIsLoading(false); // Set loading state back to false after API call
        }
    };

    return (
        <form className="w-full flex flex-col gap-4">
            <div className="flex justify-between items-center flex-row gap-2">
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="materialName" value="Material Name" />
                    </div>
                    <TextInput
                        id="materialName"
                        type="text"
                        required
                        value={materialName}
                        onChange={(e) => setMaterialName(e.target.value)}
                    />
                </div>
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="paperRate" value="Paper Rate (Rs.)" />
                    </div>
                    <TextInput
                        id="paperRate"
                        type="number"
                        required
                        value={paperRate}
                        onChange={(e) => setPaperRate(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex justify-between items-center flex-row gap-2">
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="rollRate" value="Roll Rate (Rs.)" />
                    </div>
                    <TextInput
                        id="rollRate"
                        type="number"
                        required
                        value={rollRate}
                        onChange={(e) => setRollRate(e.target.value)}
                    />
                </div>
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="gamrige" value="Gamrige (Rs.)" />
                    </div>
                    <TextInput
                        id="gamrige"
                        type="number"
                        required
                        value={gamrige}
                        onChange={(e) => setGamrige(e.target.value)}
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
