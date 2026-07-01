"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AramaSayfasiClient from "@/components/AramaSayfasiClient";

function AramaSayfasiIcerik() {
  const searchParams = useSearchParams();
  const arananKelime = searchParams.get("q") || "";
  return <AramaSayfasiClient initialQ={arananKelime} />;
}

export default function AramaSayfasi() {
  return (
    <Suspense fallback={<div className="bg-[#050814] min-h-screen" />}>
      <AramaSayfasiIcerik />
    </Suspense>
  );
}
