"use client";

import { Button, FileInput, Label, Modal, TextInput, Textarea } from "flowbite-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export function EditBoxModel({ openModalVal, closeModelHandler, refreshHandler, editProduct }) {
    const [typeName, setTypeName] = useState('');
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [heading, setHeading] = useState('');
    const [descriptionLong, setDescriptionLong] = useState('');
    const [featuresText, setFeaturesText] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editProduct?._id) {
            setTypeName(editProduct.cardboardname || '');
            setDescription(editProduct.description || '');
            setHeading(editProduct.heading || '');
            setDescriptionLong(editProduct.description_long || '');
            setFeaturesText(Array.isArray(editProduct.features) ? editProduct.features.join('\n') : '');
            fetch(`/api/v1/categories/${editProduct._id}`)
                .then((r) => r.json())
                .then(({ data }) => {
                    if (data) {
                        setHeading(data.heading || '');
                        setDescriptionLong(data.description_long || '');
                        setFeaturesText(Array.isArray(data.features) ? data.features.join('\n') : '');
                    }
                })
                .catch(() => {});
        }
    }, [editProduct]);

    const handleTypeNameChange = (e) => {
        setTypeName(e.target.value);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleUpdateType = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('typeName', typeName);
        if (image) {
            formData.append('image', image);
        }
        formData.append('description', description);
        formData.append('heading', heading);
        formData.append('description_long', descriptionLong);
        formData.append('features', featuresText);

        const response = await fetch(`/api/v1/updateMainType/${editProduct._id}`, {
            method: 'PUT',
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
                closeModelHandler();
                refreshHandler();
                setLoading(false);
            }
        });
    };

    return (
        <>
            <Modal show={openModalVal} size="md" onClose={closeModelHandler} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                            Edit Main Type
                        </h3>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="name" value="Type Name" />
                            </div>
                            <TextInput
                                id="name"
                                placeholder="Enter type name..."
                                required
                                value={typeName}
                                onChange={handleTypeNameChange}
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="image" value="Change Image" />
                            </div>
                            <FileInput
                                id="image"
                                onChange={handleImageChange}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                If you don&apos; want to change the image, leave this field empty.
                            </p>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="heading" value="Heading (optional)" />
                            </div>
                            <TextInput
                                id="heading"
                                placeholder="Optional heading..."
                                value={heading}
                                onChange={(e) => setHeading(e.target.value)}
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="description" value="Description" />
                            </div>
                            <Textarea
                                id="description"
                                placeholder="Enter item descriptions..."
                                required
                                rows={4}
                                value={description}
                                onChange={handleDescriptionChange}
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
                                value={descriptionLong}
                                onChange={(e) => setDescriptionLong(e.target.value)}
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="features" value="Features (one per line)" />
                            </div>
                            <Textarea
                                id="features"
                                placeholder="One feature per line..."
                                rows={3}
                                value={featuresText}
                                onChange={(e) => setFeaturesText(e.target.value)}
                            />
                        </div>
                        <div className="w-full">
                            <Button
                                className="w-full"
                                onClick={handleUpdateType}
                                disabled={typeName === "" || description === "" || loading === true}
                            >
                                {
                                    loading ?
                                        "Updating..." :
                                        "Update Type"
                                }
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
