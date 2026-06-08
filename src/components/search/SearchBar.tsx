'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown } from 'lucide-react';
import { SearchResult, searchProducts, getProductCategories } from '@/lib/search';
import SearchSuggestions from './SearchSuggestions';

interface SearchBarProps {
  variant: 'navbar' | 'standalone' | 'mobile';
  initialQuery?: string;
  initialCategory?: string;
  initialCategories?: Category[];
  onClose?: () => void;
  className?: string;
  locale: string;
}

type Category = { id: number; name: string; name_es: string | null; name_en: string | null };

export default function SearchBar({
  variant,
  initialQuery = '',
  initialCategory = 'Todo',
  initialCategories = [],
  onClose,
  className = '',
  locale
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialCategories.length > 0) return;

    async function fetchCategories() {
      const categoryList = await getProductCategories(locale);
      setCategories(categoryList);
    }

    fetchCategories();
  }, [initialCategories.length, locale]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    async function performSearch() {
      if (debouncedQuery.length < 2) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { results } = await searchProducts(
          debouncedQuery,
          locale,
          (selectedCategory == 'Todo' || selectedCategory == 'All') ? undefined : selectedCategory,
          10,
          12,
          'relevance',
          false,
        );

        setSearchResults(results);

        if (debouncedQuery.length >= 2) {
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();
  }, [debouncedQuery, selectedCategory, locale]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }

      const target = event.target as Node;
      const isClickOnTrigger = target instanceof Element &&
        (target.classList.contains('category-trigger') ||
         target.closest('.category-trigger') !== null);

      if (categoryMenuRef.current && !isClickOnTrigger && !categoryMenuRef.current.contains(target)) {
        setIsCategoryMenuOpen(false);
      }
    }

    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setShowSuggestions(false);
        setIsCategoryMenuOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (query.trim().length < 2) return;

    const searchParams = new URLSearchParams();
    searchParams.set('q', query);
    if (selectedCategory !== 'Todo' && selectedCategoryId) {
      searchParams.set('category', selectedCategory);
      searchParams.set('categoryId', selectedCategoryId.toString());
    }

    router.push(`/search?${searchParams.toString()}`);
    setShowSuggestions(false);

    if (onClose) {
      onClose();
    }
  }

  const handleCategorySelect = (category: Category) => {
    const displayName = locale === 'es' ? (category.name_es ?? category.name) : (category.name_en ?? category.name);
    setSelectedCategory(displayName);
    setSelectedCategoryId(category.id);
    setIsCategoryMenuOpen(false);

    if (variant !== 'navbar' && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  const isNavbar = variant === 'navbar';
  const isMobile = variant === 'mobile';

  useEffect(() => {
    const handleResize = () => {
      if (isCategoryMenuOpen) {
        setIsCategoryMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCategoryMenuOpen]);

  const isEs = locale === 'es';
  const inputId = `search-input-${variant}`;
  const listboxId = `search-categories-${variant}`;

  return (
    <div
      ref={searchRef}
      className={`z-40 relative w-full ${className}`}
      style={{ zIndex: 40, position: 'relative' }}
      role="search"
    >
      <form onSubmit={handleSubmit} className="flex w-full" style={{ position: 'relative' }}>
        {/* Category dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              setIsCategoryMenuOpen(!isCategoryMenuOpen);
              e.preventDefault();
              e.stopPropagation();
            }}
            className={`flex items-center justify-between w-full h-11 px-3 text-sm text-[#F5F1EB] bg-[#2D2D2D] border border-r-0 border-[#C9A962]/30 rounded-l-sm hover:bg-[#1A1A1A] transition-colors ${
              isMobile ? 'w-24' : isNavbar ? 'w-32' : 'w-40'
            }`}
            aria-expanded={isCategoryMenuOpen}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            aria-label={isEs ? `Categoría: ${selectedCategory}. Cambiar.` : `Category: ${selectedCategory}. Change.`}
          >
            <span className="max-w-[100px] truncate category-trigger">{selectedCategory}</span>
            <ChevronDown
              className={`h-4 w-4 category-trigger text-[#C9A962] transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`}
              strokeWidth={2}
              aria-hidden
            />
          </button>

          {isCategoryMenuOpen && (
            <div
              ref={categoryMenuRef}
              id={listboxId}
              role="listbox"
              aria-label={isEs ? 'Categorías' : 'Categories'}
              className="absolute left-0 top-full w-56 border border-[#C9A962]/25 bg-[#2D2D2D] shadow-xl rounded-sm overflow-hidden mt-1"
              onClick={(e) => e.stopPropagation()}
              style={{ zIndex: 50, position: 'absolute' }}
            >
              <ul className="py-1 max-h-[60vh] overflow-y-auto">
                <li role="option" aria-selected={selectedCategory === 'Todas' || selectedCategory === 'All'}>
                  <button
                    type="button"
                    className="block w-full px-4 py-2.5 text-left text-sm text-[#F5F1EB] hover:bg-[#3A3A3A] hover:text-[#C9A962] transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedCategory(isEs ? 'Todas' : 'All');
                      setIsCategoryMenuOpen(false);
                      if (variant !== 'navbar' && inputRef.current) {
                        setTimeout(() => inputRef.current?.focus(), 50);
                      }
                    }}
                  >
                    {isEs ? 'Todas las categorías' : 'All categories'}
                  </button>
                </li>
                {categories.map((cat) => {
                  const displayName = isEs ? cat.name_es : cat.name_en || cat.name;
                  const isSelected = selectedCategory === displayName;
                  return (
                    <li key={cat.id} role="option" aria-selected={isSelected}>
                      <button
                        type="button"
                        className={`block w-full px-4 py-2.5 text-left text-sm transition-colors ${
                          isSelected
                            ? 'bg-[#3A3A3A] text-[#C9A962]'
                            : 'text-[#F5F1EB] hover:bg-[#3A3A3A] hover:text-[#C9A962]'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCategorySelect(cat);
                        }}
                      >
                        {displayName}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Search input */}
        <label htmlFor={inputId} className="sr-only">
          {isEs ? 'Buscar productos' : 'Search products'}
        </label>
        <input
          id={inputId}
          type="search"
          autoComplete="off"
          placeholder={isEs ? 'Buscar productos…' : 'Search products…'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          className={`flex-1 h-11 px-4 py-2 text-sm text-[#2D2D2D] bg-[#FAF6EF] border border-[#E8E4E0] focus:outline-none focus:border-[#A08848] focus:ring-2 focus:ring-[#A08848]/25 placeholder-[#6B6459] transition-colors ${
            isMobile ? 'w-full' : isNavbar ? 'w-full' : 'w-96'
          }`}
          ref={inputRef}
        />

        {/* Search button */}
        <button
          type="submit"
          className="grid place-items-center h-11 w-11 bg-[#C9A962] text-[#1A1A1A] hover:bg-[#A08848] hover:text-[#F5F1EB] border-0 rounded-r-sm transition-colors"
          aria-label={isEs ? 'Buscar' : 'Search'}
        >
          <Search className="h-5 w-5" strokeWidth={2} aria-hidden />
        </button>
      </form>

      {/* Search suggestions */}
      {showSuggestions && query.length >= 2 && (
        <div style={{
          zIndex: 9998,
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          width: '100%'
        }}>
          <SearchSuggestions
            query={query}
            category={selectedCategory}
            results={searchResults}
            loading={isLoading}
            onClose={() => setShowSuggestions(false)}
            variant={variant}
            locale={locale}
          />
        </div>
      )}
    </div>
  );
}
