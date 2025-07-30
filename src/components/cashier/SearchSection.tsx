"use client";
import { useState } from "react";

interface SearchSectionProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeFilter: 'all' | 'preparing' | 'ready' | 'delivered' | 'paid';
  onFilterChange: (filter: 'all' | 'preparing' | 'ready' | 'delivered' | 'paid') => void;
}

export function SearchSection({ 
  searchTerm, 
  onSearchChange, 
  activeFilter, 
  onFilterChange,
}: SearchSectionProps) {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const filterOptions = [
    { key: 'all', label: 'Activos', color: 'bg-gray-100 text-gray-700' },
    { key: 'preparing', label: 'En Preparación', color: 'bg-yellow-100 text-yellow-700' },
    { key: 'ready', label: 'Listos', color: 'bg-blue-100 text-blue-700' },
    { key: 'delivered', label: 'Entregados', color: 'bg-green-100 text-green-700' },
    { key: 'paid', label: 'Pagados', color: 'bg-purple-100 text-purple-700' }
  ];

  const getActiveFilterLabel = () => {
    const active = filterOptions.find(option => option.key === activeFilter);
    return active?.label || 'Activos';
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Barra de búsqueda */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              className="h-5 w-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
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
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por número de mesa..."
            className="block w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
          />
        </div>

        {/* Filtro de estado */}
        <div className="relative">
          <button
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="flex items-center justify-between w-full sm:w-48 px-3 py-2 sm:py-3 text-sm sm:text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <span>{getActiveFilterLabel()}</span>
            <svg 
              className={`ml-2 h-4 w-4 transition-transform duration-200 ${isFilterMenuOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isFilterMenuOpen && (
            <div className="absolute right-0 mt-1 w-full sm:w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {filterOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => {
                    onFilterChange(option.key as 'all' | 'preparing' | 'ready' | 'delivered' | 'paid');
                    setIsFilterMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                    activeFilter === option.key ? 'bg-orange-50 text-orange-700' : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filtros rápidos para móvil */}
      <div className="mt-4 sm:hidden">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => {
                onFilterChange(option.key as 'all' | 'preparing' | 'ready' | 'delivered' | 'paid');
              }}
              className={`flex-shrink-0 px-3 py-1 text-xs font-medium rounded-full border ${
                activeFilter === option.key
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 