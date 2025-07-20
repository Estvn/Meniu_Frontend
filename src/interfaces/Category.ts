export interface Subcategoria {
  id_subcategoria: number;
  nombre: string;
  activa: number;
}

export interface Categoria {
  id_categoria: number;
  nombre: string;
  activa: number;
  subcategorias: Subcategoria[];
} 