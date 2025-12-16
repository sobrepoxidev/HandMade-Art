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
  onClose?: () => void;
  className?: string;
  locale: string;
}

type Category = { id: number; name: string; name_es: string | null; name_en: string | null };

export default function SearchBar({
  variant,
  initialQuery = '',
  initialCategory = 'Todo',
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
  const [categories, setCategories] = useState<Category[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchCategories() {
      const categoryList = await getProductCategories(locale);
      setCategories(categoryList);
    }

    fetchCategories();
  }, [locale]);

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
  }, [debouncedQuery, selectedCategory]);

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

  return (
    <div
      ref={searchRef}
      className={`z-40 relative w-full ${className}`}
      style={{
        zIndex: 40,
        position: 'relative'
      }}
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
            className={`flex items-center justify-between w-full h-10 px-3 text-sm text-[#F5F1EB] bg-[#2D2D2D] border border-r-0 border-[#C9A962]/30 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#C9A962] focus:border-[#C9A962] transition-colors ${
              isMobile ? 'w-24' : isNavbar ? 'w-32' : 'w-40'
            }`}
            aria-expanded={isCategoryMenuOpen}
            aria-haspopup="true"
          >
            <span className="max-w-[100px] truncate category-trigger">{selectedCategory}</span>
            <ChevronDown className={`h-4 w-4 category-trigger text-[#C9A962] transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCategoryMenuOpen && (
            <div
              ref={categoryMenuRef}
              className="absolute left-0 top-full w-56 border border-[#C9A962]/20 bg-[#2D2D2D] shadow-xl rounded-lg overflow-hidden"
              role="menu"
              onClick={(e) => e.stopPropagation()}
              style={{
                zIndex: 50,
                position: 'absolute',
              }}
            >
              <ul className="py-1 max-h-[60vh] overflow-y-auto">
                <li>
                  <button
                    type="button"
                    className="block w-full px-4 py-2.5 text-left text-sm text-[#F5F1EB] hover:bg-[#3A3A3A] hover:text-[#C9A962] transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedCategory('Todas');
                      setIsCategoryMenuOpen(false);

                      if (variant !== 'navbar' && inputRef.current) {
                        setTimeout(() => {
                          inputRef.current?.focus();
                        }, 50);
                      }
                    }}
                  >
                    {locale === 'es' ? 'Todas las categorías' : 'All categories'}
                  </button>
                </li>
                {categories.map((cat) => {
                  const displayName = locale === 'es' ? cat.name_es : cat.name_en || cat.name;
                  return (
                    <li key={cat.id}>
                      <button
                        type="button"
                        className="block w-full px-4 py-2.5 text-left text-sm text-[#F5F1EB] hover:bg-[#3A3A3A] hover:text-[#C9A962] transition-colors"
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
        <input
          type="text"
          placeholder={locale === 'es' ? 'Buscar productos...' : 'Search products...'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          className={`flex-1 h-10 px-4 py-2 text-sm text-[#2D2D2D] bg-white border border-[#E8E4E0] focus:ring-2 focus:ring-[#C9A962] focus:border-[#C9A962] placeholder-[#9C9589] transition-colors ${
            isMobile ? 'w-full' : isNavbar ? 'w-full' : 'w-96'
          }`}
          ref={inputRef}
        />

        {/* Search button */}
        <button
          type="submit"
          className="flex h-10 w-11 items-center justify-center bg-gradient-to-r from-[#C9A962] to-[#A08848] text-[#1A1A1A] hover:from-[#D4C4A8] hover:to-[#C9A962] border-0 rounded-r-lg transition-all"
          aria-label="Buscar"
        >
          <Search className="h-5 w-5" />
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
