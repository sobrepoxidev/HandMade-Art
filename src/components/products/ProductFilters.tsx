'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Check, ChevronDown, ChevronUp, Sliders } from 'lucide-react';
import { Database } from '@/lib/database.types';

type Category = Database['public']['Tables']['categories']['Row'];

interface FilterProps {
  categories: Category[];
  isMobile?: boolean;
  locale: string;
}

export default function ProductFilters({ 
  categories, 
  isMobile = false,
  locale
}: FilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // State for UI toggles
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Get current filter values from URL
  const selectedCategory = searchParams.get('category');

  // Memoize the filter content to prevent unnecessary re-renders
  const updateFilters = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    
    // Always reset to first page when filters change
    params.set('page', '1');
    
    // Update URL without page reload
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, router, pathname]);

  // Filter content component
  const filterContent = useMemo(() => (
    <div className="space-y-2">
      {/* Categories Section */}
      <div className="border-b border-[#3A2E24] pb-3">
        <button 
          type="button"
          className="mb-2 flex min-h-[44px] w-full items-center justify-between text-sm font-semibold text-[#F1E7D6]"
          onClick={() => setCategoryOpen(!categoryOpen)}
          aria-expanded={categoryOpen}
        >
          {locale === 'es' ? 'Categorías' : 'Categories'}
          {categoryOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        
        {categoryOpen && (
          <div className="mt-2 space-y-1">
            <button 
              type="button"
              onClick={() => updateFilters({ category: null })}
              className={`flex min-h-[40px] w-full items-center rounded-sm px-2 py-1.5 text-sm ${
                !selectedCategory ? 'bg-[#1E1813] text-[#F3C56B] font-medium' : 'text-[#C9BBA5] hover:bg-[#1E1813]'
              }`}
            >
              <span className="flex-1 text-left">{locale === 'es' ? 'Todas las categorías' : 'All categories'}</span>
              {!selectedCategory && <Check className="h-4 w-4" />}
            </button>
            
            {categories.map((category) => (
              <button 
                type="button"
                key={category.id}
                onClick={() => updateFilters({ category: String(category.id) })}
                className={`flex min-h-[40px] w-full items-center rounded-sm px-2 py-1.5 text-sm ${
                  selectedCategory === String(category.id) ? 'bg-[#1E1813] text-[#F3C56B] font-medium' : 'text-[#C9BBA5] hover:bg-[#1E1813]'
                }`}
              >
                <span className="flex-1 text-left">{locale === 'es' ? category.name_es : category.name_en}</span>
                {selectedCategory === String(category.id) && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  ), [categories, categoryOpen, selectedCategory, updateFilters, locale]);

  // Mobile view
  if (isMobile) {
    return (
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex min-h-[44px] w-full items-center justify-center rounded-sm border border-[#3A2E24] bg-[#161210] px-4 py-2 text-sm font-medium text-[#F1E7D6]"
        >
          <Sliders className="h-4 w-4 mr-2" />
          {locale === 'es' ? 'Filtrar productos' : 'Filter products'}
        </button>
        
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-40 overflow-y-auto bg-[#0F0C0A]/70">
            <div className="relative mx-auto mt-10 w-full max-w-lg border border-[#3A2E24] bg-[#161210] p-4 shadow-[0_12px_36px_-18px_rgba(61,46,32,0.30)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl font-medium text-[#F1E7D6]">{locale === 'es' ? 'Filtros' : 'Filters'}</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="grid h-11 w-11 place-items-center rounded-sm text-[#F1E7D6] hover:bg-[#1E1813]"
                >
                  <span className="sr-only">{locale === 'es' ? 'Cerrar panel' : 'Close panel'}</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {filterContent}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Desktop view
  return (
    <div className="hidden md:block">
      {filterContent}
    </div>
  );
}
