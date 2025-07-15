"use client";

import { MenuItemCard } from "./MenuItemCard";

export function MenuItemsList() {
  const menuItems = [
    {
      id: 1,
      name: "Ensalada César",
      description: "Lechuga romana, crutones, queso parmesano y aderezo césar",
      price: "L. 39.99",
      status: "Disponible",
      category: "Entradas",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/390d1828e6280ec7ed8cfe9351facb6097795893?width=190",
    },
    {
      id: 2,
      name: "Salmón a la Parrilla",
      description: "Salmón fresco con vegetales asados y salsa de limón",
      price: "L. 239.99",
      status: "Disponible",
      category: "Platos Principales",
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/390d1828e6280ec7ed8cfe9351facb6097795893?width=190",
    },
  ];

  return (
    <section className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            Elementos del Menú
          </h2>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {menuItems.map((item) => (
            <MenuItemCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
