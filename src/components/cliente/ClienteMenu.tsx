import { useState } from "react";
import { menuCategories } from "./menuData";
import MenuHeader from "./MenuHeader";
import {
  Minus,
  Plus,
  ChevronDown,
  UtensilsCrossed,
  Coffee,
  IceCream,
} from "lucide-react";
import RestaurantInfoCard from "./RestaurantInfoCard";


interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  quantity: number;
}

export interface SubCategory {
  name: string;
  items: MenuItem[];
}

export default function ClienteMenu() {
  const [activeCategory, setActiveCategory] = useState("Alimentos");
  const [activeSubCategory, setActiveSubCategory] = useState("Ver todo");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [cart, setCart] = useState<MenuItem[]>([]);


  const updateQuantity = (itemId: string, change: number) => {
    // Encuentra el item base en el menú (sin modificarlo)
    let foundItem: MenuItem | undefined;
  
    Object.values(menuCategories).some((subCategories) =>
      subCategories.some((subCategory) => {
        const item = subCategory.items.find((item) => item.id === itemId);
        if (item) {
          foundItem = item;
          return true; // corta la búsqueda
        }
        return false;
      })
    );
  
    if (!foundItem) return;
  
    const existingItemIndex = cart.findIndex((item) => item.id === itemId);
    const existingItem = cart[existingItemIndex];
  
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newQuantity = Math.max(0, currentQuantity + change);
  
    if (newQuantity === 0 && existingItemIndex !== -1) {
      // Eliminar del carrito
      const updatedCart = [...cart];
      updatedCart.splice(existingItemIndex, 1);
      setCart(updatedCart);
    } else if (existingItemIndex !== -1) {
      // Actualizar cantidad del ítem en carrito
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: newQuantity,
      };
      setCart(updatedCart);
    } else {
      // Agregar nuevo ítem al carrito
      setCart([...cart, { ...foundItem, quantity: newQuantity }]);
    }
  };
  

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCategoryClick = (category: string) => {
    if (openDropdown === category) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(category);

      // Only reset to "Ver todo" if switching to a completely different category
      if (activeCategory !== category) {
        setActiveCategory(category);
        setActiveSubCategory("Ver todo");
      }
    }
  };

  const handleSubCategoryClick = (subCategory: string) => {
    setActiveSubCategory(subCategory);
    setOpenDropdown(null);
  };

  const getCurrentItems = () => {
    const categoryData = menuCategories[activeCategory];
    if (!categoryData) return [];

    // If "Ver todo" is selected, return all items from all subcategories
    if (activeSubCategory === "Ver todo") {
      return categoryData.reduce((allItems: MenuItem[], subCategory) => {
        return [...allItems, ...subCategory.items];
      }, []);
    }

    // Otherwise, return items from the specific subcategory
    const subCategoryData = categoryData.find(
      (sub) => sub.name === activeSubCategory,
    );
    return subCategoryData ? subCategoryData.items : [];
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 overflow-x-hidden">

      <MenuHeader totalItems={totalItems} />
      <RestaurantInfoCard/>
      

      {/* Menu Navigation */}
      <div className="mt-6 px-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button className="flex-1 py-2 text-center text-sm font-medium rounded-md bg-white text-gray-900 shadow-sm">
            Menú
          </button>
          <button className="flex-1 py-2 text-center text-sm font-medium rounded-md text-gray-600">
            Mis Pedidos
          </button>
        </div>
      </div>

      {/* Category Tabs with Dropdowns */}
      <div className="mt-6 px-4">
        <div className="flex gap-3">
          {Object.keys(menuCategories).map((category) => {
            const getCategoryIcon = (cat: string) => {
              switch (cat) {
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
              <div key={category} className="relative">
                <button
                  onClick={() => handleCategoryClick(category)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? "bg-red-500 text-white"
                      : category === "Bebidas"
                        ? "bg-red-100 text-red-700"
                        : category === "Postres"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
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

                {/* Dropdown */}
                {openDropdown === category && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border min-w-[200px] z-20">
                    {/* Ver todo option */}
                    <button
                      onClick={() => handleSubCategoryClick("Ver todo")}
                      className={`block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 first:rounded-t-lg border-b border-gray-100 ${
                        activeSubCategory === "Ver todo"
                          ? "bg-orange-50 text-orange-700 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      Ver todo
                    </button>

                    {/* Subcategory options */}
                    {menuCategories[category].map((subCategory) => (
                      <button
                        key={subCategory.name}
                        onClick={() => handleSubCategoryClick(subCategory.name)}
                        className={`block w-full text-left px-4 py-3 text-sm hover:bg-gray-50 last:rounded-b-lg ${
                          activeSubCategory === subCategory.name
                            ? "bg-orange-50 text-orange-700 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {subCategory.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Category/SubCategory Title */}
      <div className="mt-6 px-4">
        <h2 className="text-xl font-bold text-gray-900">
          {activeCategory}
          {activeSubCategory !== "Ver todo" && (
            <span className="text-gray-500 font-normal">
              {" "}
              → {activeSubCategory}
            </span>
          )}
        </h2>
      </div>

      {/* Menu Items */}
      <div className="mt-4 px-4 pb-6">
        <div className="space-y-4">
          {getCurrentItems().map((item) => (
            <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <span className="text-orange-600 font-bold">
                      L{item.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center"
                        disabled={item.quantity === 0}
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="font-medium min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity === 0 ? 1 : 0)
                      }
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backdrop for dropdown */}
      {openDropdown && (
        <div
          className="fixed inset-0 bg-transparent z-10"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
}
