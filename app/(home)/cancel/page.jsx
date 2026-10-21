"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaTimesCircle } from 'react-icons/fa';

const CancelPage = () => {
  const router = useRouter();

  const handleRetryPayment = () => {
    // Navigate to payment page or wherever appropriate
    router.push('/shopping-cart');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <FaTimesCircle className="mx-auto text-red-500 text-6xl" />
        <h1 className="text-2xl font-semibold text-gray-800 mt-4">Payment Cancelled</h1>
        <p className="text-gray-600 my-4">
          Your payment process was not completed. You can attempt to make the payment again.
        </p>
        <button
          onClick={handleRetryPayment}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default CancelPage;
