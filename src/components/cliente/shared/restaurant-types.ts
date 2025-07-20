/**
 * Shared types for the restaurant menu application
 */

export interface MenuItem {
    id: number;
    uid: string; // <-- identificador único para el carrito
    name: string;
    description: string;
    price: number;
    image?: string;
    quantity: number;
  }
  
  export interface SubCategory {
    name: string;
    items: MenuItem[];
  }
  
  export interface Complement {
    id: number;
    name: string;
    price: number;
    selected: boolean;
  }
  
  export interface CartItem extends MenuItem {
    complements?: Complement[];
    instructions?: string;
  }
  
  export type MenuCategories = Record<string, SubCategory[]>;
  
  export type ViewType = "menu" | "productDetail";

  export interface Restaurante {
  id_restaurante: number;
  nombre: string;
  email?: string;
  direccion?: string;
  telefono?: string;
  logo_url?: string;
  descripcion?: string;
  activo?: boolean;
  fechaCreacion?: string;
}


  export interface CategoriaBackend {
  id_categoria: number;
  nombre: string;
  activa: number;
  subcategorias: {
    id_subcategoria: number;
    nombre: string;
    activa: number;
  }[];


  
}

  