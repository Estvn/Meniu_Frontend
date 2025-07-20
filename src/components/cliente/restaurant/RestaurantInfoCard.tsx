//Componente para la informacion del restaurante

import { Phone, MapPin } from "lucide-react";
import type { Restaurante } from "../shared/restaurant-types.ts";

interface Props {
  restaurant: Restaurante;
}

export function RestaurantInfo({ restaurant }: Props) {
  return (
    <>
      {/* Imagen del restaurante */}
<div className="h-48 bg-gray-300 relative overflow-hidden">
  {restaurant.logo_url ? (
    <img
      src={import.meta.env.VITE_API_URL + restaurant.logo_url}
      alt={restaurant.nombre}
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="absolute inset-0 bg-gray-400 flex items-center justify-center">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-400 rounded"></div>
      </div>
    </div>
  )}
</div>


      {/* CArd con informacion */}
      <div className="mx-4 -mt-10 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-black mb-4">{restaurant.nombre}</h1>

          <div className="flex items-center gap-1 mb-4">
            <Phone className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 text-sm">{restaurant.telefono}</span>
          </div>

          <div className="flex items-center gap-1 mb-6">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 text-sm">
              {restaurant.direccion}
            </span>
          </div>

          <p className="text-gray-700 leading-relaxed">
            {restaurant.descripcion}
          </p>
        </div>
      </div>
    </>
  );
}
