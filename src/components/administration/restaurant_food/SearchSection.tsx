"use client";


interface SearchSectionProps {
  onSearch?: (searchTerm: string) => void;
  onCategoryFilterChange?: (categoryId: string | null) => void;
  activeCategoryFilter?: string | null;
  categories?: Array<{ id_categoria: number; nombre: string }>;
}

export function SearchSection({ 
  onSearch,
  onCategoryFilterChange, 
  activeCategoryFilter = null,
  categories = []
}: SearchSectionProps) {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              className="h-4 w-4 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar plato..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base text-gray-900 placeholder-gray-500"
          />
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {/* Botón "Todas las categorías" */}
          <button 
            className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors duration-200 ${
              activeCategoryFilter === null
                ? 'bg-red-50 hover:bg-red-100 border-red-300 text-gray-900'
                : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700'
            }`}
            onClick={() => onCategoryFilterChange?.(null)}
          >
            Todas las categorías
          </button>
          
          {/* Botones de categorías dinámicas */}
          {categories.map((category) => (
            <button 
              key={category.id_categoria}
              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeCategoryFilter === category.id_categoria.toString()
                  ? 'bg-red-50 hover:bg-red-100 border-red-300 text-gray-900'
                  : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700'
              }`}
              onClick={() => onCategoryFilterChange?.(category.id_categoria.toString())}
            >
              {category.nombre}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
