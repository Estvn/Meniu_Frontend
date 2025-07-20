"use client";
import { StatCard } from "./StatCard";
import type { Producto } from "../../../endpoints";

interface StatsCardsProps {
  onAddItemClick?: () => void;
  onFilterChange?: (filter: 'all' | 'available' | 'unavailable') => void;
  activeFilter?: 'all' | 'available' | 'unavailable';
  productos?: Producto[];
}

export function StatsCards({ onAddItemClick, onFilterChange, activeFilter = 'all', productos = [] }: StatsCardsProps) {
  // Calcular estadísticas dinámicamente basadas en los productos
  const totalProductos = productos.length;
  const productosDisponibles = productos.filter(p => p.activo === 1).length;
  const productosNoDisponibles = productos.filter(p => p.activo === 0).length;

  console.log("🔍 StatsCards - Productos recibidos:", productos);
  console.log("🔍 StatsCards - Total:", totalProductos);
  console.log("🔍 StatsCards - Disponibles:", productosDisponibles);
  console.log("🔍 StatsCards - No disponibles:", productosNoDisponibles);

  const stats = [
    { 
      value: totalProductos.toString(), 
      label: "Elementos en Menú", 
      filter: 'all' as const,
      isActive: activeFilter === 'all'
    },
    { 
      value: productosDisponibles.toString(), 
      label: "Disponibles", 
      filter: 'available' as const,
      isActive: activeFilter === 'available'
    },
    { 
      value: productosNoDisponibles.toString(), 
      label: "No Disponibles", 
      filter: 'unavailable' as const,
      isActive: activeFilter === 'unavailable'
    },
    { value: "", label: "", filter: null, isActive: false },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => (
            <StatCard 
              key={index} 
              value={stat.value} 
              label={stat.label} 
              isEmpty={stat.value === ""}
              isActive={stat.isActive}
              onClick={() => stat.filter && onFilterChange?.(stat.filter)}
            />
          ))}
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-4">
        <button
          className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transition-all duration-200 ease-in-out rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] p-3 sm:p-4 min-h-[48px] sm:min-h-[56px] flex items-center justify-center"
          onClick={onAddItemClick}
        >
          <span className="text-sm sm:text-base font-medium text-white text-center">
            Agregar Nuevo Elemento al Menú
          </span>
        </button>
      </div>
    </section>
  );
}
