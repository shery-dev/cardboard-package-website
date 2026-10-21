"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const ShippingScene = dynamic(
  () => import("@/components/Manipulator/3dWork/ShippingScene"),
  { ssr: false, loading: () => <div className="min-h-[60vh] flex items-center justify-center text-gray-500">Loading...</div> }
);

export default function ShippingBoxPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-gray-500">Loading...</div>}>
      <ShippingScene />
    </Suspense>
  );
}