"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useState, useEffect } from "react";

export default function OrdersTable() {
  const [orders, setOrders] = useState(null); // State to store fetched orders
  const [statusUpdates, setStatusUpdates] = useState({}); // State to manage status changes

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/v1/get-orders"); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`Error fetching orders: ${response.statusText}`);
        }
        const data = await response.json();
        setOrders(data?.data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching orders:", error);
        // Handle errors gracefully (e.g., display error message)
      }
    };

    fetchOrders();
  }, []); // Empty dependency array to fetch data on component mount

  function calculateTotalAmount(userOrders) {
    let total = 0;
    for (const order of userOrders) {
      total += order.price;
    }
    return total;
  }

  const handleStatusChange = async (userId, statusType, status) => {
    try {
      const updatedStatus = {
        ...statusUpdates[userId],
        [statusType]: status,
      };
     
      const response = await fetch(`/api/v1/update-order-status/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStatus),
      });
      if (!response.ok) {
        throw new Error(`Error updating status: ${response.statusText}`);
      }

      setStatusUpdates((prev) => ({
        ...prev,
        [userId]: updatedStatus,
      }));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table hoverable className="w-full">
        <TableHead>
          <TableHeadCell>Client Name</TableHeadCell>
          <TableHeadCell>Email</TableHeadCell>
          <TableHeadCell>No. of Order</TableHeadCell>
          <TableHeadCell>Total Amount</TableHeadCell>
          <TableHeadCell>Order Status</TableHeadCell>
          <TableHeadCell>Shipping Status</TableHeadCell>
          <TableHeadCell>
            <span className="sr-only">Edit</span>
          </TableHeadCell>
        </TableHead>

        <TableBody className="divide-y">
          {orders?.map((user) => (
            <TableRow
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
              key={user?._id}
            >
              <TableCell>{user?.username}</TableCell>
              <TableCell>{user?.email}</TableCell>
              <TableCell>{user?.orders.length}</TableCell>
              <TableCell>{calculateTotalAmount(user?.orders)}</TableCell>
              <TableCell>
                <select
                  value={
                    statusUpdates[user?._id]?.orderStatus || user?.orderStatus
                  }
                  onChange={(e) =>
                    handleStatusChange(user?._id, "orderStatus", e.target.value)
                  }
                  className="bg-white border border-gray-300 p-2 rounded"
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
              </TableCell>
              <TableCell>
                <select
                  value={
                    statusUpdates[user?._id]?.shippingStatus ||
                    user?.shippingStatus
                  }
                  onChange={(e) =>
                    handleStatusChange(
                      user?._id,
                      "shippingStatus",
                      e.target.value
                    )
                  }
                  className="bg-white border border-gray-300 p-2 rounded"
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </TableCell>
              <TableCell>
                <a
                  href={`/admin/order-details/${user?._id}`}
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
