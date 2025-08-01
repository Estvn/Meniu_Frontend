const API_BASE_URL = "https://api-meniuapp-dev.azurewebsites.net";

export interface CrearProductoRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  id_subcategoria: number;
  imagen: string;
  activo: number;
}

export interface ActualizarProductoRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  id_subcategoria: number;
  imagen: string;
  activo: number;
}

export interface CrearProductoResponse {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url: string;
  activo: number;
  restaurante: {
    id_restaurante: number;
  };
  subcategoria: {
    id_subcategoria: number;
  };
}

export interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: string;
  imagen_url: string;
  activo: number;
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

export const crearProducto = async (data: CrearProductoRequest): Promise<CrearProductoResponse> => {
  try {
    const token = sessionStorage.getItem("access_token");
    
    if (!token) {
      throw new Error("No hay token de autenticación");
    }

    const response = await fetch(`${API_BASE_URL}/productos/crear-producto-ln`, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al crear producto: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
};

export const obtenerProductosRestaurante = async (): Promise<Producto[]> => {
  try {
    const token = sessionStorage.getItem("access_token");
    
    if (!token) {
      throw new Error("No hay token de autenticación");
    }

    const response = await fetch(`${API_BASE_URL}/productos/restaurante/obtener-gestion`, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al obtener productos: ${response.status}`);
    }

    const data = await response.json();
    console.log("Respuesta de la API productos:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
};

export const actualizarProducto = async (idProducto: number, data: ActualizarProductoRequest): Promise<CrearProductoResponse> => {
  try {
    const token = sessionStorage.getItem("access_token");
    
    if (!token) {
      throw new Error("No hay token de autenticación");
    }

    const response = await fetch(`${API_BASE_URL}/productos/actualizar-producto-ln/${idProducto}`, {
      method: "PUT",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error al actualizar producto: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
}; 