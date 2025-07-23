//Componente para mostrar informacion de un producto del menu del restaurante

import { type MenuItem as MenuItemType } from "../shared/restaurant-types.ts";

// MenuItemType define el tipo de un producto del menu que es MenuItem
// onDetailsClick es una funcion que se ejecuta al hacer click en el boton de agregar
// toFixed(2) se usa para mostrar el precio con dos decimales

interface MenuItemProps {
  item: MenuItemType;
  onDetailsClick: (item: MenuItemType) => void;
}

export function MenuItem({ item, onDetailsClick }: MenuItemProps) {
  // Función para obtener la URL de imagen pública de Google Drive
  const getImageUrl = (imageRef: string) => {
    if (!imageRef) return "";
    
    // Si es una URL completa de Google Drive, extraer el id
    if (imageRef.includes('drive.usercontent.google.com') || imageRef.includes('drive.google.com')) {
      const match = imageRef.match(/[?&]id=([^&]+)/);
      if (match) {
        const driveId = match[1];
        return `https://corsproxy.io/?${encodeURIComponent(`https://drive.usercontent.google.com/download?id=${driveId}&authuser=0`)}`;
      }
    }
    
    // Si es una URL directa, usarla con proxy
    if (imageRef.startsWith("http")) {
      return `https://corsproxy.io/?${encodeURIComponent(imageRef)}`;
    }
    
    return "";
  };

  const imageUrl = getImageUrl(item.image || "");

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-full h-full flex items-center justify-center ${imageUrl ? 'hidden' : ''}`}>
            <div className="w-8 h-8 border-2 border-gray-400 rounded"></div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            <span className="text-orange-600 font-bold">
              L{item.price.toFixed(2)} 
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-3">{item.description}</p>

          <div className="flex justify-end">
            <button
              onClick={() => onDetailsClick(item)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
