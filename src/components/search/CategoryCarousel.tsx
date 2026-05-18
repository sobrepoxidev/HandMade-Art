// CategoryCarousel.tsx
// Editorial category navigation — replaces the old dark-pill chips.
// Functional (still clearly clickable) but reads like a boutique masthead.

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

export default function CategoryCarousel({
  locale,
  categories,
  className = "",
}: Props) {
  const cats: Category[] = categories ?? use(getProductCategories(locale));

  const displayName = (cat: Category) => {
    if (locale === "es") return cat.name_es ?? cat.name ?? "";
    return cat.name_en ?? cat.name ?? "";
  };

  if (cats.length === 0) return null;

  return (
    <nav
      aria-label={locale === "es" ? "Categorías" : "Categories"}
      className={`bg-[#FAF6EF] border-y border-[#E8E4E0] ${className}`}
    >
      <ul
        className="
          mx-auto max-w-[1500px] w-full
          flex items-center
          overflow-x-auto whitespace-nowrap scrollbar-hide snap-x
          px-3 sm:px-6 lg:px-10
          divide-x divide-[#E8E4E0]
          font-display
        "
      >
        {cats.map((cat) => {
          const name = displayName(cat);
          const href = `/search?category=${cat.id}`;
          return (
            <li key={cat.id} className="snap-start flex-shrink-0">
              <Link
                href={href}
                className="
                  inline-flex items-center
                  min-h-[56px] px-4 sm:px-5
                  text-[14px] tracking-[0.005em]
                  text-[#2D2D2D] hover:text-[#A08848]
                  transition-colors duration-200
                  border-b-2 border-transparent
                  hover:border-[#C9A962]/40
                "
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
