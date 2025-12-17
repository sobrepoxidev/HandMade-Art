

// app/(web)/gallery/loading.tsx
import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-white to-[#F5F1EB] p-4">
      <div className="grid w-full max-w-7xl mx-auto grid-cols-2 gap-2 pt-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-[#E8E4E0] bg-[#FAF8F5] shadow-sm transition-transform duration-300">
      <div className="relative h-48 w-full overflow-hidden bg-white" style={{ aspectRatio: '4/3' }}>
        <div className="absolute inset-0 animate-pulse bg-[#E8E4E0]"></div>
      </div>

      <div className="flex flex-grow animate-pulse flex-col p-3">
        <div className="mx-auto mb-2 h-3 w-2/3 rounded bg-[#E8E4E0]"></div>
        <div className="mx-auto mb-2 h-3 w-2/5 rounded bg-[#F5F1EB]"></div>

        <div className="flex justify-center items-center mt-2">
          <div className="mx-auto mb-2 flex flex-row h-10 w-3/6 items-center border rounded-lg border-[#E8E4E0] overflow-hidden">
            <div className="px-3 py-2 w-1/3 text-[#E8E4E0] h-10">−</div>
            <div className="px-3 h-10 w-1/3"></div>
            <div className="px-3 py-2 w-1/3 text-[#E8E4E0] h-10">+</div>
          </div>
        </div>

        <div className="mx-auto mt-auto h-10 w-3/6 rounded-lg bg-gradient-to-r from-[#C9A962]/50 to-[#A08848]/50"></div>
      </div>
    </div>
  );
}

