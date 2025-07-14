import { useState } from "react";
import type { MenuItem, ViewType } from "../../components/cliente/shared/restaurant-types";
import { useCart } from "../../components/cliente/hooks/useCart";
import { useMenuNavigation } from "../../components/cliente/hooks/useMenuNavigation";
import { useScrollToTop } from "../../components/cliente/hooks/useScrollToTop";
import { menuCategories } from "../../components/cliente/menuData";
import { Header } from "../../components/cliente/restaurant/MenuHeader";
import { RestaurantInfo } from "../../components/cliente/restaurant/RestaurantInfoCard";
import { MenuNavigation } from "../../components/cliente/restaurant/MenuNavigation";
import { CategoryNavigation } from "../../components/cliente/restaurant/CategoryNavigation";
import { MenuGrid } from "../../components/cliente/restaurant/MenuGrid";
import { ScrollToTop } from "../../components/cliente/restaurant/ScrollToTop";
import ProductDetailPage from "./ProductDetails";

export default function ClienteMenu() {
  // SelectItem almacena el producto actualmente seleccionado
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  // CurrentView controla la vista actual (menú o detalle del producto)
  const [currentView, setCurrentView] = useState<ViewType>("menu");

  const { addToCart, totalItems } = useCart();
  const { showScrollTop, scrollToTop } = useScrollToTop();
  const {
    activeCategory,
    activeSubCategory,
    handleCategoryClick,
    handleSubCategoryClick,
    getCurrentItems,
  } = useMenuNavigation(menuCategories);

  // Se activa cuando el usuario hace clic en un elemento del menú y cambia la vista a producDetail
  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setCurrentView("productDetail");
  };

  // Permite regresar a la vista del menu
  const handleBackFromDetail = () => {
    setSelectedItem(null);
    setCurrentView("menu");
  };

  // Si la vista actual es productDetail y hay un elemento seleccionado, renderiza la página de detalles del producto
  if (currentView === "productDetail" && selectedItem) {
    return (
      <ProductDetailPage
        item={selectedItem}
        onBack={handleBackFromDetail}
        onAddToCart={(item, complements, instructions, quantity) => {
          addToCart(item, complements, instructions, quantity);
          handleBackFromDetail();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header con el total de items en el carrito */}
      <Header totalItems={totalItems} /> 
      <RestaurantInfo />
      <MenuNavigation />

      <CategoryNavigation
        menuCategories={menuCategories}
        activeCategory={activeCategory}
        activeSubCategory={activeSubCategory}
        onCategoryClick={handleCategoryClick}
        onSubCategoryClick={handleSubCategoryClick}
      />

      {/* Muestra los items del menú según la categoría y subcategoría activa */}
      <MenuGrid
        items={getCurrentItems()}
        activeCategory={activeCategory}
        activeSubCategory={activeSubCategory}
        onItemClick={handleItemClick}
      />

      {/*Permite al usuario desplazarse hacia la parte superior de la pagina */}
      <ScrollToTop isVisible={showScrollTop} onClick={scrollToTop} />
    </div>
  );
}
