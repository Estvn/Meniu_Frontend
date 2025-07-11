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
    </section>
  );
}
