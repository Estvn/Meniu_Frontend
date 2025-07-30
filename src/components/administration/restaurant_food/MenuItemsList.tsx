"use client";

import { MenuItemCard } from "./MenuItemCard";
import { obtenerProductosRestaurante, type Producto } from "../../../endpoints";
import { useState, useEffect } from "react";

interface MenuItemsListProps {
  onEditFood?: (food: Producto) => void;
  onToggleStatus?: (food: Producto) => void;
  refreshTrigger?: number;
  activeFilter?: 'all' | 'available' | 'unavailable';
  activeCategoryFilter?: string | null;
  searchTerm?: string;
  productos?: Producto[];
}

export function MenuItemsList({ onEditFood, onToggleStatus, refreshTrigger, activeFilter = 'all', activeCategoryFilter = null, searchTerm = '', productos: productosProp = [] }: MenuItemsListProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtrar productos según el filtro activo, categoría y búsqueda
  const productosFiltrados = productos.filter(producto => {
    // Primero filtrar por estado (disponible/no disponible)
    let pasaFiltroEstado = true;
    switch (activeFilter) {
      case 'available':
        pasaFiltroEstado = producto.activo === 1;
        break;
      case 'unavailable':
        pasaFiltroEstado = producto.activo === 0;
        break;
      default:
        pasaFiltroEstado = true; // 'all' - mostrar todos
    }

    // Luego filtrar por categoría
    let pasaFiltroCategoria = true;
    if (activeCategoryFilter) {
      pasaFiltroCategoria = producto.subcategoria.categoria.id_categoria.toString() === activeCategoryFilter;
    }

    // Finalmente filtrar por término de búsqueda
    let pasaFiltroBusqueda = true;
    if (searchTerm.trim()) {
      const termino = searchTerm.toLowerCase();
      pasaFiltroBusqueda = producto.nombre.toLowerCase().includes(termino) ||
                           producto.descripcion.toLowerCase().includes(termino) ||
                           producto.subcategoria.nombre.toLowerCase().includes(termino) ||
                           producto.subcategoria.categoria.nombre.toLowerCase().includes(termino);
    }

    return pasaFiltroEstado && pasaFiltroCategoria && pasaFiltroBusqueda;
  });

  // Usar productos pasados como prop si están disponibles, sino cargarlos
  useEffect(() => {
    if (productosProp.length > 0) {
      console.log("🔍 MenuItemsList - Usando productos de prop:", productosProp);
      setProductos(productosProp);
      setLoading(false);
      setError(null);
    } else {
      const cargarProductos = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await obtenerProductosRestaurante();
          console.log("🔍 MenuItemsList - Productos cargados localmente:", data);
          setProductos(data);
        } catch (err) {
          setError("Error al cargar los productos");
          console.error("Error cargando productos:", err);
        } finally {
          setLoading(false);
        }
      };
      cargarProductos();
    }
  }, [refreshTrigger, productosProp]);

  return (
    <section className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            {activeFilter === 'all' 
              ? "Elementos del Menú" 
              : activeFilter === 'available' 
                ? "Productos Disponibles" 
                : "Productos No Disponibles"
            }
          </h2>
        </header>
        
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Cargando productos...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && productosFiltrados.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">
              {activeFilter === 'all' 
                ? "No hay productos disponibles" 
                : activeFilter === 'available' 
                  ? "No hay productos disponibles" 
                  : "No hay productos no disponibles"
              }
            </p>
          </div>
        )}

        {!loading && !error && productosFiltrados.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {productosFiltrados.map((producto) => {
              console.log(`Imagen para ${producto.nombre}:`, producto.imagen_url);
              return (
                <MenuItemCard 
                  key={producto.id_producto} 
                  name={producto.nombre}
                  description={producto.descripcion}
                  price={`L. ${producto.precio}`}
                  status={producto.activo === 1 ? "Disponible" : "No disponible"}
                  categoria={producto.subcategoria.categoria.nombre}
                  subcategoria={producto.subcategoria.nombre}
                  image={producto.imagen_url}
                  isActive={producto.activo === 1}
                  onEdit={() => onEditFood?.(producto)} 
                  onToggleStatus={() => onToggleStatus?.(producto)}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
