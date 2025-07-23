import { useNavigate, useLocation } from "react-router-dom";

export function MenuNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isMenuActive = location.pathname === "/cliente";
  const isMisPedidosActive = location.pathname === "/mis-pedidos";

  // Obtener los parámetros actuales
  const search = location.search;

  return (
    <div className="sticky top-16 z-40 bg-gray-50 mt-6 px-4 py-2 shadow-sm">
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => navigate(`/cliente${search}`)}
          className={`flex-1 py-2 text-center text-sm font-medium rounded-md ${
            isMenuActive ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
          }`}
        >
          Menú
        </button>
        <button
          onClick={() => navigate(`/mis-pedidos${search}`)}
          className={`flex-1 py-2 text-center text-sm font-medium rounded-md ${
            isMisPedidosActive
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600"
          }`}
        >
          Mis Pedidos
        </button>
      </div>
    </div>
  );
}
