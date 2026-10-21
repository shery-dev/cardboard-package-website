"use client";

import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { useEffect, useState } from "react";

async function getMaterialsData() {
    try {
        const res = await fetch("/api/v1/getMaterials", {
            method: "GET"
        })
        if (!res.ok) {
            throw new Error('Failed to fetch data')
        }
        return res.json()
    } catch (error) {
        console.error('API request failed:', error)
    }
}

export default function MaterialDetailTable() {

    const [data, setData] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            const costData = await getMaterialsData();
            setData(costData?.data);
        };
        fetchData()
    }, [])

    return (
        <div className=" w-full overflow-x-auto">
            <Table hoverable className=" w-full">
                <TableHead>
                    <TableHeadCell>Material Name</TableHeadCell>
                    <TableHeadCell>Paper Rate</TableHeadCell>
                    <TableHeadCell>Roll Rate</TableHeadCell>
                    <TableHeadCell>Gramedge</TableHeadCell>
                    <TableHeadCell>
                        <span className="sr-only">Edit</span>
                    </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                    {
                        data?.map((item) => (
                            <TableRow
                                key={item?._id}
                                className="bg-white"
                            >
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 ">
                                    {item?.materailName}
                                </TableCell>
                                <TableCell>Rs. {item?.paperRate}</TableCell>
                                <TableCell>Rs. {item?.rollRate}</TableCell>
                                <TableCell>Rs. {item?.gamrige}</TableCell>
                                <TableCell>
                                    <a href={`/admin/update-materials/${item?._id}`} className="font-medium text-cyan-600 hover:underline">
                                        Edit
                                    </a>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    );
}
