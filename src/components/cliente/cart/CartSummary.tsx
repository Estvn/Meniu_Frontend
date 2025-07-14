interface CartSummaryProps {
    itemCount: number;
    subtotal: number;
    isv: number;
    total: number;
  }
  
  export function CartSummary({
    itemCount,
    subtotal,
    isv,
    total,
  }: CartSummaryProps) {
    return (
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-lg">
          <span className="font-medium">Subtotal ({itemCount} productos):</span>
          <span className="font-medium">L{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>ISV (15%)</span>
          <span>L{isv.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold border-t pt-2">
          <span>Total:</span>
          <span className="text-orange-600">L{total.toFixed(2)}</span>
        </div>
      </div>
    );
  }
  