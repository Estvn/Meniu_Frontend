interface EmptyCartProps {
    onViewMenu: () => void;
  }
  
  export function EmptyCart({ onViewMenu }: EmptyCartProps) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 min-h-[70vh]">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🛒</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-500 mb-6">
            Agrega algunos productos deliciosos para empezar
          </p>
          <button
            onClick={onViewMenu}
            className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            Ver Menú
          </button>
        </div>
      </div>
    );
  }
  