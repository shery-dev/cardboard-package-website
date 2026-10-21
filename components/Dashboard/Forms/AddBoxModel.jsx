"use client";

import { Button, FileInput, Label, Modal, Select, TextInput, Textarea } from "flowbite-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export function AddBoxModel({ openModalVal, closeModelHandler, refreshHandler }) {
    const [typeName, setTypeName] = useState('');
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState('');
    const [parentId, setParentId] = useState('');
    const [parentCategories, setParentCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (openModalVal) {
            fetch("/api/v1/cardboard-types")
                .then((r) => r.json())
                .then(({ data }) => {
                    const tops = (data || []).filter((c) => !c.parent_id);
                    setParentCategories(tops);
                })
                .catch(() => setParentCategories([]));
        }
    }, [openModalVal]);

    const handleTypeNameChange = (e) => {
        setTypeName(e.target.value);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleAddType = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('typeName', typeName);
            formData.append('image', image);
            formData.append('description', description);
            if (parentId) formData.append('parentId', parentId);

            const response = await fetch('/api/v1/addMainType', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                Swal.fire({ title: "Error", text: data?.message || `Submission failed (${response.status})`, icon: "error" });
                setLoading(false);
                return;
            }
            Swal.fire({
                title: "Success!",
                text: data?.message,
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed) {
                    setTypeName('');
                    setImage(null);
                    setDescription('');
                    setParentId('');
                    closeModelHandler();
                    refreshHandler();
                }
                setLoading(false);
            });
        } catch (err) {
            Swal.fire({ title: "Error", text: err?.message || "Something went wrong.", icon: "error" });
            setLoading(false);
        }
    };

    return (
        <>
            <Modal show={openModalVal} size="md" onClose={closeModelHandler} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                            Add Main Types
                        </h3>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="parent" value="Parent Category (optional)" />
                            </div>
                            <Select
                                id="parent"
                                value={parentId}
                                onChange={(e) => setParentId(e.target.value)}
                            >
                                <option value="">— Top-level category —</option>
                                {parentCategories.map((c) => (
                                    <option key={c._id} value={c._id}>{c.cardboardname}</option>
                                ))}
                            </Select>
                        </div>
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
                                <Label htmlFor="image" value="Image" />
                            </div>
                            <FileInput
                                id="image"
                                onChange={handleImageChange}
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
                        <div className="w-full">
                            <Button
                                className="w-full"
                                onClick={handleAddType}
                                disabled={typeName === "" || image === null || description === "" || loading === true}
                            >
                                {
                                    loading ? 
                                    "Adding..." : 
                                    "Add Type"
                                }
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
