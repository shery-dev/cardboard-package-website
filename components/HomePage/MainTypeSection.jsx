"use client";
import ProductCard from './ProductCard';
import { useEffect, useState } from "react";

// Fallback data when API/DB is unavailable (e.g. local run without MongoDB)
const FALLBACK_PRODUCTS = [
  {
    _id: "shipping-boxes",
    cardboardname: "Shipping Boxes",
    description: "Safely transport your products with our specialized shipping boxes for Electronic Appliances, Essential Accessories, Kitchen Essentials, and Office Equipment.",
    img: ["/img/logo.svg"],
  },
  {
    _id: "mailer-boxes",
    cardboardname: "Mailer Boxes",
    description: "A versatile, stylish, and sturdy custom mailer box, perfect for gift boxes, laptop boxes, courier packaging, and product packing.",
    img: ["/img/logo.svg"],
  },
  {
    _id: "food-beverages",
    cardboardname: "Food & Beverages",
    description: "A versatile and food-safe box, perfect for packaging vegetables, fruits, fast food like pizza, and beverages.",
    img: ["/img/logo.svg"],
  },
  {
    _id: "electronic-appliances",
    cardboardname: "Electronic Appliances",
    description: "A durable and protective custom box designed for electronic appliances, ideal for safely packaging and shipping items like TVs, refrigerators, and microwaves. Perfect for retail and courier packaging, combining strength and style.",
    img: ["/img/logo.svg"],
  },
];

async function getData() {
  try {
    const res = await fetch("/api/v1/cardboard-types");
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("API request failed (using fallback data):", error.message);
    return null;
  }
}

const MainTypeSection = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const dataFetcher = async () => {
      const fetchedData = await getData();
      setData(fetchedData);
    };
    dataFetcher();
  }, []);

  const items = data?.data?.length ? data.data : FALLBACK_PRODUCTS;

  return (
    <>
      <div className="flex flex-wrap justify-center gap-6 p-4 md:grid-cols-3">
        {items.map((item) => (
          <ProductCard
            key={item._id}
            heading={item.cardboardname}
            descriptions={item.description}
            imgSrc={item.img?.[0]?.startsWith("/") ? item.img[0] : `/api/v1/fetchImg/${item.img?.[0] ?? ""}`}
            to={`/cardboard/products-list/${item._id}`}
          />
        ))}
      </div>
    </>
  );
};

export default MainTypeSection