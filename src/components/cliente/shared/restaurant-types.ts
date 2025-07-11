/**
 * Shared types for the restaurant menu application
 */

export interface MenuItem {
    id: string;
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
    id: string;
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
  