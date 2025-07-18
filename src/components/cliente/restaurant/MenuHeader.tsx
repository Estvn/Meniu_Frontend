//Header de la app

import { ShoppingCart, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {useState} from "react";
import Logo from "../../../../public/img/logoHorizontal.png";
import {RequestBillModal} from "../orders/SolicitarPago.tsx";


interface HeaderProps {
  totalItems: number;
  hasActiveOrders?: boolean;
  hasOrdersWithCancelTime?: boolean;
}

// totalItems: Cantidad total de productos en el carrito
// onNavigate: Función para navegar a la página del carrito

export function Header({ totalItems,  hasActiveOrders = false, hasOrdersWithCancelTime = false, }: HeaderProps) {
   const navigate = useNavigate();
  const [isRequestBillModalOpen, setIsRequestBillModalOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm px-4 py-3 flex items-center justify-between z-50">
      <div className="flex items-center">
      <img src={Logo} alt="Logo" className="w-25 h-10 object-contain" />
      </div>

      <div className="flex items-center gap-3">
        <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
          Mesa 1
        </button>
        <button onClick={() => setIsRequestBillModalOpen(true)}
          className="p-2 relative hover:bg-gray-100 rounded-full transition-colors"
          title="Solicitar la cuenta">
          <CreditCard className="w-6 h-6 text-gray-600" />
        </button>
        <button onClick={() => navigate("/carrito")} className="p-2 relative">
          <ShoppingCart className="w-6 h-6 text-gray-600" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      <RequestBillModal
        isOpen={isRequestBillModalOpen}
        onClose={() => setIsRequestBillModalOpen(false)}
        hasActiveOrders={hasActiveOrders}
        hasOrdersWithCancelTime={hasOrdersWithCancelTime}
      />
    </header>
  );
}
