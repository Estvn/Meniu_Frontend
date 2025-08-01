import type { Categoria } from "../../interfaces/Category";

const API_BASE_URL = "https://api-meniuapp-dev.azurewebsites.net";

export const obtenerCategorias = async (): Promise<Categoria[]> => {
  try {
    const token = sessionStorage.getItem("access_token");
    console.log("Token encontrado:", token ? "Sí" : "No");
    
    if (!token) {
      console.log("SessionStorage completo:", Object.keys(sessionStorage));
      throw new Error("No hay token de autenticación");
    }

    const response = await fetch(`${API_BASE_URL}/categorias/gestion-todas`, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener categorías: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    throw error;
  }
}; 