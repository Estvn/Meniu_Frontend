//Navegacion entre categorias y subcategorias

import { UtensilsCrossed, Coffee, IceCream,X,} from "lucide-react";
import { useState } from "react";
import type { MenuCategories } from "../shared/restaurant-types.ts";

// MenuCategories contiene las categorías y subcategorías del menú

interface CategoryNavigationProps {
  menuCategories: MenuCategories;
  activeCategory: string;
  activeSubCategory: string;
  onCategoryClick: (category: string) => void;
  onSubCategoryClick: (subCategory: string, category?: string) => void;
}

export function CategoryNavigation({
  menuCategories,
  activeCategory,
  activeSubCategory,
  onCategoryClick,
  onSubCategoryClick,
}: CategoryNavigationProps) {
  // Estado para manejar el bottom sheet de subcategorías
  // y SelectedCategory almacena la categoría seleccionada
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Comidas":
        return <UtensilsCrossed className="w-5 h-5" />;
      case "Bebidas":
        return <Coffee className="w-5 h-5" />;
      case "Postres":
        return <IceCream className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const handleCategoryClick = (category: string) => {
    onCategoryClick(category);
    setSelectedCategory(category);
    setBottomSheetOpen(true);
  };

  const handleSubCategoryClick = (subCategory: string) => {
    onSubCategoryClick(subCategory, selectedCategory!);
    setBottomSheetOpen(false);
  };

  return (
    <>
      {/* Categorías principales */}
      <div className="sticky top-[120px] z-40 bg-gray-50 px-4 py-2 shadow-sm">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {Object.keys(menuCategories).map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === category
                  ? "bg-[#fb3260] text-white"
                  : category === "Bebidas"
                    ? "bg-blue-100 text-blue-700"
                    : category === "Postres"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
            >
              <span>{getCategoryIcon(category)}</span>
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Sheet de subcategorías */}
      {bottomSheetOpen && selectedCategory && (
        <>
          {/* Fondo oscuro al hacer clic fuera */}
          <div
            className="fixed inset-0 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            onClick={() => setBottomSheetOpen(false)}
          />

          {/* Panel deslizable con subcategorías y "Ver todo" */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 z-[100] shadow-2xl max-h-[75vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 px-4 py-2 bg-[#fb3260] rounded-xl">
              <h2 className="text-lg font-semibold text-white ">
                {selectedCategory}
              </h2>
              <button onClick={() => setBottomSheetOpen(false)}>
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Botón "Ver todo" */}
              <button
                onClick={() => handleSubCategoryClick("Ver todo")}
                className={`rounded-lg px-4 py-3 text-sm font-medium border transition duration-300 ease-in-out ${activeSubCategory === "Ver todo" && activeCategory === selectedCategory
                    ? "bg-orange-100 text-orange-800 border-orange-300"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  } shadow-sm transform hover:scale-105`}
              >
                Ver todo
              </button>

              {/* Subcategorías */}
              {menuCategories[selectedCategory]?.map((subCategory) => (
                <button
                  key={subCategory.name}
                  onClick={() => handleSubCategoryClick(subCategory.name)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium border transition duration-300 ease-in-out ${activeSubCategory === subCategory.name && activeCategory === selectedCategory
                      ? "bg-orange-100 text-orange-800 border-orange-300"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    } shadow-sm transform hover:scale-105`}
                >
                  {subCategory.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
