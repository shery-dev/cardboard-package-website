import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader, TextInput, Label, FileInput, Textarea } from "flowbite-react";
import { useParams } from "next/navigation";
import Swal from "sweetalert2";

const FormPopUp = ({ trigger, handler }) => {
    const { id } = useParams()
    const [formData, setFormData] = useState({
        name: "",
        rate: "",
        description: "",
        description_long: "",
        sku: "",
        price_tiers: "",
        features: "",
        stock: "",
        order: "",
        mainType: id,
        dimensions: {
            length: "",
            width: "",
            depth: ""
        },
        images: []
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleDimensionChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            dimensions: {
                ...prevState.dimensions,
                [id]: value
            }
        }));
    };
    
    const handleImageChange = (e) => {
        const files = e.target.files;
        if (files.length <= 5) {
            setFormData(prevState => ({
                ...prevState,
                images: files
            }));
        } else {
            // Notify the user that only three images can be selected
            Swal.fire({
                title: "Error!",
                text: "You can only select up to five images.",
                icon: "error",
            });
           
            e.target.value = null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("rate", formData.rate);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("description_long", formData.description_long);
            formDataToSend.append("sku", formData.sku);
            formDataToSend.append("price_tiers", formData.price_tiers);
            formDataToSend.append("features", formData.features);
            formDataToSend.append("stock", formData.stock);
            formDataToSend.append("order", formData.order);
            formDataToSend.append("mainType", formData.mainType);
            formDataToSend.append("dimensions", JSON.stringify(formData.dimensions));

            // Append images
            if (formData.images.length > 0) {
                Array.from(formData.images).forEach((image) => {
                    formDataToSend.append("image", image);
                });
            }

            const response = await fetch('/api/v1/addBox', {
                method: 'POST',
                body: formDataToSend
            });

            if (response.ok) {
                Swal.fire({
                    title: "Success!",
                    text: response?.message,
                    icon: "success",
                }).then((result) => {
                    if (result.isConfirmed) {
                        setFormData({
                            name: "",
                            rate: "",
                            description: "",
                            description_long: "",
                            sku: "",
                            price_tiers: "",
                            features: "",
                            stock: "",
                            order: "",
                            mainType: id,
                            dimensions: {
                                length: "",
                                width: "",
                                depth: ""
                            },
                            images: []
                        })
                        handler()
                    }
                });
            } else {
                console.error('Error adding product');

            }
        } catch (error) {
            console.error('Internal Server Error');
        }
    };

    return (
        <div>
            <Modal show={trigger} onClose={handler}>
                <ModalHeader>
                    <h5 className="text-2xl font-medium leading-normal">Add Item</h5>
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <div className=" w-full flex items-center flex-row gap-2">
                            <div className=" w-1/2">
                                <div className="mb-2 block">
                                    <Label htmlFor="name" value="Name" />
                                </div>
                                <TextInput
                                    id="name"
                                    placeholder="Krafted box"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className=" w-1/2">
                                <div className="mb-2 block">
                                    <Label htmlFor="rate" value="Rate" />
                                </div>
                                <TextInput
                                    id="rate"
                                    type="number"
                                    required
                                    value={formData.rate}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="description" value="Description" />
                            </div>
                            <TextInput
                                id="description"
                                placeholder="Short description..."
                                required
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="description_long" value="Long description (optional)" />
                            </div>
                            <Textarea
                                id="description_long"
                                placeholder="Optional longer description..."
                                rows={3}
                                value={formData.description_long}
                                onChange={handleChange}
                            />
                        </div>
                        <div className=" w-full flex items-center flex-row gap-2">
                            <div className="w-1/2">
                                <div className="mb-2 block">
                                    <Label htmlFor="sku" value="SKU (optional)" />
                                </div>
                                <TextInput
                                    id="sku"
                                    placeholder="e.g. BOX-001"
                                    value={formData.sku}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="price_tiers" value="Price tiers (optional JSON, e.g. [{&quot;pcs&quot;:10,&quot;price&quot;:340}])" />
                            </div>
                            <Textarea
                                id="price_tiers"
                                placeholder='[{"pcs":10,"price":340},{"pcs":25,"price":850}]'
                                rows={2}
                                value={formData.price_tiers}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="features" value="Features (optional, one per line)" />
                            </div>
                            <Textarea
                                id="features"
                                placeholder="Feature one&#10;Feature two"
                                rows={3}
                                value={formData.features}
                                onChange={handleChange}
                            />
                        </div>
                        <div className=" w-full flex items-center flex-row gap-2">
                            <div className=" w-1/2">
                                <div className="mb-2 block">
                                    <Label htmlFor="stock" value="Available Stock" />
                                </div>
                                <TextInput
                                    id="stock"
                                    type="number"
                                    required
                                    value={formData.stock}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className=" w-1/2">
                                <div className="mb-2 block">
                                    <Label htmlFor="order" value="Min Order" />
                                </div>
                                <TextInput
                                    id="order"
                                    type="number"
                                    required
                                    value={formData.order}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className=" w-full flex items-center flex-row gap-2">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="length" value="Length" />
                                </div>
                                <TextInput
                                    id="length"
                                    type="number"
                                    required
                                    value={formData.dimensions.length}
                                    onChange={handleDimensionChange}
                                />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="width" value="Width" />
                                </div>
                                <TextInput
                                    id="width"
                                    type="number"
                                    required
                                    value={formData.dimensions.width}
                                    onChange={handleDimensionChange}
                                />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="depth" value="Depth" />
                                </div>
                                <TextInput
                                    id="depth"
                                    type="number"
                                    required
                                    value={formData.dimensions.depth}
                                    onChange={handleDimensionChange}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="file" value="Images (up to 5; stored in public/uploads)" />
                            </div>
                            <FileInput
                                id="file"
                                multiple
                                onChange={handleImageChange}
                            />
                        </div>
                        <Button
                            type="submit"
                            color="success"
                            gradientDuoTone="greenToBlue"
                            block
                            className=" mt-2 float-end"
                        >
                            Add Item
                        </Button>
                    </form>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default FormPopUp;
