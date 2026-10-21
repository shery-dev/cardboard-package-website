"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiViewList } from "react-icons/hi";

async function getCategories() {
  try {
    const res = await fetch("/api/v1/cardboard-types", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch");
    const json = await res.json();
    return json?.data ?? [];
  } catch (e) {
    return [];
  }
}

export default function AdminProductsListPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <div className="flex flex-col gap-6 py-8 px-4">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
        <p className="text-gray-600 mt-1">Select a category to view and manage products.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`/admin/products/list/${cat._id}`}
            className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <div className="shrink-0">
              <Image
                height={48}
                width={48}
                alt=""
                src={cat?.img?.[0]?.startsWith("/") ? cat.img[0] : cat?.img?.[0] ? `/api/v1/fetchImg/${cat.img[0]}` : "/img/logo.svg"}
                className="rounded-lg object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 truncate">{cat?.cardboardname}</p>
              <p className="text-sm text-gray-500 truncate">{cat?.description}</p>
            </div>
            <HiViewList className="w-5 h-5 text-gray-400 shrink-0" />
          </Link>
        ))}
      </div>
      {categories.length === 0 && (
        <p className="text-gray-500">No categories yet. Add categories first, then add products under each.</p>
      )}
    </div>
  );
}
