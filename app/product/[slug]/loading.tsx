export default function ProductLoading() {
  return (
    <div className="bg-[#050814] md:bg-[#050505] text-white min-h-[70vh]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-pulse">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-10">
          <div className="w-full md:w-[45%] aspect-square bg-white/[0.04] sm:rounded-2xl" />
          <div className="flex-1 space-y-4 pt-2">
            <div className="h-3 w-28 bg-white/[0.06] rounded" />
            <div className="h-8 sm:h-10 w-full bg-white/[0.06] rounded" />
            <div className="h-28 w-full bg-white/[0.04] rounded-2xl mt-4" />
            <div className="h-12 w-40 bg-white/[0.06] rounded-xl mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
