// CategoryCarousel.tsx
// Horizontal scrollable list of product categories
// Mobile-first, works on desktop too.

import { use } from "react";
import Link from "next/link";
import { getProductCategories } from "@/lib/search";

interface Category {
  id: number;
  name: string | null;
  name_es: string | null;
  name_en: string | null;
}

interface Props {
  locale: string;
  categories?: Category[];
  className?: string;
}

export default function CategoryCarousel({ locale, categories, className = "" }: Props) {
  const cats: Category[] = categories ?? use(getProductCategories(locale));

  const displayName = (cat: Category) => {
    if (locale === "es") return cat.name_es ?? cat.name ?? "";
    return cat.name_en ?? cat.name ?? "";
  };

  if (cats.length === 0) return null;

  return (
    <div className={`overflow-x-auto whitespace-nowrap scrollbar-hide max-w-[1500px] my-0 mx-auto w-full ${className}`}>
      <div className="flex space-x-2 sm:items-center sm:justify-center px-2 sm:px-0">
        {cats.map((cat, index) => {
          const name = displayName(cat);
          const href = `/search?category=${cat.id}`;
          return (
            <Link
              key={cat.id}
              href={href}
              className={`flex-shrink-0 text-sm font-medium text-[#F5F1EB] bg-[#2D2D2D] hover:bg-[#3A3A3A] hover:text-[#C9A962] px-3 py-1 rounded-lg transition-colors border border-[#C9A962]/20 hover:border-[#C9A962]/40 ${index === 0 ? "max-sm:ml-0" : ""} ${index === cats.length - 1 ? "max-sm:mr-0" : ""}`}
            >
              {name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
