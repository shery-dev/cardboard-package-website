"use client";

import { useEffect, useState, useMemo, useRef } from 'react';
import Swal from 'sweetalert2';
import { Button, Tooltip } from 'flowbite-react';
import Image from 'next/image';
import Link from 'next/link';
import { MdOutlinePostAdd, MdDelete, MdEditDocument, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { HiViewList } from 'react-icons/hi';
import { AddBoxModel } from '../Forms/AddBoxModel';
import { EditBoxModel } from '../Forms/EditBoxModel';

async function getMainProducts() {
    try {
        const res = await fetch("/api/v1/cardboard-types", {
            method: "GET",
            cache: 'no-store',
            tags: ['mainTypes']
        });
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        return null;
    }
}

function getCategoryImgSrc(imgValue) {
    const first = Array.isArray(imgValue) ? imgValue[0] : imgValue;
    if (!first || typeof first !== "string") return "/img/logo.svg";
    const trimmed = first.trim();
    if (!trimmed) return "/img/logo.svg";
    if (trimmed.startsWith("/")) return trimmed;
    return `/api/v1/fetchImg/${encodeURIComponent(trimmed)}`;
}

function CategoryImage({ img }) {
    const [src, setSrc] = useState(() => getCategoryImgSrc(img));
    useEffect(() => {
        setSrc(getCategoryImgSrc(img));
    }, [img]);
    return (
        <Image
            height={40}
            width={40}
            alt=""
            src={src}
            className="rounded-full"
            onError={() => setSrc("/img/logo.svg")}
        />
    );
}

function CategoryRow({ item, isSubcategory, onEdit, onDelete }) {
    return (
        <div className={`flex items-center space-x-4 py-3 sm:py-4 ${isSubcategory ? "pl-16 sm:pl-20 pr-4 bg-gray-50/60 border-l-2 border-gray-200 ml-4" : ""}`}>
            <div className="shrink-0">
                <CategoryImage img={item?.img} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{item?.cardboardname}</p>
                <p className="truncate text-sm text-gray-500">{item?.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <Tooltip content="View products" className="px-2">
                    <Link
                        className="text-xl font-bold text-green-700 py-1 hover:text-green-500"
                        href={`/admin/products/list/${item?._id}`}
                    >
                        <HiViewList />
                    </Link>
                </Tooltip>
                <Tooltip content="Edit" className="px-2">
                    <button
                        className="text-xl font-bold text-green-700 py-1 hover:text-green-500"
                        onClick={() => onEdit(item)}
                    >
                        <MdEditDocument />
                    </button>
                </Tooltip>
                <Tooltip content="Delete" className="px-2">
                    <button
                        className="text-xl font-bold text-red-700 py-1 hover:text-red-500"
                        onClick={() => onDelete(item?._id)}
                    >
                        <MdDelete />
                    </button>
                </Tooltip>
            </div>
        </div>
    );
}

const ProductList = () => {
    const [data, setData] = useState(null);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [collapsedIds, setCollapsedIds] = useState(new Set());
    const hasInitializedCollapse = useRef(false);

    const handleRefresh = () => { setRefreshData(prev => !prev); };

    const { topLevel, childrenByParent } = useMemo(() => {
        const raw = data || [];
        const top = raw.filter((c) => !c.parent_id);
        const byParent = {};
        raw.filter((c) => c.parent_id).forEach((c) => {
            const pid = String(c.parent_id);
            if (!byParent[pid]) byParent[pid] = [];
            byParent[pid].push(c);
        });
        return { topLevel: top, childrenByParent: byParent };
    }, [data]);

    useEffect(() => {
        hasInitializedCollapse.current = false;
        const fetchData = async () => {
            const products = await getMainProducts();
            setData(products?.data);
        };
        fetchData();
    }, [refreshData]);

    // Start with all dropdowns closed (subcategories hidden) - only on first data load
    useEffect(() => {
        if (hasInitializedCollapse.current || !topLevel?.length) return;
        const parentsWithChildren = topLevel.filter((p) => (childrenByParent[String(p._id)] || []).length > 0);
        if (parentsWithChildren.length > 0) {
            hasInitializedCollapse.current = true;
            setCollapsedIds(new Set(parentsWithChildren.map((p) => p._id)));
        }
    }, [topLevel, childrenByParent]);

    const toggleCollapse = (id) => {
        setCollapsedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleDeleteProduct = async (prodId) => {
        Swal.fire({
            title: "Do you want to delete the product?",
            showCancelButton: true,
            confirmButtonText: "Delete",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/api/v1/deleteMainType/${prodId}`, {
                        method: "DELETE"
                    });

                    if (response.ok) {
                        const fetchedData = await getMainProducts();
                        setData(fetchedData?.data);
                        Swal.fire("Deleted!", "", "success");
                    } else {
                        Swal.fire("Error!", "Failed to delete product!", "error");
                    }
                } catch (error) {
                    console.error("Error:", error);
                    Swal.fire("Error!", "An error occurred!", "error");
                }
            }
        });
    };

    const handleEditProduct = (product) => {
        setEditProduct(product);
        setOpenEditModal(true);
    };

    const closeAddModal = () => setOpenAddModal(false);
    const closeEditModal = () => {
        setOpenEditModal(false);
        setEditProduct(null);
    };

    return (
        <>
            <div className="flow-root">
                <div className="flex flex-row justify-end items-center mb-4">
                    <Button
                        outline
                        gradientDuoTone="greenToBlue"
                        onClick={() => setOpenAddModal(true)}
                    >
                        <MdOutlinePostAdd className="mr-2 h-5 w-5" />
                        Add Item
                    </Button>
                </div>
                <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden bg-white">
                    {topLevel?.map((parent) => {
                        const subcategories = childrenByParent[String(parent._id)] || [];
                        const hasChildren = subcategories.length > 0;
                        const isCollapsed = collapsedIds.has(parent._id);
                        return (
                            <li key={parent._id} className="divide-y divide-gray-100">
                                <div className="flex items-center space-x-4 py-3 sm:py-4 px-4 bg-white hover:bg-gray-50/50">
                                    {hasChildren ? (
                                        <button
                                            type="button"
                                            onClick={() => toggleCollapse(parent._id)}
                                            className="shrink-0 p-0.5 rounded hover:bg-gray-200 text-gray-600"
                                            aria-label={isCollapsed ? "Expand" : "Collapse"}
                                        >
                                            {isCollapsed ? (
                                                <MdExpandMore className="text-xl" />
                                            ) : (
                                                <MdExpandLess className="text-xl" />
                                            )}
                                        </button>
                                    ) : (
                                        <span className="w-6 shrink-0" />
                                    )}
                                    <div className="shrink-0">
                                        <CategoryImage img={parent?.img} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-gray-900">{parent.cardboardname}</p>
                                        <p className="truncate text-sm text-gray-500">{parent.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Tooltip content="View products" className="px-2">
                                            <Link
                                                className="text-xl font-bold text-green-700 py-1 hover:text-green-500"
                                                href={`/admin/products/list/${parent._id}`}
                                            >
                                                <HiViewList />
                                            </Link>
                                        </Tooltip>
                                        <Tooltip content="Edit" className="px-2">
                                            <button
                                                className="text-xl font-bold text-green-700 py-1 hover:text-green-500"
                                                onClick={() => handleEditProduct(parent)}
                                            >
                                                <MdEditDocument />
                                            </button>
                                        </Tooltip>
                                        <Tooltip content="Delete" className="px-2">
                                            <button
                                                className="text-xl font-bold text-red-700 py-1 hover:text-red-500"
                                                onClick={() => handleDeleteProduct(parent._id)}
                                            >
                                                <MdDelete />
                                            </button>
                                        </Tooltip>
                                    </div>
                                </div>
                                {hasChildren && !isCollapsed && (
                                    <div className="border-t border-gray-100">
                                        {subcategories.map((sub) => (
                                            <CategoryRow
                                                key={sub._id}
                                                item={sub}
                                                isSubcategory
                                                onEdit={handleEditProduct}
                                                onDelete={handleDeleteProduct}
                                            />
                                        ))}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
            <AddBoxModel
                openModalVal={openAddModal}
                closeModelHandler={closeAddModal}
                refreshHandler={handleRefresh}
            />
            <EditBoxModel
                openModalVal={openEditModal} // Open edit modal
                closeModelHandler={closeEditModal} // Close edit modal
                refreshHandler={handleRefresh}
                editProduct={editProduct} // Pass the product to the modal for editing
            />
        </>
    );
};

export default ProductList;
