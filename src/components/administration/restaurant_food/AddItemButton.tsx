"use client";

export function AddItemButton() {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:bottom-6 sm:left-6 sm:right-6 md:bottom-8 md:left-8 md:right-8 lg:bottom-10 lg:left-10 lg:right-10 max-w-sm mx-auto">
      <button className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transition-all duration-200 ease-in-out rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] p-3 sm:p-4 min-h-[48px] sm:min-h-[56px] flex items-center justify-center">
        <span className="text-sm sm:text-base font-medium text-white text-center">
          Agregar Nuevo Elemento al Menú
        </span>
      </button>
    </div>
  );
}
