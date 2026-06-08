'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

export default function PaginationControls({
  currentPage,
  totalPages,
}: PaginationControlsProps) {
  const searchParams = useSearchParams();
  const locale = useLocale();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    params.delete('id');
    return `?${params.toString()}`;
  };

  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const showPrev = currentPage > 1;
  const showNext = currentPage < totalPages;

  return (
    <nav
      className="mt-8 mb-4 flex flex-wrap items-center justify-center gap-3"
      aria-label={locale === 'es' ? 'Paginación' : 'Pagination'}
    >
      <Link
        href={showPrev ? createPageURL(prevPage) : '#'}
        className={`inline-flex min-h-[44px] items-center rounded-sm border px-4 py-2 text-sm font-medium transition-colors ${
          showPrev
            ? 'border-[#E8E4E0] bg-[#FAF6EF] text-[#2D2D2D] hover:border-[#A08848] hover:text-[#A08848]'
            : 'pointer-events-none border-[#E8E4E0] bg-[#F5F1EB] text-[#6B6459]'
        }`}
        aria-disabled={!showPrev}
      >
        {locale === 'es' ? 'Anterior' : 'Previous'}
      </Link>

      <span className="text-sm font-medium tabular-nums text-[#4A4A4A]">
        {locale === 'es' ? 'Página' : 'Page'} {currentPage} {locale === 'es' ? 'de' : 'of'} {totalPages}
      </span>

      <Link
        href={showNext ? createPageURL(nextPage) : '#'}
        className={`inline-flex min-h-[44px] items-center rounded-sm border px-4 py-2 text-sm font-medium transition-colors ${
          showNext
            ? 'border-[#E8E4E0] bg-[#FAF6EF] text-[#2D2D2D] hover:border-[#A08848] hover:text-[#A08848]'
            : 'pointer-events-none border-[#E8E4E0] bg-[#F5F1EB] text-[#6B6459]'
        }`}
        aria-disabled={!showNext}
      >
        {locale === 'es' ? 'Siguiente' : 'Next'}
      </Link>
    </nav>
  );
}
