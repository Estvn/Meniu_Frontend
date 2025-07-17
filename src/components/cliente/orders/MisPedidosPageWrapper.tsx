import MisPedidosPage from "../../../pages/cliente/MisPedidosPage.tsx";
import { useCart } from "../../../components/cliente/hooks/useCart.ts";
import { useOrders } from "../../../components/cliente/hooks/useOrders.ts";

export default function MisPedidosPageWrapper() {
  const {
    orders,
    cancelOrder,
    getActiveOrders,
    getTotalActiveAmount,
  } = useOrders();

  const { totalItems: totalCartItems } = useCart();

  return (
    <MisPedidosPage
      orders={orders}
      onCancelOrder={cancelOrder}
      totalActiveAmount={getTotalActiveAmount()}
      activeOrdersCount={getActiveOrders().length}
      totalCartItems={totalCartItems}
    />
  );
}
