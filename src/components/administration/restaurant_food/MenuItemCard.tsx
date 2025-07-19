"use client";

import React from "react";

interface MenuItemCardProps {
  name: string;
  description: string;
  price: string;
  status: string;
  categoria: string;
  subcategoria: string;
  image: string;
  isActive: boolean;
  onEdit?: () => void;
  onToggleStatus?: () => void;
}

// Función para obtener la URL de imagen pública de Google Drive
function getImageUrl(ref: string) {
  if (!ref) return "";

  // Si empieza con @, quitarlo
  if (ref.startsWith("@")) ref = ref.slice(1);

  // Normalizar la referencia de imagen (puede ser ID o URL completa)
  let driveId = ref;
  
  // Si es una URL completa de Google Drive, extraer el id
  if (ref.includes('drive.usercontent.google.com') || ref.includes('drive.google.com')) {
    const match = ref.match(/[?&]id=([^&]+)/);
    if (match) {
      driveId = match[1];
    }
  }

  // Si es solo el ID (sin https)
  if (/^[\w-]{20,}$/.test(driveId)) {
    // Usar proxy corsproxy.io que es más confiable
    return `https://corsproxy.io/?${encodeURIComponent(`https://drive.usercontent.google.com/download?id=${driveId}&authuser=0`)}`;
  }

  // Si es una URL directa, usarla con proxy
  if (ref.startsWith("http")) {
    return `https://corsproxy.io/?${encodeURIComponent(ref)}`;
  }

  return "";
}

export function MenuItemCard({
  name,
  description,
  price,
  status,
  categoria,
  subcategoria,
  image,
  isActive,
  onEdit,
  onToggleStatus,
}: MenuItemCardProps) {
  const imageUrl = getImageUrl(image);
  const [imageLoading, setImageLoading] = React.useState(true);
  const [imageError, setImageError] = React.useState(false);

  // Resetear estado cuando cambie la imagen
  React.useEffect(() => {
    setImageLoading(true);
    setImageError(false);
  }, [imageUrl]);



  return (
    <article className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-4 sm:p-6">
      {/* Header Section */}
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
          {name}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {/* Price */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 mb-1">Precio:</span>
          <span className="text-lg sm:text-xl font-bold text-emerald-600">
            {price}
          </span>
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 mb-1">Estado:</span>
          <span className={`text-sm font-medium ${
            status.toLowerCase().includes("disponible") ? "text-green-600" : "text-red-600"
          }`}>
            {status}
          </span>
        </div>

        {/* Image */}
        <div className="flex justify-center sm:justify-end relative">
          {imageUrl ? (
            <>
              {/* Indicador de carga */}
              {imageLoading && (
                <div className="absolute inset-0 h-20 w-20 sm:h-24 sm:w-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                </div>
              )}
              
              {/* Imagen */}
              <img
                src={imageUrl}
                alt={name}
                className={`h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-lg transition-opacity duration-300 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                loading="lazy"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                  setImageError(true);
                }}
              />
              
              {/* Error state */}
              {imageError && (
                <div className="absolute inset-0 h-20 w-20 sm:h-24 sm:w-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500">Error</span>
                </div>
              )}
            </>
          ) : (
            <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-500">Sin imagen</span>
            </div>
          )}
        </div>
      </div>

      {/* Category Badge */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-red-50 text-orange-600 text-xs font-bold rounded-full">
          {categoria} - {subcategoria}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button 
          onClick={onEdit}
          className="flex-1 px-4 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200 text-sm"
        >
          Editar
        </button>
        <button 
          onClick={onToggleStatus}
          className={`flex-1 px-4 py-2 sm:py-3 font-medium rounded-lg transition-colors duration-200 text-sm ${
            isActive 
              ? "bg-red-50 hover:bg-red-100 text-red-600" 
              : "bg-green-50 hover:bg-green-100 text-green-600"
          }`}
        >
          {isActive ? "Deshabilitar" : "Habilitar"}
        </button>
      </div>
    </article>
  );
}
