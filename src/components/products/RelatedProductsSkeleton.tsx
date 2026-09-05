type Props = {
  title: string;
  count?: number;
};

export default function RelatedProductsSkeleton({ title, count = 8 }: Props) {
  return (
    <section className="mt-12 overflow-hidden rounded-sm border border-[#3A2E24] bg-[#161210]">
      <header className="px-5 py-3 bg-[#161210] text-[#E0A83A] text-sm font-semibold tracking-wide border-b border-[#E0A83A]/20">
        {title}
      </header>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-sm border border-[#3A2E24] bg-[#161210]"
          >
            <div className="aspect-square bg-[#F1E7D6] animate-pulse" />
            <div className="p-4 flex flex-col gap-3">
              <div className="h-4 bg-[#3A2E24] rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-[#3A2E24] rounded animate-pulse" />
              <div className="h-5 w-1/2 bg-[#3A2E24] rounded animate-pulse mt-1" />
              <div className="h-9 bg-[#3A2E24] rounded animate-pulse mt-2" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
