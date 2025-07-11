import { Clock, MapPin } from "lucide-react";

export function RestaurantInfo() {
  return (
    <>
      {/* Restaurant Hero Image Placeholder */}
      <div className="h-48 bg-gray-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-400 flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-400 rounded"></div>
          </div>
        </div>
      </div>

      {/* Restaurant Info Card */}
      <div className="mx-4 -mt-10 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-black mb-4">La Trattoria</h1>

          <div className="flex items-center gap-1 mb-4">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 text-sm">25-35 min</span>
          </div>

          <div className="flex items-center gap-1 mb-6">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 text-sm">
              Calle Principal 123, Ciudad
            </span>
          </div>

          <p className="text-gray-700 leading-relaxed">
            Auténtica cocina italiana con ingredientes
            <br />
            frescos y recetas tradicionales.
          </p>
        </div>
      </div>
    </>
  );
}
