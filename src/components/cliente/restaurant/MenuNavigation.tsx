export function MenuNavigation() {
    return (
      <div className="sticky top-16 z-40 bg-gray-50 mt-6 px-4 py-2 shadow-sm">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button className="flex-1 py-2 text-center text-sm font-medium rounded-md bg-white text-gray-900 shadow-sm">
            Menú
          </button>
          <button className="flex-1 py-2 text-center text-sm font-medium rounded-md text-gray-600">
            Mis Pedidos
          </button>
        </div>
      </div>
    );
  }
  