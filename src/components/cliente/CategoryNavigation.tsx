import { ChevronDown, UtensilsCrossed, Coffee, IceCream } from "lucide-react";
import type { MenuCategories } from "./shared/restaurant-types";

interface CategoryNavigationProps {
  menuCategories: MenuCategories;
  activeCategory: string;
  activeSubCategory: string;
  openDropdown: string | null;
  onCategoryClick: (category: string) => void;
  onSubCategoryClick: (subCategory: string, category?: string) => void;
  onCloseDropdown: () => void;
}

export function CategoryNavigation({
  menuCategories,
  activeCategory,
  activeSubCategory,
  openDropdown,
  onCategoryClick,
  onSubCategoryClick,
  onCloseDropdown,
}: CategoryNavigationProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Alimentos":
        return <UtensilsCrossed className="w-4 h-4" />;
      case "Bebidas":
        return <Coffee className="w-4 h-4" />;
      case "Postres":
        return <IceCream className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="sticky top-[120px] z-40 bg-gray-50 px-4 py-2 shadow-sm">
        <div
          className={`flex gap-3 pb-2 scrollbar-hide ${
            openDropdown ? "overflow-visible" : "overflow-x-auto"
          }`}
        >
          {Object.keys(menuCategories).map((category) => (
            <div key={category} className="relative flex-shrink-0">
              <button
                onClick={() => onCategoryClick(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-[#fb3260] text-white"
                    : category === "Bebidas"
                      ? "bg-blue-100 text-blue-700"
                      : category === "Postres"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                }`}
              >
                <span
                  className={activeCategory === category ? "text-white" : ""}
                >
                  {getCategoryIcon(category)}
                </span>
                {category}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openDropdown === category ? "rotate-180" : ""
                  } ${activeCategory === category ? "text-white" : ""}`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Dropdown container */}
        {openDropdown && (
          <div className="absolute top-full left-0 right-0 z-50 mt-2">
            {Object.keys(menuCategories).map((category) => {
              if (openDropdown !== category) return null;

              return (
                <div key={category} className="flex justify-center">
                  <div className="bg-white rounded-lg shadow-lg border min-w-[200px] max-w-xs">
                    <button
                      onClick={() => onSubCategoryClick("Ver todo", category)}
                      className={`block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 first:rounded-t-lg border-b border-gray-100 ${
                        activeSubCategory === "Ver todo" &&
                        activeCategory === category
                          ? "bg-orange-50 text-orange-700 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      Ver todo
                    </button>

                    {menuCategories[category].map((subCategory) => (
                      <button
                        key={subCategory.name}
                        onClick={() =>
                          onSubCategoryClick(subCategory.name, category)
                        }
                        className={`block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 last:rounded-b-lg ${
                          activeSubCategory === subCategory.name &&
                          activeCategory === category
                            ? "bg-orange-50 text-orange-700 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {subCategory.name}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Backdrop for dropdown */}
      {openDropdown && (
        <div
          className="fixed inset-0 bg-transparent z-10"
          onClick={onCloseDropdown}
        />
      )}
    </>
  );
}
