"use client";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdEditDocument, MdDelete, MdOutlinePostAdd } from "react-icons/md";
import Swal from "sweetalert2";
import Link from "next/link";
import FormPopUp from "../FormPopUp";

async function getData(id) {
  try {
    const res = await fetch(`/api/v1/getProducts/${id}`, {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const jsonData = await res.json();
    return jsonData.data;
  } catch (error) {
    console.error("API request failed:", error);
    return null; // Return null to signify failure
  }
}

export default function ProductsTable() {
  const [data, setData] = useState(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const { id } = useParams();

  const handleOpenAddItemModal = () => setShowAddItemModal(true);
  const handleCloseAddItemModal = () => setShowAddItemModal(false);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getData(id);
      setData(fetchedData);
    };
    if (id) {
      fetchData();
    }
  }, ["", showAddItemModal]);

  const handleDeleteProduct = async (prodId) => {
    Swal.fire({
      title: "Do you want to delete the product?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/v1/delete-product/${prodId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            const fetchedData = await getData(id);
            setData(fetchedData);
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

  return (
    <div className=" w-full overflow-x-auto">
      <div className=" flex flex-row justify-end items-center">
        <Button
          outline
          gradientDuoTone="greenToBlue"
          className="mb-2"
          onClick={handleOpenAddItemModal}
        >
          <MdOutlinePostAdd className="mr-2 h-5 w-5" />
          Add Item
        </Button>
      </div>
      <FormPopUp trigger={showAddItemModal} handler={handleCloseAddItemModal} />
      <Table className=" w-full">
        <TableHead>
          <TableHeadCell>Image</TableHeadCell>
          <TableHeadCell>Product Name</TableHeadCell>
          <TableHeadCell>L X W X D (in)</TableHeadCell>
          <TableHeadCell>Rate (Rs.)</TableHeadCell>
          <TableHeadCell>Quantity</TableHeadCell>
          <TableHeadCell>
            <span className="sr-only">Edit</span>
          </TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {data?.map((item) => (
            <TableRow key={item?._id} className="bg-white">
              <TableCell>
                <Image
                  width={40}
                  height={40}
                  src={item?.images?.[0]?.startsWith("/") ? item.images[0] : `/api/v1/fetchImg/${item?.images?.[0] ?? ""}`}
                  alt="img"
                  className=" rounded-full"
                />
              </TableCell>
              <TableCell className=" capitalize">
                {item?.cardboardname}
              </TableCell>
              <TableCell>
                {item?.dimensions?.length} X {item?.dimensions?.width} X{" "}
                {item?.dimensions?.depth}
              </TableCell>
              <TableCell>{item?.rate}</TableCell>
              <TableCell>{item?.quantity}</TableCell>
              <TableCell className=" flex flex-row items-center gap-2">
                <Link
                  href={`/admin/products/single-product-update/${item?._id}`}
                  className=" text-2xl font-medium text-green-600 cursor-pointer hover:text-green-500"
                >
                  <MdEditDocument />
                </Link>
                <span
                  onClick={() => handleDeleteProduct(item?._id)}
                  className=" text-2xl font-medium text-red-600 cursor-pointer hover:text-red-500"
                >
                  <MdDelete />
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
