"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderDetailsTable() {

  const [order, setOrder] = useState(null); // State to store fetched orders
  const { id } = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/v1/get-order-by-id/${id}`); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`Error fetching orders: ${response.statusText}`);
        }
        const data = await response.json();
        setOrder(data?.data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Handle errors gracefully (e.g., display error message)
      }
    };

    fetchOrders();
  }, []); 
  return (
    <div className="w-full overflow-x-auto p-8">
      <Table className="w-full mb-4">
        <TableHead>
          <TableHeadCell>Product Name</TableHeadCell>
          <TableHeadCell>Quantity</TableHeadCell>
          <TableHeadCell>Price (per unit)</TableHeadCell>
          <TableHeadCell>Total Price</TableHeadCell>
        </TableHead>
        <TableBody className="divide-y">
          {order?.orders?.map((orders) => (
            <TableRow key={orders._id}>
              <TableCell>{orders.name}</TableCell>
              <TableCell>{orders.quantity}</TableCell>
              <TableCell>{orders.pricePerPiece}</TableCell>
              <TableCell>{orders.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
