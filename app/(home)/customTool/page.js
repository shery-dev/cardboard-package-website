"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const Scene = dynamic(
  () => import("@/components/Manipulator/3dWork/Scene"),
  { ssr: false, loading: () => <div className="min-h-[60vh] flex items-center justify-center text-gray-500">Loading 3D...</div> }
);

export default function CustomToolPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-gray-500">Loading...</div>}>
      <Scene />
    </Suspense>
  );
}
