import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "../../cliente/shared/restaurant-types.ts";

// Función para obtener la URL de imagen pública de Google Drive con proxy CORS
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

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (uid: string, newQuantity: number) => void;
  onRemove: (uid: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const imageUrl = getImageUrl(item.image || "");
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4">
      {/* Imagen del producto */}
      <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 border border-gray-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              console.warn(`Error al cargar imagen para ${item.name}:`, e);
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-full h-full flex items-center justify-center ${imageUrl ? 'hidden' : ''}`}>
          <div className="w-8 h-8 border-2 border-gray-400 rounded"></div>
        </div>
      </div>

      {/* Detalles del producto */}
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 text-base">{item.name}</h3>

        {(() => {
          if (item.complements && item.complements.length > 0) {
            const selectedComps = item.complements.filter(
              (comp) => comp.selected
            );
            if (selectedComps.length > 0) {
              return (
                <div className="mt-1 ml-2">
                  <ul className="list-disc ml-4 text-xs text-gray-600">
                    {selectedComps.map((comp) => (
                      <li key={comp.id}>
                        {comp.name} <span className="text-orange-600 font-semibold">+L{comp.price.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
          }
          return null;
        })()}

        <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Precio por unidad */}
          <span className="text-orange-600 font-bold text-base">
            L{item.price.toFixed(2)}
          </span>

          {/* Botones de cantidad y eliminar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(item.uid, item.quantity - 1)}
              className="w-8 h-8 border-2 border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
              disabled={item.quantity <= 1}
            >
              <Minus className="w-4 h-4 text-gray-600" />
            </button>

            <span className="font-bold text-base min-w-[30px] text-center">
              {item.quantity}
            </span>

            <button
              onClick={() => onUpdateQuantity(item.uid, item.quantity + 1)}
              className="w-8 h-8 border-2 border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>

            <button
              onClick={() => onRemove(item.uid)}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
