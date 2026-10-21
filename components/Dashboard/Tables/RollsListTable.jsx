"use client";

import { Select, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import Link from "next/link";
import { useEffect, useState } from "react";

async function getRollData() {
  try {
    const res = await fetch("/api/v1/getRolls", {
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

export default function RollsListTable({ selectedType }) {
  const [data, setData] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({}); // State to store selected size for each item

  useEffect(() => {
    const fetchData = async () => {
      const rollsData = await getRollData();
      setData(rollsData?.data);
    };
    fetchData();
  }, []);

  // Event handler for select change
  const handleSizeChange = (itemId, size) => {
    setSelectedSizes({ ...selectedSizes, [itemId]: size }); // Update selected size for the specific item
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table className="w-full">
        <TableHead>
          <TableHeadCell>Type Name</TableHeadCell>
          <TableHeadCell>Rate</TableHeadCell>
          <TableHeadCell>Size</TableHeadCell>
          <TableHeadCell>
            <span className="sr-only">Edit</span>
          </TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {data?.map((item) => (
            <TableRow key={item?._id} className="bg-white">
              <TableCell>{item?.Type}</TableCell>
              <TableCell>{item?.Rate}</TableCell>
              <TableCell>
                <div className="w-36">
                  <Select required value={selectedSizes[item?._id]} onChange={(e) => handleSizeChange(item?._id, e.target.value)}>
                    <option value={""}>Select a size</option>
                    {item?.Sizes[selectedType]?.map((size) => (
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
                        pathname: `/admin/rolls/update-roll/${item?._id}`,
                        query: {
                          selectedSize: selectedSizes[item?._id],
                          thickness: selectedType
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