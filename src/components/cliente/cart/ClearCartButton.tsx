import { Trash2 } from "lucide-react";

interface ClearCartButtonProps {
  onClearCart: () => void;
}

export function ClearCartButton({ onClearCart }: ClearCartButtonProps) {
  return (
    <div className="mb-6 flex justify-center">
      <button
        onClick={onClearCart}
        className="px-4 py-3 text-orange-600 font-medium rounded-lg border border-orange-500 hover:bg-orange-50 transition-colors flex items-center gap-2"
      >
        <Trash2 className="w-5 h-5" />
        Vaciar carrito
      </button>
    </div>
  );
}
