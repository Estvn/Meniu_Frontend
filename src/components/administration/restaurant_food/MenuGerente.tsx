"use client";
import { Header } from "./Header";
import { SearchSection } from "./SearchSection";
import { StatsCards } from "./StatsCards";
import { AddItemButton } from "./AddItemButton";
import { MenuItemsList } from "./MenuItemsList";

export function MenuGerente() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col pt-16 sm:pt-18 md:pt-20">
        <SearchSection />
        <StatsCards />
        <MenuItemsList />
        <AddItemButton />
      </div>
    </main>
  );
}

export default MenuGerente;
