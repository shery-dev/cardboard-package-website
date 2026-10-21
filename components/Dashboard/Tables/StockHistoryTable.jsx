"use client";

import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { useEffect, useState } from "react";

async function getStockData() {
    try {
        const res = await fetch("/api/v1/getStockHistory", {
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

export default function StockHistoryTable() {
    const [data, setData] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            const stockData = await getStockData();
            setData(stockData?.data);
        };
        fetchData()
    }, [])

    return (
        <div className=" w-full overflow-x-auto">
            <Table className=" w-full">
                <TableHead>
                    <TableHeadCell>Product</TableHeadCell>
                    <TableHeadCell>Operation</TableHeadCell>
                    <TableHeadCell>Type</TableHeadCell>
                    <TableHeadCell>Size</TableHeadCell>
                    <TableHeadCell>Time</TableHeadCell>
                    <TableHeadCell>Reel Weight</TableHeadCell>
                    <TableHeadCell>Reel Vendor</TableHeadCell>
                    <TableHeadCell>Quantity</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                    {
                        data?.map((item) => (
                            <TableRow
                                className="bg-white"
                                key={item?._id}
                            >
                                <TableCell className=" capitalize">{item?.productType}</TableCell>
                                <TableCell className=" capitalize">{item?.operation}</TableCell>
                                <TableCell className=" capitalize">{item?.categoryType}</TableCell>
                                <TableCell className=" capitalize">{item?.productSize}</TableCell>
                                <TableCell className=" capitalize">{item?.time}</TableCell>
                                <TableCell className=" capitalize">{item?.reelWeight}</TableCell>
                                <TableCell className=" capitalize">{item?.reelVendor}</TableCell>
                                <TableCell className=" capitalize">{item?.quantity}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    );
}
