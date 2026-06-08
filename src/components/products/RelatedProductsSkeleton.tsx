type Props = {
  title: string;
  count?: number;
};

export default function RelatedProductsSkeleton({ title, count = 8 }: Props) {
  return (
    <section className="mt-12 overflow-hidden rounded-sm border border-[#E8E4E0] bg-[#FAF6EF]">
      <header className="px-5 py-3 bg-[#2D2D2D] text-[#C9A962] text-sm font-semibold tracking-wide border-b border-[#C9A962]/20">
        {title}
      </header>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-sm border border-[#E8E4E0] bg-[#FAF6EF]"
          >
            <div className="aspect-square bg-[#F0EBE3] animate-pulse" />
            <div className="p-4 flex flex-col gap-3">
              <div className="h-4 bg-[#E8E4E0] rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-[#E8E4E0] rounded animate-pulse" />
              <div className="h-5 w-1/2 bg-[#E8E4E0] rounded animate-pulse mt-1" />
              <div className="h-9 bg-[#E8E4E0] rounded animate-pulse mt-2" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
