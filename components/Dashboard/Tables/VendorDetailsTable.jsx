"use client"
import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, TextInput } from "flowbite-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function VendorDetailsTable({ vendors, mainId, mainSize }) {
    const [rates, setRates] = useState([]);
    const router = useRouter();
    console.log(vendors)

    useEffect(() => {
        // Initialize rates state when vendors prop changes
        setRates(vendors.map(() => null));
    }, [vendors]);

    const handleRateChange = (index, value) => {
        const newRates = [...rates];
        newRates[index] = value;
        setRates(newRates);
    };

    const handleUpdate = async (vendorId, rate) => {
         console.log(vendorId)
        try {
            const response = await fetch(
                `/api/v1/updateVendor/${mainId}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        {
                            size: mainSize,
                            vendorId: vendorId,
                            Rate: rate
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
    };

    return (
        <div className="w-full overflow-x-auto">
            <Table className="w-full">
                <TableHead>
                    <TableHeadCell>Image</TableHeadCell>
                    <TableHeadCell>Name</TableHeadCell>
                    <TableHeadCell>Rate</TableHeadCell>
                    <TableHeadCell>
                        <span className="sr-only">Update</span>
                    </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                    {vendors?.map((vendor, index) => (
                        <TableRow key={vendor?._id} className="bg-white">
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
                            <TableCell>
                                <TextInput
                                    id={`rate_${vendor?._id}`}
                                    type="number"
                                    required
                                    value={rates[index] || vendor?.Rate}
                                    onChange={(e) => handleRateChange(index, e.target.value)}
                                />
                            </TableCell>
                            <TableCell>
                                <Button
                                    outline
                                    gradientDuoTone="greenToBlue"
                                    onClick={() => handleUpdate(vendor?._id, rates[index])}
                                >
                                    Update
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
