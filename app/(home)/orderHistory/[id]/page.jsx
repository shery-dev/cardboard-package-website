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
import { useState, useEffect } from "react";

export default function OrdersTable() {
  const [orders, setOrders] = useState(null); 
  const params = useParams();
  function calculateTotalAmount(userOrders) {
    let total = 0;
    for (const order of userOrders) {
      total += order.price;
    }
    return total;
  }
  useEffect(() => {
  const handleOrderTracking = async (userId) => {
    try {
      const response = await fetch(`/api/v1/orderTracking/${userId}`);
       
      if (!response.ok) {
        throw new Error(`Error updating status: ${response.statusText}`);
      }
      const data = await response.json();
        setOrders(data?.data);

     
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  handleOrderTracking(params.id);
}, []); 
  return (
    <div className="w-full overflow-x-auto p-8">
      <Table hoverable className="w-full">
        <TableHead>
        <TableHeadCell>#</TableHeadCell>
          <TableHeadCell>No. of Items</TableHeadCell>
          <TableHeadCell>Order Status</TableHeadCell>
          <TableHeadCell>Shipping Status</TableHeadCell>
          <TableHeadCell>Total Amount</TableHeadCell>
          <TableHeadCell>
            <span className="sr-only">Edit</span>
          </TableHeadCell>
        </TableHead>

        <TableBody className="divide-y">
          {orders?.map((user,index) => (
            <TableRow
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
              key={user?._id}
            >
               <TableCell>{index+1}</TableCell>
              <TableCell>{user?.orders.length}</TableCell>
              <TableCell>{user?.orderStatus}</TableCell>
              <TableCell>{user?.shippingStatus}</TableCell>
              <TableCell>{calculateTotalAmount(user?.orders)}</TableCell>
              <TableCell>
                <a
                  href={`/orderhistorydeatil/${user?._id}`}
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                >
                  Details
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


