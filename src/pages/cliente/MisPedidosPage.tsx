import { useNavigate } from "react-router-dom";
import type { Order } from "../../components/cliente/shared/order-types.ts";
import { Header } from "../../components/cliente/restaurant/MenuHeader.tsx";
import { RestaurantInfo } from "../../components/cliente/restaurant/RestaurantInfoCard.tsx";
import { OrderSummary } from "../../components/cliente/orders/OrderSummary.tsx";
import { OrderCard } from "../../components/cliente/orders/OrderCart.tsx";
import { MenuNavigation } from "../../components/cliente/restaurant/MenuNavigation.tsx";
import { ScrollToTop } from "../../components/cliente/restaurant/ScrollToTop.tsx";
import { useScrollToTop } from "../../components/cliente/hooks/useScrollToTop.ts";
import { toast } from "sonner";

interface MisPedidosPageProps {
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
  totalActiveAmount: number;
  activeOrdersCount: number;
  totalCartItems: number;
}

export default function MisPedidosPage({
  orders,
  onCancelOrder,
  totalActiveAmount,
  activeOrdersCount,
  totalCartItems,
}: MisPedidosPageProps) {
  const navigate = useNavigate();
  const { showScrollTop, scrollToTop } = useScrollToTop();

  const handleCancelOrder = (orderId: string) => {
    onCancelOrder(orderId);

    toast.error("Pedido cancelado", {
      description: "El pedido ha sido cancelado exitosamente",
      duration: 3000,
    });
  };

  

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Header totalItems={totalCartItems} />
      <RestaurantInfo />
      <MenuNavigation />
    

      <div className="p-4">
        {/* Order Summary */}
        <OrderSummary
          totalAmount={totalActiveAmount}
          activeOrdersCount={activeOrdersCount}
        />

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={`${order.id}-${order.orderNumber}`}
              order={order}
              onCancelOrder={handleCancelOrder}
            />
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes pedidos
            </h3>
            <p className="text-gray-500 mb-6">
              Cuando hagas un pedido, aparecerá aquí
            </p>
            <button
              onClick={() => navigate("/cliente")}
              className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Ver Menú
            </button>
          </div>
        )}
      </div>

      <ScrollToTop isVisible={showScrollTop} onClick={scrollToTop} />
    </div>
  );
}
