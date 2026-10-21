"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import CategoryHeader from "@/components/CardboardPage/CategoryHeader";
import CategoryProductGrid from "@/components/CardboardPage/CategoryProductGrid";

async function fetchCategory(id) {
  try {
    const res = await fetch(`/api/v1/categories/${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (e) {
    console.error("Failed to fetch category:", e);
    return null;
  }
}

async function fetchProducts(categoryId) {
  try {
    const res = await fetch(`/api/v1/getProducts/${categoryId}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (e) {
    console.error("Failed to fetch products:", e);
    return [];
  }
}

/** Fetches products for a category by id. Used by ConfiguratorForm and others. */
export async function getData(categoryId) {
  const id = typeof categoryId === "string" ? parseInt(categoryId, 10) : categoryId;
  if (!id || isNaN(id)) return [];
  return fetchProducts(id);
}

export default function CategoryProductsPage() {
  const params = useParams();
  const id = params?.id;
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const categoryId = parseInt(id, 10);
    if (isNaN(categoryId)) {
      setLoading(false);
      return;
    }
    Promise.all([fetchCategory(categoryId), fetchProducts(categoryId)])
      .then(([cat, prods]) => {
        setCategory(cat);
        setProducts(Array.isArray(prods) ? prods : []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="text-gray-600">Category not found.</p>
      </div>
    );
  }

  const categoryId = parseInt(id, 10);

  return (
    <>
      <CategoryHeader
        categoryName={category.cardboardname}
        descriptionLong={category.description_long || category.description}
        features={category.features}
        imgSrc={category.img}
      />
      <CategoryProductGrid
        apiProducts={products}
        categoryId={categoryId}
        categoryName={category.cardboardname}
      />
    </>
  );
}
