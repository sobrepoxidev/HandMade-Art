'use client';

interface Category {
  id: number;
  name: string;
}

interface CategoryChipsProps {
  categories: Category[];
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  discountCategories?: number[]; // IDs de categorías que tienen descuento aplicado
  hasDiscountForAll?: boolean; // Si el descuento aplica a todas las categorías
}

export function CategoryChips({
  categories,
  selectedCategory,
  onCategoryChange,
  discountCategories = [],
  hasDiscountForAll = false
}: CategoryChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 horizontal-scrollbar">
      {/* Chip "Todas" */}
      <button
        onClick={() => onCategoryChange(null)}
        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden ${selectedCategory === null
            ? hasDiscountForAll
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-2 border-pink-900 text-white shadow-lg transform scale-105 animate-pulse'
              : 'bg-teal-600 border border-teal-900 text-white shadow-md'
            : hasDiscountForAll
              ? 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 hover:from-pink-200 hover:to-purple-200 border-2 border-pink-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
      >
        {hasDiscountForAll && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></span>
        )}
        Todas las categorías
        {hasDiscountForAll && (
          <span className="ml-1 text-xs">🎉</span>
        )}
      </button>

      {/* Chips de categorías */}
      {/* Primero las categorías con descuento */}
      {categories
        .filter(category => discountCategories.includes(category.id))
        .map((category) => {
          const isSelected = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden ${isSelected
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white  border-white ring-1 ring-pink-500'
                  : 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 hover:from-pink-200 hover:to-purple-200 border-2 border-pink-300 hover:scale-105'
                }`}
            >
              <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></span>
              {category.name}
              <span className="ml-1 text-xs">💎</span>
            </button>
          );
        })}

      {/* Luego las categorías sin descuento */}
      {categories
        .filter(category => !discountCategories.includes(category.id))
        .map((category) => {
          const isSelected = selectedCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden ${isSelected
                  ? 'bg-teal-600 text-white shadow-md border-4 border-white '
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {category.name}
            </button>
          );
        })}
    </div>
  );
}