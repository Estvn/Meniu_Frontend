"use client";
import { HeaderNavBar } from "../navbar/HeaderNavBar";
import { SearchSection } from "./SearchSection";
import { StatsCards } from "./StatsCards";
import { MenuItemsList } from "./MenuItemsList";
import { FormularioCrearAlimento } from "../forms/FormularioCrearAlimento";
import { ModalConfirmarAccion } from "../forms/ModalConfirmarAccion";
import { actualizarProducto, obtenerProductosRestaurante } from "../../../endpoints/administration/productos";
import { obtenerCategorias } from "../../../endpoints/administration/categorias";
import { useState, useEffect } from "react";
import type { Producto } from "../../../endpoints";

interface FoodFormData {
  name: string;
  description: string;
  price: string;
  categoria: string;
  subcategoria: string;
  photo: File | null;
}

export function MenuGerente() {
  const [showCrearAlimento, setShowCrearAlimento] = useState(false);
  const [editingFood, setEditingFood] = useState<Producto | null>(null);
  const [showConfirmarAccion, setShowConfirmarAccion] = useState(false);
  const [productoAccion, setProductoAccion] = useState<Producto | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<Array<{ id_categoria: number; nombre: string }>>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  const handleOpenCrearAlimento = () => setShowCrearAlimento(true);
  
  const handleFilterChange = (filter: 'all' | 'available' | 'unavailable') => {
    setActiveFilter(filter);
  };

  const handleCategoryFilterChange = (categoryId: string | null) => {
    setActiveCategoryFilter(categoryId);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Cargar categorías al montar el componente
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const data = await obtenerCategorias();
        const categoriasSimplificadas = data.map(cat => ({
          id_categoria: cat.id_categoria,
          nombre: cat.nombre
        }));
        setCategories(categoriasSimplificadas);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };

    cargarCategorias();
  }, []);

  // Cargar productos al montar el componente y cuando cambie refreshTrigger
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await obtenerProductosRestaurante();
        console.log("🔍 MenuGerente - Productos cargados:", data);
        console.log("🔍 MenuGerente - Total productos:", data.length);
        console.log("🔍 MenuGerente - Disponibles:", data.filter(p => p.activo === 1).length);
        console.log("🔍 MenuGerente - No disponibles:", data.filter(p => p.activo === 0).length);
        setProductos(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    cargarProductos();
  }, [refreshTrigger]);
  
  const handleEditFood = (food: Producto) => {
    setEditingFood(food);
    setShowCrearAlimento(true);
  };

  const handleToggleStatus = (food: Producto) => {
    setProductoAccion(food);
    setShowConfirmarAccion(true);
  };

  const handleCloseForm = () => {
    setShowCrearAlimento(false);
    setEditingFood(null);
  };

  const handleCloseConfirmarModal = () => {
    setShowConfirmarAccion(false);
    setProductoAccion(null);
  };

  const handleSubmitFood = (data: FoodFormData) => {
    if (editingFood) {
      console.log("Actualizando alimento:", { ...data, id: editingFood.id_producto });
      // Aquí iría la lógica para actualizar el alimento
    } else {
      console.log("Creando nuevo alimento:", data);
      // Aquí iría la lógica para crear el alimento
    }
    // Refrescar la lista de productos después de crear/editar
    setRefreshTrigger(prev => prev + 1);
    handleCloseForm();
  };

  const handleConfirmToggleStatus = async () => {
    if (productoAccion) {
      try {
        const nuevoEstado = productoAccion.activo === 1 ? 0 : 1;
        const accion = nuevoEstado === 1 ? "habilitando" : "deshabilitando";
        console.log(`${accion} alimento:`, productoAccion);
        
        // Actualizar el producto para cambiar su estado
        const productoData = {
          nombre: productoAccion.nombre,
          descripcion: productoAccion.descripcion,
          precio: parseFloat(productoAccion.precio),
          id_subcategoria: productoAccion.subcategoria.id_subcategoria,
          imagen: productoAccion.imagen_url,
          activo: nuevoEstado
        };

        await actualizarProducto(productoAccion.id_producto, productoData);
        console.log(`Alimento ${accion} exitosamente`);
        
        // Refrescar la lista de productos
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error("Error al cambiar estado del alimento:", error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    }
    handleCloseConfirmarModal();
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderNavBar title="Menú" subtitle="Gestión de Menú" />
      <div className="flex-1 flex flex-col pt-16 sm:pt-18 md:pt-20">
        <SearchSection 
          onSearch={handleSearch}
          onCategoryFilterChange={handleCategoryFilterChange}
          activeCategoryFilter={activeCategoryFilter}
          categories={categories}
        />
        <StatsCards 
          onAddItemClick={handleOpenCrearAlimento}
          onFilterChange={handleFilterChange}
          activeFilter={activeFilter}
          productos={productos}
        />
        <MenuItemsList 
          onEditFood={handleEditFood} 
          onToggleStatus={handleToggleStatus} 
          refreshTrigger={refreshTrigger}
          activeFilter={activeFilter}
          activeCategoryFilter={activeCategoryFilter}
          searchTerm={searchTerm}
          productos={productos}
        />
      </div>
      {showCrearAlimento && (
        <FormularioCrearAlimento 
          mode={editingFood ? "edit" : "create"}
          initialData={editingFood ? {
            name: editingFood.nombre,
            description: editingFood.descripcion,
            price: editingFood.precio,
            categoria: editingFood.subcategoria.categoria.id_categoria.toString(),
            subcategoria: editingFood.subcategoria.id_subcategoria.toString(),
            photo: null, // La imagen actual no se puede convertir a File, se mantiene null
          } : undefined}
          productId={editingFood?.id_producto}
          currentImageUrl={editingFood?.imagen_url}
          onClose={handleCloseForm}
          onCancel={handleCloseForm}
          onSubmit={handleSubmitFood}
        />
      )}
      {showConfirmarAccion && productoAccion && (
        <ModalConfirmarAccion
          title={productoAccion.activo === 1 ? "Deshabilitar Producto" : "Habilitar Producto"}
          message={productoAccion.activo === 1 
            ? `¿Está seguro que desea deshabilitar "${productoAccion.nombre}"? Este producto ya no aparecerá como disponible.`
            : `¿Está seguro que desea habilitar "${productoAccion.nombre}"? Este producto aparecerá como disponible.`
          }
          palabraConfirmacion={productoAccion.activo === 1 ? "deshabilitar" : "habilitar"}
          placeholder={productoAccion.activo === 1 ? "Escriba 'deshabilitar'" : "Escriba 'habilitar'"}
          onClose={handleCloseConfirmarModal}
          onCancel={handleCloseConfirmarModal}
          onConfirm={handleConfirmToggleStatus}
        />
      )}
    </main>
  );
}

export default MenuGerente;
