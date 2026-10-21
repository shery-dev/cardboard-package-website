"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const PizzaScene = dynamic(
  () => import("@/components/Manipulator/3dWork/PizzaScene"),
  { ssr: false, loading: () => <div className="min-h-[60vh] flex items-center justify-center text-gray-500">Loading...</div> }
);

export default function PizzaBoxPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-gray-500">Loading...</div>}>
      <PizzaScene />
    </Suspense>
  );
}