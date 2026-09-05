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
            ? 'border-[#3A2E24] bg-[#161210] text-[#F1E7D6] hover:border-[#F3C56B] hover:text-[#F3C56B]'
            : 'pointer-events-none border-[#3A2E24] bg-[#1E1813] text-[#8C7F6E]'
        }`}
        aria-disabled={!showPrev}
      >
        {locale === 'es' ? 'Anterior' : 'Previous'}
      </Link>

      <span className="text-sm font-medium tabular-nums text-[#C9BBA5]">
        {locale === 'es' ? 'Página' : 'Page'} {currentPage} {locale === 'es' ? 'de' : 'of'} {totalPages}
      </span>

      <Link
        href={showNext ? createPageURL(nextPage) : '#'}
        className={`inline-flex min-h-[44px] items-center rounded-sm border px-4 py-2 text-sm font-medium transition-colors ${
          showNext
            ? 'border-[#3A2E24] bg-[#161210] text-[#F1E7D6] hover:border-[#F3C56B] hover:text-[#F3C56B]'
            : 'pointer-events-none border-[#3A2E24] bg-[#1E1813] text-[#8C7F6E]'
        }`}
        aria-disabled={!showNext}
      >
        {locale === 'es' ? 'Siguiente' : 'Next'}
      </Link>
    </nav>
  );
}
