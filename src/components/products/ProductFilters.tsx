'use client';

import { useState, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Check, ChevronDown, ChevronUp, Sliders } from 'lucide-react';
import { Database } from '@/types-db';

type Category = Database['categories'];

interface FilterProps {
  categories: Category[];
  brands: string[];
  tags: string[];
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
      <div className="border-b border-gray-200">
        <button 
          className="flex w-full items-center justify-between text-lg font-medium text-gray-900 mb-2"
          onClick={() => setCategoryOpen(!categoryOpen)}
        >
          {locale === 'es' ? 'Categorías' : 'Categories'}
          {categoryOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        
        {categoryOpen && (
          <div className="mt-2 space-y-1">
            <button 
              onClick={() => updateFilters({ category: null })}
              className={`flex items-center w-full px-2 py-1.5 text-sm rounded-md ${
                !selectedCategory ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex-1 text-left">{locale === 'es' ? 'Todas las categorías' : 'All categories'}</span>
              {!selectedCategory && <Check className="h-4 w-4" />}
            </button>
            
            {categories.map((category) => (
              <button 
                key={category.id}
                onClick={() => updateFilters({ category: String(category.id) })}
                className={`flex items-center w-full px-2 py-1.5 text-sm rounded-md ${
                  selectedCategory === String(category.id) ? 'bg-teal-50 text-teal-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
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
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="flex items-center justify-center w-full py-2 px-4 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-700"
        >
          <Sliders className="h-4 w-4 mr-2" />
          {locale === 'es' ? 'Filtrar productos' : 'Filter products'}
        </button>
        
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-40 overflow-y-auto bg-black bg-opacity-25">
            <div className="relative bg-white p-4 w-full max-w-lg mx-auto mt-10 rounded-t-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">{locale === 'es' ? 'Filtros' : 'Filters'}</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
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