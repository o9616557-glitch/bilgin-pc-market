"use client";

import dynamic from "next/dynamic";

const ComparePopup = dynamic(() => import("@/app/ComparePopup"), { ssr: false });

export default function LazyComparePopup() {
  return <ComparePopup />;
}
