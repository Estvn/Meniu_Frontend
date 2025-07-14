interface CartActionsProps {
    onPlaceOrder: () => void;
  }
  
  export function CartActions({ onPlaceOrder }: CartActionsProps) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={onPlaceOrder}
          className="w-full py-4 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors text-lg"
        >
          Realizar Pedido
        </button>
      </div>
    );
  }
  