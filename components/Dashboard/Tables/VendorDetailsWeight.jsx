"use client"
import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, TextInput } from "flowbite-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function VendorDetailsWeight({ vendors, typeId, mainSize, typeName }) {
    const router = useRouter();
    const [selectedVendor, setSelectedVendor] = useState("")
    const [selectedWeight, setSelectedWeight] = useState("")

    const handleDelete = (vendorId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(
                        `/api/v1/deleteVendorById/${vendorId}`,
                        {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(
                                {
                                    type: typeId,
                                    size: mainSize,
                                    typeName: typeName,
                                    vendorName: selectedVendor,
                                    weightType: selectedWeight
                                }
                            ),
                        }
                    );

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
                            router.push(`/admin/reels`);
                        }
                    });
                } catch (error) {
                    console.error("Error:", error);
                }
            }
        });
    };
    return (
        <div className="w-full overflow-x-auto">
            <Table className="w-full">
                <TableHead>
                    <TableHeadCell>Image</TableHeadCell>
                    <TableHeadCell>Name</TableHeadCell>
                    <TableHeadCell>Weight Type</TableHeadCell>
                    <TableHeadCell>Rate</TableHeadCell>
                    <TableHeadCell>
                        <span className="sr-only">Update</span>
                    </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                    {
                        vendors?.map((vendor) => (
                            <TableRow
                                key={vendor?._id}
                                className="bg-white"
                            >
                                <TableCell>
                                    <Image
                                        height={50}
                                        width={50}
                                        src={vendor?.images[0]}
                                        alt="product-img"
                                        className="rounded-full"
                                    />
                                </TableCell>
                                <TableCell>{vendor?.vendorName}</TableCell>
                                <TableCell>{vendor?.weight_type}</TableCell>
                                <TableCell>{vendor?.Rate}</TableCell>
                                <TableCell>
                                    <Button
                                        outline
                                        gradientDuoTone="greenToBlue"
                                        onClick={() => {
                                            setSelectedWeight(vendor?.weight_type)
                                            setSelectedVendor(vendor?.vendorName)
                                            handleDelete(vendor?._id)
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    );
}
