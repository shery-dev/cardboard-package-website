import { Button, FileInput, Label, TextInput } from 'flowbite-react'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import Swal from 'sweetalert2';

const AddReelForm = ({ mainType, mainSize, typeName }) => {
    const [vendorName, setVendorName] = useState(""); // State for Vendor Name
    const [weight, setWeight] = useState(""); // State for Weight
    const [rate, setRate] = useState(""); // State for Rate
    const [images, setImages] = useState([]); // State for Images
    const [isLoading, setIsLoading] = useState(false); // Track loading state
    const [error, setError] = useState(null); // Track API error

    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true); // Set loading state to true
        setError(null); // Clear any previous error

        // Your submission logic here
        try {
            // Here you can perform the submission logic using the data stored in the states
            const formData = new FormData();
            formData.append("vendorName", vendorName);
            formData.append("weight", weight);
            formData.append("rate", rate);
            formData.append("mainType", mainType);
            formData.append("size", mainSize);
            formData.append("typeName", typeName);
        
            if (images.length > 0) {
                Array.from(images).forEach((image) => {
                    formData.append("image", image);
                });
            }

            const response = await fetch(`/api/v1/addReel/${mainType}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Submission failed with status ${response.status}`);
            }

            const data = await response.json();
            Swal.fire({
                title: "Success!",
                text: data?.message,
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/admin/reels')
                }
            });

        } catch (error) {
            console.error("Error:", error);
            setError(error.message); // Set error message
        } finally {
            setIsLoading(false); // Set loading state back to false after submission
        }
    };

    const handleImageChange = (e) => {
        const files = e.target.files;
        if (files.length <= 3) {
            setImages(files);
        } else {
            // Notify the user that only three images can be selected
            Swal.fire({
                title: "Error!",
                text: "You can only select up to three images.",
                icon: "error",
            });
            // Clear the file input
            e.target.value = null;
        }
    };

    return (
        <form className="w-full flex flex-col gap-4">
            <div className="flex justify-between items-center flex-row gap-2">
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="vendorName">Vendor Name</Label>
                    </div>
                    <TextInput
                        id="vendorName"
                        type="text"
                        value={vendorName}
                        onChange={(e) => setVendorName(e.target.value)}
                        required
                        disabled={mainType ==="" || mainSize === ""}
                    />
                </div>
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="weight">Weight</Label>
                    </div>
                    <TextInput
                        id="weight"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                        disabled={mainType ==="" || mainSize === ""}
                    />
                </div>
            </div>
            <div className="flex justify-between items-center flex-row gap-2">
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="rate">Rate</Label>
                    </div>
                    <TextInput
                        id="rate"
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        required
                        disabled={mainType ==="" || mainSize === ""}
                    />
                </div>
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="images">Upload Images (Only 3)</Label>
                    </div>
                    <FileInput
                        id="images"
                        multiple
                        onChange={handleImageChange}
                        required
                        disabled={mainType ==="" || mainSize === ""}
                    />
                </div>
            </div>
            <Button
                gradientDuoTone="greenToBlue"
                onClick={handleSubmit}
                disabled={ vendorName === "" || rate === "" || weight === "" || images.length === 0 || isLoading}
            >
                {
                    isLoading ? "Adding" : "Add"
                }
            </Button>
        </form>
    )
}

export default AddReelForm