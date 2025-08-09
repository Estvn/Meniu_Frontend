import type { MenuCategories, CategoriaBackend } from "../shared/restaurant-types.ts";

//  Variable de entorno https://api-meniuapp-dev.azurewebsites.net
const API_URL = "https://api-meniuapp-dev.azurewebsites.net";
//const API_URL = "http://localhost:3000";


export async function fetchMenuCategories(): Promise<MenuCategories> {
    //Consumo de API para obtener las categorias del menu y subcategorias
  const res = await fetch(`${API_URL}/categorias/todas`);

  if (!res.ok) {
    throw new Error("Error al obtener las categorías");
  }

  const data: CategoriaBackend[] = await res.json();

  const menuCategories: MenuCategories = {};

  for (const categoria of data) {
    menuCategories[categoria.nombre] = categoria.subcategorias.map((sub) => ({
      name: sub.nombre,
      items: [], // productos se cargarán luego si es necesario
    }));
  }

  return menuCategories;
}
