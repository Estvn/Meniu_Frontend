import type { MenuItem, MenuCategories } from "../shared/restaurant-types.ts";

const API_URL = "https://api-meniuapp-dev.azurewebsites.net";
//const API_URL = "http://localhost:3000";

interface ProductoAPI {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: string;
  imagen_url: string;
  subcategoria: {
    id_subcategoria: number;
    nombre: string;
    activa: number;
    categoria: {
      id_categoria: number;
      nombre: string;
      activa: number;
    };
  };
}

export async function fetchMenuItems(restaurantId: number): Promise<MenuCategories> {
  const res = await fetch(`${API_URL}/productos/restaurante/${restaurantId}`);
  if (!res.ok) throw new Error("Error al obtener productos");

  const data: ProductoAPI[] = await res.json();

  // Paso 1: Agrupar productos por categoría y subcategoría con ID me permitira colocar la categoria 1 como primera
  const grouped: Record<
    number,
    {
      nombre: string;
      subcategorias: Record<string, MenuItem[]>;
    }
  > = {};

  for (const producto of data) {
    const catId = producto.subcategoria.categoria.id_categoria;
    const catNombre = producto.subcategoria.categoria.nombre;
    const subNombre = producto.subcategoria.nombre;

    const menuItem: MenuItem = {
      id: producto.id_producto,
      uid: "",
      name: producto.nombre,
      description: producto.descripcion,
      price: parseFloat(producto.precio),
      image: producto.imagen_url,
      quantity: 1,
    };

    if (!grouped[catId]) {
      grouped[catId] = { nombre: catNombre, subcategorias: {} };
    }

    if (!grouped[catId].subcategorias[subNombre]) {
      grouped[catId].subcategorias[subNombre] = [];
    }

    grouped[catId].subcategorias[subNombre].push(menuItem);
  }

  // Paso 2: Ordenar categorías por ID y construir MenuCategories
  const orderedEntries = Object.entries(grouped).sort(
    ([idA], [idB]) => parseInt(idA) - parseInt(idB)
  );

  const final: MenuCategories = {};

  for (const [, { nombre, subcategorias }] of orderedEntries) {
    final[nombre] = Object.entries(subcategorias).map(([subNombre, items]) => ({
      name: subNombre,
      items,
    }));
  }

  return final;
}

export async function fetchComplementos(productId: number) {
  //const API_URL = "https://api-meniuapp-dev.azurewebsites.net";
  const API_URL = "http://localhost:3000";
  const response = await fetch(`${API_URL}/productos/complementos/${productId}`);
  if (!response.ok) {
    throw new Error('Error al obtener los complementos');
  }
  return await response.json();
}
