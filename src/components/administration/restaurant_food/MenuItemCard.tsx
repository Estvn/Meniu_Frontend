"use client";


interface MenuItemCardProps {
  name: string;
  description: string;
  price: string;
  status: string;
  category: string;
  image: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function MenuItemCard({
  name,
  description,
  price,
  status,
  category,
  image,
  onEdit,
  onDelete,
}: MenuItemCardProps) {
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
            status === "Disponible" ? "text-green-600" : "text-red-600"
          }`}>
            {status}
          </span>
        </div>

        {/* Image */}
        <div className="flex justify-center sm:justify-end">
          <img
            src={image}
            alt={name}
            className="h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Category Badge */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-red-50 text-orange-600 text-xs font-bold rounded-full">
          {category}
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
          onClick={onDelete}
          className="flex-1 px-4 py-2 sm:py-3 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors duration-200 text-sm"
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}
