const API_URL = "https://api-meniuapp-dev.azurewebsites.net";
//const API_URL = "http://localhost:3000";

export interface Restaurante {
  id_restaurante: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  logo_url?: string;
  descripcion?: string;
}

export async function getRestaurantById(restauranteId: number): Promise<Restaurante> {
  const res = await fetch(`${API_URL}/restaurantes/obtener/${restauranteId}`);

  if (!res.ok) {
    throw new Error("Error al obtener el restaurante");
  }

  return await res.json();
}
