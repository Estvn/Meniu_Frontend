import { useEffect, useState } from "react";
import type { MenuItem, ViewType, MenuCategories } from "../../components/cliente/shared/restaurant-types";
import { useCart } from "../../components/cliente/hooks/useCart";
import { useMenuNavigation } from "../../components/cliente/hooks/useMenuNavigation";
import { useScrollToTop } from "../../components/cliente/hooks/useScrollToTop";
import { fetchMenuItems } from "../../components/cliente/fetch/products.ts";

import { Header } from "../../components/cliente/restaurant/MenuHeader";
import { RestaurantInfo } from "../../components/cliente/restaurant/RestaurantInfoCard";
import { MenuNavigation } from "../../components/cliente/restaurant/MenuNavigation";
import { CategoryNavigation } from "../../components/cliente/restaurant/CategoryNavigation";
import { MenuGrid } from "../../components/cliente/restaurant/MenuGrid";
import { ScrollToTop } from "../../components/cliente/restaurant/ScrollToTop";
import ProductDetailPage from "./ProductDetails";

//Para obtener el restaurante y mesa desde la URL
import { useSearchParams } from "react-router-dom";


export default function ClienteMenu() {
  const [searchParams] = useSearchParams();
  const restauranteId = Number(searchParams.get("id_restaurante"));
  const numeroMesa = Number(searchParams.get("id_mesa"));
  const [menuCategories, setMenuCategories] = useState<MenuCategories>({});
  const [loading, setLoading] = useState(true);

  // SelectItem almacena el producto actualmente seleccionado
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  // CurrentView controla la vista actual (menú o detalle del producto)
  const [currentView, setCurrentView] = useState<ViewType>("menu");

  const { addToCart, totalItems } = useCart();
  const { showScrollTop, scrollToTop } = useScrollToTop();

  useEffect(() => {

    // Guarda en localStorage si vienen en la URL
    if (restauranteId && numeroMesa) {
      localStorage.setItem("id_restaurante", restauranteId.toString());
      localStorage.setItem("id_mesa", numeroMesa.toString());
    }

    fetchMenuItems(restauranteId)
      .then((data) => {
        setMenuCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        setLoading(false);
      });
  }, [restauranteId, numeroMesa]);


  const {
    activeCategory,
    activeSubCategory,
    handleCategoryClick,
    handleSubCategoryClick,
    getCurrentItems,
  } = useMenuNavigation(menuCategories);

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Cargando menú...</div>;
  }

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
      <Header totalItems={totalItems} numeroMesa={numeroMesa} />
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
