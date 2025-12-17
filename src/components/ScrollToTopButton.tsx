"use client";
import React from "react";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

export default function ScrollToTopButton() {
  const locale = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-1 right-8 z-50 bg-gradient-to-r from-[#C9A962] to-[#A08848] text-[#1A1A1A] px-3 py-1.5 rounded-full shadow-lg hover:from-[#D4C4A8] hover:to-[#C9A962] transition-all hidden md:block animate-fade-in text-sm font-medium"
      aria-label="Volver arriba"
      tabIndex={0}
    >
      ↑ {locale === 'es' ? ' Arriba' : ' Top'}
    </button>
  );
}

