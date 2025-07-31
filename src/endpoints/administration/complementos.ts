import { useQuery } from '@tanstack/react-query';

// Tipos
export interface Complemento {
  id_complemento: number;
  nombre: string;
  precio: number;
  activo: number;
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

// Función para obtener complementos (productos con categoría Complemento)
export const obtenerComplementos = async (): Promise<Producto[]> => {
  const token = sessionStorage.getItem('access_token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const url = `/api/productos/restaurante/obtener-gestion`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener productos');
  }

  const productos = await response.json();
  
  // Filtrar solo los productos que tengan categoría "Complemento"
  return productos.filter((producto: Producto) => {
    return producto.subcategoria.categoria.nombre.toLowerCase().includes('complemento');
  });
};

// Función para obtener productos del restaurante
export const obtenerProductosRestaurante = async (): Promise<Producto[]> => {
  const token = sessionStorage.getItem('access_token');
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const url = `/api/productos/restaurante/obtener-gestion`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al obtener productos: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const productos = await response.json();
  return productos;
};

// Hook para obtener complementos
export const useComplementos = () => {
  return useQuery({
    queryKey: ['complementos'],
    queryFn: obtenerComplementos,
  });
};

// Función para agregar complemento a un producto
export const agregarComplemento = async (idProductoPrincipal: number, idProductoComplemento: number) => {
  const token = sessionStorage.getItem('access_token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const url = `/productos/complementos`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id_producto_principal: idProductoPrincipal,
      id_producto_complemento: idProductoComplemento,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al agregar complemento: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const result = await response.json();
  return result;
};

// Hook para obtener productos del restaurante
export const useProductosRestaurante = () => {
  return useQuery({
    queryKey: ['productos', 'restaurante'],
    queryFn: obtenerProductosRestaurante,
  });
  
};