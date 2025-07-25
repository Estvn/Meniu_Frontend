import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useScrollToTop } from "../../components/cliente/hooks/useScrollToTop.ts";
import { ScrollToTop } from "../../components/cliente/restaurant/ScrollToTop.tsx";
import { Header } from "../../components/cliente/restaurant/MenuHeader.tsx";
import { RestaurantInfo } from "../../components/cliente/restaurant/RestaurantInfoCard.tsx";
import { getRestaurantById } from "../../components/cliente/fetch/restaurant.ts";
import { MenuNavigation } from "../../components/cliente/restaurant/MenuNavigation.tsx";
import { OrderSummary } from "../../components/cliente/orders/OrderSummary.tsx";
import { OrderCard } from "../../components/cliente/orders/OrderCart.tsx";
import { toast } from "sonner";
import type { Order } from "../../components/cliente/shared/order-types.ts";
import type { Restaurante } from "../../components/cliente/shared/restaurant-types.ts";

interface MisPedidosPageProps {
  orders: Order[];
  onCancelOrder: (orderId: number | undefined) => void;
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
  const [numeroMesa, setNumeroMesa] = useState<number | null>(null);
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const restauranteId = localStorage.getItem("id_restaurante");
  const mesaId = localStorage.getItem("id_mesa");
  const numMesa = localStorage.getItem("num_mesa");

  const { showScrollTop, scrollToTop } = useScrollToTop();

  useEffect(() => {
    const storedNumMesa = numMesa;
    const storedRestaurante = restauranteId;

    if (storedNumMesa) setNumeroMesa(Number(storedNumMesa));
    if (storedRestaurante) {
      const restauranteId = Number(storedRestaurante);

      getRestaurantById(restauranteId)
        .then(setRestaurante)
        .catch(() => {
          toast.error("Error al cargar el restaurante");
        });
    }
  }, [restauranteId, numMesa]);

  const handleCancelOrder = (orderId: number | undefined) => {
    onCancelOrder(orderId);

    toast.error("Pedido cancelado", {
      description: "El pedido ha sido cancelado exitosamente",
      duration: 3000,
      style: {
        backgroundColor: "#ef4444",
        color: "white",
        fontWeight: "500",
      },
    });
  };

  // Calcular si hay pedidos activos (PENDIENTE, PREPARANDO o LISTO)
  const hasActiveOrders = orders.some(
    (order) => order.estado === "PENDIENTE" || order.estado === "PREPARANDO" || order.estado === "ENTREGADA"
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {numeroMesa !== null && (
        <Header totalItems={totalCartItems} numeroMesa={numeroMesa} hasActiveOrders={hasActiveOrders} />
      )}
      {restaurante && <RestaurantInfo restaurant={restaurante} />}
      <MenuNavigation />

      <div className="p-4">
        {/* Resumen de pedidos activos */}
        <OrderSummary
          totalAmount={Number(totalActiveAmount) || 0}
          activeOrdersCount={activeOrdersCount}
        />

        {/* Lista de pedidos */}
        <div className="space-y-4">
          {orders.map((order) => {
            const cancelId = order.id_orden !== null && order.id_orden !== undefined
              ? order.id_orden
              : (order.timestamp_creacion !== undefined ? order.timestamp_creacion : undefined);
            return (
            <OrderCard
                key={order.id_orden ?? order.timestamp_creacion}
              order={order}
                onCancelOrder={cancelId !== undefined ? () => handleCancelOrder(cancelId) : undefined}
            />
            );
          })}
        </div>

        {/* Sin pedidos */}
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
              onClick={() => navigate(`/cliente?id_restaurante=${restauranteId}&id_mesa=${mesaId}&num_mesa=${numMesa}`)}
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
