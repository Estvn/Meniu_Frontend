import { useEffect, useState } from "react";
import type { MenuItem, ViewType, MenuCategories, Restaurante } from "../../components/cliente/shared/restaurant-types.ts";
import { useCart } from "../../components/cliente/hooks/useCart.ts";
import { useMenuNavigation } from "../../components/cliente/hooks/useMenuNavigation.ts";
import { useScrollToTop } from "../../components/cliente/hooks/useScrollToTop.ts";
import { fetchMenuItems } from "../../components/cliente/fetch/products.ts";
import { getRestaurantById } from "../../components/cliente/fetch/restaurant.ts"; 


import { Header } from "../../components/cliente/restaurant/MenuHeader.tsx";
import { RestaurantInfo } from "../../components/cliente/restaurant/RestaurantInfoCard.tsx";
import { MenuNavigation } from "../../components/cliente/restaurant/MenuNavigation.tsx";
import { CategoryNavigation } from "../../components/cliente/restaurant/CategoryNavigation.tsx";
import { MenuGrid } from "../../components/cliente/restaurant/MenuGrid.tsx";
import { ScrollToTop } from "../../components/cliente/restaurant/ScrollToTop.tsx";
import ProductDetailPage from "./ProductDetails.tsx";

//Para obtener el restaurante y mesa desde la URL
import { useSearchParams } from "react-router-dom";


export default function ClienteMenu() {
  const [searchParams] = useSearchParams();
  const restauranteId = Number(searchParams.get("id_restaurante"));
  const numeroMesa = Number(searchParams.get("num_mesa"));
  const [menuCategories, setMenuCategories] = useState<MenuCategories>({});
  const [restaurantInfo, setRestaurantInfo] = useState<Restaurante | null>(null);

  const [loading, setLoading] = useState(true);

  // SelectItem almacena el producto actualmente seleccionado
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  // CurrentView controla la vista actual (menú o detalle del producto)
  const [currentView, setCurrentView] = useState<ViewType>("menu");

  const { addToCart, totalItems } = useCart();
  const { showScrollTop, scrollToTop } = useScrollToTop();

  useEffect(() => {
  if (restauranteId && numeroMesa) {
    localStorage.setItem("id_restaurante", restauranteId.toString());
    localStorage.setItem("id_mesa", searchParams.get("id_mesa") || "");
    localStorage.setItem("num_mesa", numeroMesa.toString());
  }

  const fetchData = async () => {
    try {
      const [menu, restaurant] = await Promise.all([
        fetchMenuItems(restauranteId),
        getRestaurantById(restauranteId),
      ]);
      setMenuCategories(menu);
      setRestaurantInfo(restaurant);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [restauranteId, numeroMesa, searchParams]);

  const {
    activeCategory,
    activeSubCategory,
    handleCategoryClick,
    handleSubCategoryClick,
    getCurrentItems,
  } = useMenuNavigation(menuCategories);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <img 
            src="../src/assets/img/logo.png" 
            alt="Meniu Logo" 
            className="w-48 h-auto mx-auto mb-4"
          />
          <p className="text-gray-500 text-lg">Cargando menú...</p>
        </div>
      </div>
    );
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
      {restaurantInfo && <RestaurantInfo restaurant={restaurantInfo} />}
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
