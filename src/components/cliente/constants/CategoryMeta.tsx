// Para iconos y colores de las categorias. Ojo estos iconos seria mejor no manejarlos en el front

import {
  Beer,
  UtensilsCrossed,
  IceCream,
  HelpCircle,
  Sandwich,
  Sparkles,
} from "lucide-react";

export interface CategoryStyle {
  icon: React.ReactNode;
  color: string;
}

export const categoryMeta: Record<string, CategoryStyle> = {
  Bebidas: {
    icon: <Beer size={18} />,
    color: "bg-blue-100 text-blue-700",
  },
  Comida: {
    icon: <UtensilsCrossed size={18} />,
    color: "bg-pink-100 text-pink-700",
  },
  Postres: {
    icon: <IceCream size={18} />,
    color: "bg-yellow-100 text-yellow-700",
  },
  Acompañamientos: {
    icon: <Sandwich size={18} />,
    color: "bg-green-100 text-green-700",
  },
};

export const defaultCategoryMeta: CategoryStyle = {
  icon: <Sparkles size={18} />,
  color: "bg-gray-100 text-gray-700",
};
