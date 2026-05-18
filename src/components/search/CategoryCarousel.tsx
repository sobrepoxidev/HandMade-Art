// CategoryCarousel.tsx
// Editorial category navigation.
// Desktop (≥ lg): wraps into multiple rows if needed — no hidden horizontal scroll.
// Mobile (< lg): horizontal snap scroll (works naturally with touch).

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
      className={`w-full bg-[#FAF6EF] border-y border-[#E8E4E0] ${className}`}
    >
      <ul
        className="
          mx-auto w-full max-w-screen-2xl
          flex items-center
          flex-nowrap overflow-x-auto whitespace-nowrap scrollbar-hide snap-x snap-mandatory
          lg:flex-wrap lg:overflow-visible lg:whitespace-normal lg:justify-center
          px-3 sm:px-6 lg:px-4 xl:px-8
          font-display
        "
      >
        {cats.map((cat) => {
          const name = displayName(cat);
          const href = `/search?category=${cat.id}`;
          return (
            <li key={cat.id} className="snap-start shrink-0 lg:shrink">
              <Link
                href={href}
                className="
                  inline-flex items-center
                  min-h-[48px] px-3 sm:px-3.5 lg:px-3
                  text-[14px] tracking-[0.005em]
                  text-[#2D2D2D] hover:text-[#A08848]
                  transition-colors duration-200
                  border-b-2 border-transparent
                  hover:border-[#C9A962]/45
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
