"use client";
import { HeaderNavBar } from "../navbar/HeaderNavBar";
import { SearchSection } from "./SearchSection";
import { StatsCards } from "./StatsCards";
import { MenuItemsList } from "./MenuItemsList";

export function MenuGerente() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderNavBar title="Menú" subtitle="Gestión de Menú" />
      <div className="flex-1 flex flex-col pt-16 sm:pt-18 md:pt-20">
        <SearchSection />
        <StatsCards />
        <MenuItemsList />
      </div>
    </main>
  );
}

export default MenuGerente;
