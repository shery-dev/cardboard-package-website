"use client";

import ProductDP from "@/components/CardboardPage/ProductDP";
import ProductPageAmazon from "@/components/CardboardPage/ProductPageAmazon";
import ImagesContainer from "@/components/ImageMagnifier/ImagesContainer";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

async function getData(id) {
  try {
    const res = await fetch(`/api/v1/getSingleProductById/${id}`);
    if (!res.ok) throw new Error("Failed to fetch data");
    const jsonData = await res.json();
    return jsonData.data;
  } catch (error) {
    console.error("API request failed:", error);
    return null;
  }
}

export async function getMaterils() {
  try {
    const res = await fetch(`/api/v1/getMaterials`);
    if (!res.ok) throw new Error("Failed to fetch data");
    const jsonData = await res.json();
    return jsonData.data;
  } catch (error) {
    console.error("API request failed:", error);
    return null;
  }
}

async function getSimilarProducts(categoryId, excludeId) {
  try {
    const res = await fetch(`/api/v1/getProducts/${categoryId}`);
    if (!res.ok) return [];
    const json = await res.json();
    const list = json.data || [];
    return list.filter((p) => String(p._id) !== String(excludeId)).slice(0, 4);
  } catch {
    return [];
  }
}

async function getRelatedPizzaBoxesProducts(currentProductId) {
  try {
    const res = await fetch("/api/v1/site-categories");
    const json = await res.json();
    const list = Array.isArray(json.data) ? json.data : [];
    const customSlice = list.find((c) => c.cardboardname === "Custom Pizza Slice Box" && c.parent_id != null);
    const pizzaBoxes = list.find(
      (c) => c.cardboardname === "Pizza Boxes" && c.parent_id != null && String(c.parent_id) === String(customSlice?.parent_id)
    );
    if (!pizzaBoxes?._id) return [];
    const catId = parseInt(pizzaBoxes._id, 10);
    const prodRes = await fetch(`/api/v1/getProducts/${catId}`);
    if (!prodRes.ok) return [];
    const prodJson = await prodRes.json();
    const prods = prodJson.data || [];
    return Array.isArray(prods) ? prods.slice(0, 4) : [];
  } catch {
    return [];
  }
}

const ProductDisplay = () => {
  const id = useParams().id;
  const [data, setData] = useState(null);
  const [materials, setMaterials] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    const run = async () => {
      const fetchedData = await getData(id);
      setData(fetchedData);
      const prod = fetchedData?.[0];
      if (prod?.mainType == null) return;
      if (prod.categoryName === "Custom Pizza Slice Box") {
        const related = await getRelatedPizzaBoxesProducts(prod._id);
        setSimilarProducts(related);
      } else {
        const similar = await getSimilarProducts(prod.mainType, prod._id);
        setSimilarProducts(similar);
      }
    };
    run();
  }, [id]);

  useEffect(() => {
    getMaterils().then(setMaterials);
  }, []);

  const product = data?.[0];
  const useAmazonLayout = product?.price_tiers && Array.isArray(product.price_tiers) && product.price_tiers.length > 0;

  if (!product) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (useAmazonLayout) {
    return <ProductPageAmazon product={product} similarProducts={similarProducts} />;
  }

  return (
    <div className="flex justify-between items-start flex-col mx-2 lg:flex-row xl:flex-row lg:mx-12 xl:mx-12">
      <div className="w-full md:w-full lg:w-1/2 xl:w-1/2 2xl:w-1/2">
        <ImagesContainer img={product.images} />
      </div>
      <div className="w-full md:w-full lg:w-1/2 xl:w-1/2 2xl:w-1/2">
        <ProductDP data={product} materials={materials} />
      </div>
    </div>
  );
};

export default ProductDisplay;