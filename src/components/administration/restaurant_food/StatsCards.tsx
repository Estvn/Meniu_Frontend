"use client";
import { StatCard } from "./StatCard";

export function StatsCards() {
  const stats = [
    { value: "4", label: "Elementos en Menú" },
    { value: "3", label: "Disponibles" },
    { value: "1", label: "No Disponibles" },
    { value: "", label: "" },
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
            />
          ))}
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-4">
        <button className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transition-all duration-200 ease-in-out rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] p-3 sm:p-4 min-h-[48px] sm:min-h-[56px] flex items-center justify-center">
          <span className="text-sm sm:text-base font-medium text-white text-center">
            Agregar Nuevo Elemento al Menú
          </span>
        </button>
      </div>
    </section>
  );
}
