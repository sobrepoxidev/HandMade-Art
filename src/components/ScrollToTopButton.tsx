"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const locale = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={locale === 'es' ? 'Volver arriba' : 'Scroll to top'}
      className="hidden md:inline-flex items-center gap-1.5 fixed bottom-2 right-8 z-50
                 min-h-[44px] px-4 py-2 rounded-full text-sm font-medium
                 bg-[#2D2D2D] text-[#F5F1EB] border border-[#F5F1EB]/15 shadow-lg
                 hover:bg-[#1A1A1A] hover:border-[#C9A962]/50
                 transition-colors duration-200 animate-fade-in"
    >
      <ArrowUp className="h-4 w-4" strokeWidth={2} aria-hidden />
      {locale === 'es' ? 'Arriba' : 'Top'}
    </button>
  );
}
