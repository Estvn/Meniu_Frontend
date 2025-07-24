interface OrderSummaryProps {
  totalAmount: number;
  activeOrdersCount: number;
}

export function OrderSummary({
  totalAmount,
  activeOrdersCount,
}: OrderSummaryProps) {
  return (
    <div className="bg-orange-100 rounded-lg p-4 mb-6 border border-orange-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Total a Pagar</h3>
            <p className="text-sm text-orange-700">
              {activeOrdersCount} pedido(s) activo(s)
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            L{totalAmount.toFixed(2)}
          </p>
          <p className="text-sm text-orange-700">Mesa {localStorage.getItem("num_mesa")}</p>
        </div>
      </div>
    </div>
  );
}
