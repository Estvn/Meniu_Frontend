//Header de la app

import { ShoppingCart, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../../public/img/logoHorizontal.png";


interface HeaderProps {
  totalItems: number;
}

// totalItems: Cantidad total de productos en el carrito
// onClearCart: Función para vaciar el carrito
// onNavigate: Función para navegar a la página del carrito

export function Header({ totalItems }: HeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm px-4 py-3 flex items-center justify-between z-50">
      <div className="flex items-center">
      <img src={Logo} alt="Logo" className="w-25 h-10 object-contain" />
      </div>

      <div className="flex items-center gap-3">
        <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
          Mesa 1
        </button>
        <button className="p-2 relative">
          <CreditCard className="w-6 h-6 text-gray-600" />
        </button>
        <button className="p-2 relative" onClick={() => navigate("/carrito")}>
          <ShoppingCart className="w-6 h-6 text-gray-600" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#FB3260] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
