"use client";

import React, { useEffect, useState } from "react";
import { Button, Label, TextInput, Textarea } from "flowbite-react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function ProductForm() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [descriptionLong, setDescriptionLong] = useState("");
    const [sku, setSku] = useState("");
    const [priceTiersText, setPriceTiersText] = useState("");
    const [featuresText, setFeaturesText] = useState("");
    const [rate, setRate] = useState("");
    const [mainType, setMainType] = useState("");
    const [dimensions, setDimensions] = useState({
        length: "",
        width: "",
        depth: "",
    });
    const [quantity, setQuantity] = useState("");
    const [existingImages, setExistingImages] = useState([]); // paths from API
    const [images, setImages] = useState([]); // new files
    const [previews, setPreviews] = useState([]); // display URLs
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const params = useParams();
    const router = useRouter();

    const { id } = params;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `/api/v1/getSingleProductById/${id}`
                );

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                const data = await response.json();
                const productData = data?.data[0];

                setName(productData.cardboardname || "");
                setDescription(productData.description || "");
                setDescriptionLong(productData.description_long || "");
                setSku(productData.sku || "");
                setPriceTiersText(
                  productData.price_tiers && Array.isArray(productData.price_tiers)
                    ? JSON.stringify(productData.price_tiers, null, 2)
                    : ""
                );
                setFeaturesText(
                  Array.isArray(productData.features)
                    ? productData.features.join("\n")
                    : (productData.features || "")
                );
                setRate(productData.rate);
                setDimensions({
                    length: productData.dimensions?.length ?? "",
                    width: productData.dimensions?.width ?? "",
                    depth: productData.dimensions?.depth ?? "",
                });
                setQuantity(productData.quantity ?? "");
                setMainType(productData.mainType);
                const imgs = productData.images || [];
                setExistingImages(imgs);
                setPreviews(
                  imgs.map((p) =>
                    p?.startsWith("/") ? p : `/api/v1/fetchImg/${p ?? ""}`
                  )
                );
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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        setImages(files);
        const existingUrls = existingImages.map((p) =>
            p?.startsWith("/") ? p : `/api/v1/fetchImg/${p ?? ""}`
        );
        const newUrls = files.map((f) => URL.createObjectURL(f));
        setPreviews([...existingUrls, ...newUrls]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        setIsLoading(true);
        setError(null);
    
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("description_long", descriptionLong);
        formData.append("rate", rate);
        formData.append("dimensions", JSON.stringify(dimensions));
        formData.append("quantity", quantity);
        formData.append("existingImages", JSON.stringify(existingImages));
        formData.append("sku", sku);
        formData.append("price_tiers", priceTiersText);
        formData.append("features", featuresText);
        images.forEach((image) => {
            formData.append("images", image);
        });
    
        try {
            const response = await fetch(
                `/api/v1/updateCardboardProduct/${id}`,
                {
                    method: "PUT",
                    body: formData,
                }
            );
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `API request failed with status ${response.status}`);
            }
    
            const data = await response.json();
            Swal.fire({
                title: "Success!",
                text: data?.message,
                icon: "success",
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push(`/admin/products/list/${mainType}`);
                }
            });
        } catch (error) {
            console.error("Error:", error);
            setError(error.message);
            Swal.fire({
                title: "Error!",
                text: error.message || "Failed to update product",
                icon: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <form className="w-full flex flex-col gap-4">
            <div className="flex justify-between items-center flex-row gap-2">
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="name" value="Product Name" />
                    </div>
                    <TextInput
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
            <div className="w-full">
                <div className="mb-2 block">
                    <Label htmlFor="description" value="Description" />
                </div>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                />
            </div>
            <div className="w-full">
                <div className="mb-2 block">
                    <Label htmlFor="description_long" value="Long description (optional)" />
                </div>
                <Textarea
                    id="description_long"
                    value={descriptionLong}
                    onChange={(e) => setDescriptionLong(e.target.value)}
                    rows={4}
                />
            </div>
            <div className="w-full">
                <div className="mb-2 block">
                    <Label htmlFor="sku" value="SKU (optional)" />
                </div>
                <TextInput
                    id="sku"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. BOX-001"
                />
            </div>
            <div className="w-full">
                <div className="mb-2 block">
                    <Label htmlFor="price_tiers" value="Price tiers (optional JSON)" />
                </div>
                <Textarea
                    id="price_tiers"
                    value={priceTiersText}
                    onChange={(e) => setPriceTiersText(e.target.value)}
                    rows={3}
                    placeholder='[{"pcs":10,"price":340}]'
                />
            </div>
            <div className="w-full">
                <div className="mb-2 block">
                    <Label htmlFor="features" value="Features (one per line)" />
                </div>
                <Textarea
                    id="features"
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    rows={3}
                    placeholder="Feature one per line"
                />
            </div>
            <div className="flex justify-between items-center flex-row gap-2">
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="length" value="Length (Inches)" />
                    </div>
                    <TextInput
                        id="length"
                        type="number"
                        required
                        value={dimensions.length}
                        onChange={(e) =>
                            setDimensions({ ...dimensions, length: e.target.value })
                        }
                    />
                </div>
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="width" value="Width (Inches)" />
                    </div>
                    <TextInput
                        id="width"
                        type="number"
                        required
                        value={dimensions.width}
                        onChange={(e) =>
                            setDimensions({ ...dimensions, width: e.target.value })
                        }
                    />
                </div>
            </div>
            <div className="flex justify-between items-center flex-row gap-2">
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="depth" value="Depth (Inches)" />
                    </div>
                    <TextInput
                        id="depth"
                        type="number"
                        required
                        value={dimensions.depth}
                        onChange={(e) =>
                            setDimensions({ ...dimensions, depth: e.target.value })
                        }
                    />
                </div>
                <div className="w-1/2">
                    <div className="mb-2 block">
                        <Label htmlFor="quantity" value="Quantity" />
                    </div>
                    <TextInput
                        id="quantity"
                        type="number"
                        required
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </div>
            </div>
            <div className="w-full">
                <div className="mb-2 block">
                    <Label htmlFor="images" value="Product Images (existing are kept; add more to append)" />
                </div>
                <input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                />
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previews.map((preview, index) => (
                        <img
                            key={index}
                            src={preview}
                            alt={`Image Preview ${index + 1}`}
                            className="w-full h-auto"
                            style={{ maxHeight: "150px" }} // Adjust the preview size
                        />
                    ))}
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
