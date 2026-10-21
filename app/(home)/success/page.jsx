"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/Context";
import dynamic from "next/dynamic"; // Import dynamic
import animationData from "@/components/Animation/Animations.json";

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

const SuccessPage = () => {
  const {
    itemsList,
    setItemsList,
    orderCreated,
    setOrderCreated,
    isCreatingOrder,
    setIsCreatingOrder,
  } = useAppContext();
  const [user, setUser] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch("/api/v1/checkUser");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (itemsList.length === 0) {
      router.push("/");
      return;
    }
    const createOrder = async () => {
      try {
        if (user && orderCreated && !isCreatingOrder) {
          setIsCreatingOrder(true); // Set to true when starting the order creation process
          const response = await fetch("/api/v1/create-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: user.name,
              email: user.email,
              orders: itemsList,
              orderStatus: "Paid",
              shippingStatus: "Processing",
            }),
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          // Clear the context items
          setItemsList([]);
          setOrderCreated(false); // Set the flag to false after order creation
          setIsCreatingOrder(false); // Reset the order creation state
        }
      } catch (error) {
        console.error("Error placing order:", error);
        setIsCreatingOrder(false); // Reset the order creation state in case of error
      }
    };

    if (user && orderCreated) {
      createOrder();
    }
  }, [user, orderCreated, itemsList, setItemsList, setOrderCreated, isCreatingOrder]);

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center space-y-4">
          <Lottie options={defaultOptions} height={200} width={200} />
          <h1 className="text-2xl font-semibold text-gray-800">Payment Successful!</h1>
          <p className="text-gray-600">Your payment has been processed successfully.</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;

