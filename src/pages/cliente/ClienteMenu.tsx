import { useState } from "react";
import type { MenuItem, ViewType } from "../../components/cliente/shared/restaurant-types";
import { useCart } from "../../components/cliente/hooks/useCart";
import { useMenuNavigation } from "../../components/cliente/hooks/useMenuNavigation";
import { useScrollToTop } from "../../components/cliente/hooks/useScrollToTop";
import { menuCategories } from "../../components/cliente/menuData";
import { Header } from "../../components/cliente/MenuHeader";
import { RestaurantInfo } from "../../components/cliente/RestaurantInfoCard";
import { MenuNavigation } from "../../components/cliente/MenuNavigation";
import { CategoryNavigation } from "../../components/cliente/CategoryNavigation";
import { MenuGrid } from "../../components/cliente/MenuGrid";
import { ScrollToTop } from "../../components/cliente/ScrollToTop";
import ProductDetailPage from "./ProductDetails";

export default function ClienteMenu() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>("menu");

  const { addToCart, totalItems } = useCart();
  const { showScrollTop, scrollToTop } = useScrollToTop();
  const {
    activeCategory,
    activeSubCategory,
    openDropdown,
    handleCategoryClick,
    handleSubCategoryClick,
    setOpenDropdown,
    getCurrentItems,
  } = useMenuNavigation(menuCategories);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setCurrentView("productDetail");
  };

  const handleBackFromDetail = () => {
    setSelectedItem(null);
    setCurrentView("menu");
  };

  // Show product detail page
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
      <Header totalItems={totalItems} />
      <RestaurantInfo />
      <MenuNavigation />

      <CategoryNavigation
        menuCategories={menuCategories}
        activeCategory={activeCategory}
        activeSubCategory={activeSubCategory}
        openDropdown={openDropdown}
        onCategoryClick={handleCategoryClick}
        onSubCategoryClick={handleSubCategoryClick}
        onCloseDropdown={() => setOpenDropdown(null)}
      />

      <MenuGrid
        items={getCurrentItems()}
        activeCategory={activeCategory}
        activeSubCategory={activeSubCategory}
        onItemClick={handleItemClick}
      />

      <ScrollToTop isVisible={showScrollTop} onClick={scrollToTop} />
    </div>
  );
}
