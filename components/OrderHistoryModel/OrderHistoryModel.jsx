import React, { useEffect, useState } from 'react';

const OrderHistoryModal = ({ isOpen, onClose, userId }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (isOpen && userId) {
            // Fetch the orders for the specific user from the API when the modal is opened
            fetch(`/api/v1/orderTracking/${userId}`)
                .then(response => response.json())
                .then(data => {
                    setOrders(data.data);
                })
                .catch(error => {
                    console.error('Error fetching order history:', error);
                });
        }
    }, [isOpen, userId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
                <button className="absolute top-2 right-2" onClick={onClose}>Close</button>
                <h2 className="text-2xl mb-4">Order History</h2>
                <table className="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">User Name</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Order Status</th>
                            <th className="py-2 px-4 border-b">Shipping Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className="py-2 px-4 border-b">{order.username}</td>
                                <td className="py-2 px-4 border-b">{order.email}</td>
                                <td className="py-2 px-4 border-b">{order.orderStatus}</td>
                                <td className="py-2 px-4 border-b">{order.shippingStatus}</td>
                                {/* <td className="py-2 px-4 border-b">{order.orders.name}</td> */}

                                </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderHistoryModal;
