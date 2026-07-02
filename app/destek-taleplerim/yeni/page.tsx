import { Suspense } from "react";
import YeniTalepIcerik from "./YeniTalepIcerik";

export default function YeniDestekTalepPage() {
  return (
    <Suspense
      fallback={
        <div className="site-page flex min-h-[50vh] items-center justify-center p-8 text-slate-400 text-sm font-bold uppercase tracking-widest">
          Yükleniyor...
        </div>
      }
    >
      <YeniTalepIcerik />
    </Suspense>
  );
}
