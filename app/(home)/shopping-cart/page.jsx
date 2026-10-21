"use client";
import ShoppingItemList from "@/components/shoppingCartPage/ShoppingItemList";
import TotalPriceCard from "@/components/shoppingCartPage/TotalPriceCard";
import { Button } from "flowbite-react";
import { FaMoneyCheckAlt, FaArrowLeft } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/Context";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Link from "next/link";

function getContinueShoppingHref(itemsList) {
  if (!itemsList?.length) return "/#products";
  const last = itemsList[itemsList.length - 1];
  const isCustomBox = !!last.ThreeD || last.categoryPath === "Food and Restaurant > Standard Mailer Box" || last.name === "Custom Box" || last.name === "Standard Mailer Box";
  if (isCustomBox) return "/#products";
  if (last.categorySlug) return `/categories/${last.categorySlug}`;
  if (last.categoryUrl) return last.categoryUrl;
  return "/#products";
}

const Page = () => {
  const [cartItems, setCartItems] = useState(0);
  const [isProcessingPayLater, setIsProcessingPayLater] = useState(false);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const { itemsList, setItemsList } = useAppContext();
  const [user, setUser] = useState(null);
  const router = useRouter();

    useEffect(() => {
        // Check if the user is logged in when the component mounts
        const checkAuth = async () => {
            const response = await fetch('/api/v1/checkUser');
            if (response.ok) {
                const userData = await response.json();
                console.log(userData)
                setUser(userData.user);
                console.log(userData)
            } else {
                setUser(null);
            }
        };
        checkAuth();
    }, []);

  const handleItemsChange = (itemCount) => {
    setCartItems(itemCount);
  };

  const handlePayLater = async () => {
    let username = user?.name ?? "";
    let email = user?.email ?? "";
    if (!user) {
      const { value: guestData } = await Swal.fire({
        title: "Contact details",
        html: '<input id="guest-name" class="swal2-input" placeholder="Your name">' +
              '<input id="guest-email" type="email" class="swal2-input" placeholder="Your email">',
        showCancelButton: true,
        confirmButtonText: "Place order",
        preConfirm: () => ({
          name: document.getElementById("guest-name")?.value?.trim(),
          email: document.getElementById("guest-email")?.value?.trim(),
        }),
      });
      if (!guestData || !guestData.email) return;
      username = guestData.name || "Guest";
      email = guestData.email;
    }

    setIsProcessingPayLater(true);
    try {
      const response = await fetch("/api/v1/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          orders: itemsList,
          orderStatus: "Unpaid",
          shippingStatus: "Processing",
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Clear the context items
      setItemsList([]);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Order placed successfully!",
        text: "Your order has been placed successfully.",
        confirmButtonText: "OK",
      }).then(() => {
        setIsProcessingPayLater(false);
        router.push("/success", {
          state: { user, itemsList },
        });
      });
    } catch (error) {
      console.error("Error placing order:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error placing your order. Please try again.",
        confirmButtonText: "OK",
      });
    } finally {
      setIsProcessingPayLater(false);
    }
  };

  const handleCheckout = async () => {
    if (!itemsList?.length) {
      Swal.fire({ icon: "warning", title: "Cart empty", text: "Add items before checkout." });
      return;
    }
    setIsProcessingCheckout(true);
    try {
      const response = await fetch("/api/v1/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders: itemsList }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Checkout failed");
      }
      const { url } = await response.json();
      if (url) {
        window.location.href = url;
        return;
      }
      throw new Error("No checkout URL returned");
    } catch (error) {
      console.error("Checkout error:", error);
      Swal.fire({
        icon: "error",
        title: "Checkout failed",
        text: error.message || "Could not start checkout. Please try again.",
      });
    } finally {
      setIsProcessingCheckout(false);
    }
  };

    return (
        <>
            <div className="px-4 lg:px-24 py-10 grid grid-cols-6 gap-4">
                <div className="col-span-6 py-4 px-2 border-0 border-b border-gray-400">
                    <h1 className='text-4xl text-headingTxtColor font-lora font-bold'>
                        Shopping Cart
                    </h1>
                </div>
                <div className="col-span-6 lg:col-span-4 row-span-2 lg:row-span-4 row-start-3 lg:row-start-2 col-start-1 lg:col-start-1 py-4 px-2">
                    <div className='flex items-start flex-col w-full'>
                        <div className="flex flex-wrap items-center justify-between gap-2 w-full">
                            <h4 className='text-xl font-bold font-inter text-gray-700'>
                                Items List
                            </h4>
                            <Link
                                href={getContinueShoppingHref(itemsList)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-headingTxtColor text-headingTxtColor font-medium hover:bg-headingTxtColor hover:text-white transition-colors"
                            >
                                <FaArrowLeft className="w-4 h-4" />
                                Continue Shopping
                            </Link>
                        </div>
                        <div className='w-full py-4'>
                            <ShoppingItemList onItemsChange={handleItemsChange} />
                        </div>
                    </div>
                </div>
                {cartItems > 0 && (
                    <div className="col-span-6 lg:col-span-2 row-span-1 lg:row-span-2 col-start-1 lg:col-start-5 row-start-2 lg:row-start-2 px-2 py-2">
                        <div className='flex justify-between items-center flex-col gap-4 px-4 py-4 w-full bg-blue-50 rounded-xl'>
                            <TotalPriceCard />
                            <span className='w-full'>
                                <Button
                                    className="w-full border border-transparent bg-mainBgColor text-white focus:ring-4 focus:ring-red-300 enabled:hover:bg-mainBgHover"
                                    onClick={handlePayLater}
                                    disabled={isProcessingPayLater}
                                >
                                    {isProcessingPayLater ? 'Processing...' : 'Pay Later'}
                                </Button>
                            </span>
                        </div>
                    </div>
                )}
                {cartItems > 0 && (
                    <div className="col-span-6 lg:col-span-2 row-span-1 lg:row-span-2 col-start-1 lg:col-start-5 row-start-3 lg:row-start-4 px-2 py-2">
                        <div className='flex justify-between items-center flex-col gap-4 px-4 py-4 w-full bg-green-50 rounded-xl'>
                            <div className='flex items-center gap-2'>
                                <FaMoneyCheckAlt className='text-green-700' size={24} />
                                <h4 className='text-xl font-bold font-inter text-gray-700'>
                                    Pay Now
                                </h4>
                            </div>
                            <span className='w-full'>
                                <Button
                                    className="w-full border border-transparent bg-headingTxtColor text-white focus:ring-4 focus:ring-green-300 enabled:hover:bg-green-600"
                                   onClick={handleCheckout}
                                
                                >
                                    Checkout
                                </Button>
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Page;
