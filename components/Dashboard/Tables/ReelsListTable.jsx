"use client";

import { Select, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { useEffect, useState } from "react";
import Link from "next/link";


async function getReelData() {
  try {
    const res = await fetch("/api/v1/getReels", {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  } catch (error) {
    console.error("API request failed:", error);
  }
}

export default function ReelsListTable() {
  const [data, setData] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({}); // Object to store selected size for each item

  useEffect(() => {
    const fetchData = async () => {
      const reelsData = await getReelData();
      setData(reelsData?.data);
    };
    fetchData();

  }, []);

  const handleSizeChange = (e, itemId) => {
    console.log(e); // Log the event object to inspect its structure
    const selectedValue = e.target ? e.target.value : e; // Extract the selected value from the event object
    setSelectedSizes({ ...selectedSizes, [itemId]: selectedValue });
  };

  return (
    <div className=" w-full overflow-x-auto">
      <Table className=" w-full">
        <TableHead>
          <TableHeadCell>Type Name</TableHeadCell>
          <TableHeadCell>Size</TableHeadCell>
          <TableHeadCell>
            <span className="sr-only">Edit</span>
          </TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {data?.map((item) => (
            <TableRow
              key={item?._id}
              className="bg-white"
            >
              <TableCell>{item?.Type}</TableCell>
              <TableCell>
                <div className="w-36">
                  <Select required value={selectedSizes[item?._id]} onChange={(e) => handleSizeChange(e, item?._id)}>
                    <option value={""}>Select a size</option>
                    {item?.Sizes?.map((size) => (
                      <option key={size?._id} value={size?.Size}>
                        {size?.Size}
                      </option>
                    ))}
                  </Select>
                </div>
              </TableCell>
              <TableCell>
                {selectedSizes[item?._id] !== undefined && selectedSizes[item?._id] !== "" ? (
                  <Link
                    href={
                      {
                        pathname: `/admin/reels/update-reel/${item?._id}`,
                        query: {
                          selectedSize: selectedSizes[item?._id],
                          
                        }
                      }
                    }
                    className="font-medium text-cyan-600 hover:underline"
                  >
                    Edit
                  </Link>
                ) : (
                  <span className="opacity-50">Edit</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
