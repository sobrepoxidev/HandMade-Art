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
  
  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      const categoryList = await getProductCategories(locale);
      console.log("Categories:", categoryList);
      setCategories(categoryList);
    }
    
    fetchCategories();
  }, [locale]);
  
  // Debounce search query con tiempo más corto para mejor respuesta
  useEffect(() => {
    console.log('Query cambiada:', query); // Logging para debuggear
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200); // 200ms debounce para mejor respuesta
    
    return () => clearTimeout(timer);
  }, [query]);
  
  // Perform search when debounced query changes - implementación mejorada para desktop
  useEffect(() => {
    async function performSearch() {
      console.log('Realizando búsqueda:', debouncedQuery, selectedCategory); // Debug
      
      if (debouncedQuery.length < 2) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Búsqueda real para autocompletado (usando isPaginated=false)
        const { results } = await searchProducts(
          debouncedQuery,
          locale,
          (selectedCategory == 'Todo' || selectedCategory == 'All') ? undefined : selectedCategory,
          10,  // Límite de resultados
          12,  // Valor por defecto para limit
          'relevance', // Ordenar por relevancia
          false, // isPaginated=false para autocompletado
          
        );
        
        console.log('Resultados encontrados:', results.length);
        setSearchResults(results);
        
        // Siempre mostrar sugerencias si tenemos al menos 2 caracteres, independientemente de los resultados
        if (debouncedQuery.length >= 2) {
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    // Siempre realizar búsqueda cuando cambia la consulta
    performSearch();
  }, [debouncedQuery, selectedCategory]);
  
  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close search suggestions when clicking outside
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      
      // Close category menu when clicking outside, but not when clicking the trigger button
      const target = event.target as Node;
      const isClickOnTrigger = target instanceof Element && 
        (target.classList.contains('category-trigger') || 
         target.closest('.category-trigger') !== null);
      
      if (categoryMenuRef.current && !isClickOnTrigger && !categoryMenuRef.current.contains(target)) {
        setIsCategoryMenuOpen(false);
      }
    }
    
    // Add a small delay to ensure the DOM is fully updated
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle escape key to close suggestions
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
  
  // Handle search form submission
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    // No hacer nada si la consulta está vacía
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
  
  // Handle category selection
  const handleCategorySelect = (category: Category) => {
    console.log('Selected category:', category);
    const displayName = locale === 'es' ? (category.name_es ?? category.name) : (category.name_en ?? category.name);
    setSelectedCategory(displayName);
    setSelectedCategoryId(category.id);
    setIsCategoryMenuOpen(false);
    
    // Focus input after selection
    if (variant !== 'navbar' && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };
  
  // Apply different styles and behaviors based on variant
  const isNavbar = variant === 'navbar';
  const isStandalone = variant === 'standalone';
  const isMobile = variant === 'mobile';
  
  // Adjust behavior based on variant
  useEffect(() => {
    // For desktop navbar, make sure the dropdown works properly
    const handleResize = () => {
      // Close dropdown when resizing window
      if (isCategoryMenuOpen) {
        setIsCategoryMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCategoryMenuOpen]);
  

      // For desktop layout, handle different styling
      // Z-index is handled directly in the component styles
  
  return (
    <div 
      ref={searchRef} 
      className={`z-40 relative w-full ${isStandalone ? 'standalone-search' : 'navbar-search'} ${className}`} 
      style={{ 
        zIndex: 40, // Z-index extremadamente alto para desktop
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
              e.preventDefault(); // Prevent form submission
              e.stopPropagation(); // Stop event propagation
              // En móvil no enfocar automáticamente el input
              // Esto previene que el dropdown se cierre inmediatamente
            }}
            className={`flex items-center justify-between w-full h-10 px-3 text-sm text-white bg-[#303030] border border-r-0 border-gray-500 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
              isMobile ? 'w-24' : isNavbar ? 'w-32' : 'w-40'
            }`}
            aria-expanded={isCategoryMenuOpen}
            aria-haspopup="true"
          >
            <span className="max-w-[100px] truncate category-trigger">{selectedCategory}</span>
            <ChevronDown className="h-4 w-4 category-trigger" />
          </button>
          
          {isCategoryMenuOpen && (
            <div
              ref={categoryMenuRef}
              className={`absolute left-0 top-full w-56 border border-gray-200 bg-white shadow-lg ${isNavbar ? 'navbar-dropdown' : 'standalone-dropdown'}`}
              role="menu"
              onClick={(e) => e.stopPropagation()}
              style={{ 
                zIndex: 40, // Z-index extremadamente alto
                position: 'absolute',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            >
              <ul className="py-1 max-h-[60vh] overflow-y-auto">
                <li>
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-100 bg-[#303030] "
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedCategory('Todas');
                      setIsCategoryMenuOpen(false);
                      
                      // Solo enfocamos el input en la versión standalone, no en la de navbar móvil
                      if (variant !== 'navbar' && inputRef.current) {
                        // Agregamos un pequeño retraso para evitar conflictos de eventos
                        setTimeout(() => {
                          inputRef.current?.focus();
                        }, 50);
                      }
                    }}
                  >
                    {locale ===  'es' ? 'Todas las categorías' : 'All categories'}
                  </button>
                </li>
                {categories.map((cat) => {
                  const displayName = locale === 'es' ? cat.name_es : cat.name_en || cat.name;
                  return (
                    <li key={cat.id}>
                      <button
                        type="button"
                        className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-100 bg-[#303030]"
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
          className={`flex-1 h-10 px-3 py-2 text-sm text-white bg-[#303030] border border-gray-500 focus:ring-teal-500 focus:border-teal-500 ${
            isMobile ? 'w-full' : isNavbar ? 'w-full' : 'w-96'
          }`}
          ref={inputRef}
        />
        
        {/* Search button */}
        <button
          type="submit"
          className="flex h-10 w-10 items-center justify-center bg-teal-600 text-white hover:bg-teal-700 border border-gray-500 border-l-0 rounded-r-md"
          aria-label="Buscar"
        >
          <Search className="h-5 w-5" />
        </button>
      </form>
      
      {/* Search suggestions - show based on variant and state */}
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
