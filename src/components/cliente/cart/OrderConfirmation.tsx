import { CheckCircle } from "lucide-react";
import type { CartItem } from "../shared/restaurant-types.ts";

interface OrderConfirmationModalProps {
  isOpen: boolean;
  cart: CartItem[];
  totalPrice: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function OrderConfirmationModal({
  isOpen,
  cart,
  totalPrice,
  onConfirm,
  onCancel,
}: OrderConfirmationModalProps) {
  if (!isOpen) return null;

  // Calcular subtotal incluyendo producto principal y complementos
  const subtotal = cart.reduce((sum, item) => {
    // Precio del producto principal
    const productPrice = item.price * item.quantity;
    
    // Precio de los complementos seleccionados
    const complementsPrice = (item.complements || [])
      .filter((comp) => comp.selected)
      .reduce((compSum, comp) => compSum + comp.price, 0) * item.quantity;
    
    return sum + productPrice + complementsPrice;
  }, 0);
  
  const isv = subtotal * 0.15;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-6 m-4 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Confirmar Pedido
          </h2>
          <p className="text-gray-600">
            ¿Estás seguro que deseas realizar este pedido? Se enviará a la
            cocina inmediatamente.
          </p>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Resumen del Pedido - Mesa {localStorage.getItem("num_mesa")}
          </h3>

          <div className="space-y-2 mb-4">
            {cart.map((item) => (
              <div key={item.uid} className="space-y-1">
                {/* Producto principal */}
                <div className="flex justify-between text-sm">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>L{(item.price * item.quantity).toFixed(2)}</span>
                </div>
                
                {/* Complementos seleccionados */}
                {item.complements && item.complements.filter(comp => comp.selected).length > 0 && (
                  <div className="ml-4 space-y-1">
                    {item.complements
                      .filter(comp => comp.selected)
                      .map((comp) => (
                        <div key={comp.id} className="flex justify-between text-xs text-gray-600">
                          <span>• {comp.name}</span>
                          <span>+L{comp.price.toFixed(2)}</span>
                        </div>
                      ))}
                  </div>
                )}
                
                {/* Instrucciones especiales */}
                {item.instructions && item.instructions.trim() && (
                  <div className="ml-4">
                    <div className="text-xs text-gray-500 italic">
                      Nota: {item.instructions}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-3 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({cart.length} productos):</span>
              <span>L{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>ISV (15%)</span>
              <span>L{isv.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span className="text-orange-600">L{totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            Sí, Realizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
