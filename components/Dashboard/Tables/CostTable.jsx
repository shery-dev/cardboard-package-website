"use client";

import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { useEffect, useState } from "react";

async function getCostData() {
  try {
    const res = await fetch("/api/v1/get-cost", {
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

export default function CostTable() {
  const [data, setData] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      const costData = await getCostData();
      setData(costData?.data);
    };
    fetchData()
  }, [])

  return (
    <div className=" w-full overflow-x-auto">
      <Table className=" w-full">
        <TableHead>
          <TableHeadCell>Labour</TableHeadCell>
          <TableHeadCell>Rent</TableHeadCell>
          <TableHeadCell>Printed Sides</TableHeadCell>
          <TableHeadCell>Image Printed Side</TableHeadCell>
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
                <TableCell>Rs. {item?.labor}</TableCell>
                <TableCell>Rs. {item?.rent}</TableCell>
                <TableCell>Rs. {item?.printedSides}</TableCell>
                <TableCell>Rs. {item?.imagePrintedSide}</TableCell>
                <TableCell>
                  <a href={`/admin/update-costs/${item?._id}`} className="font-medium text-cyan-600 hover:underline">
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
