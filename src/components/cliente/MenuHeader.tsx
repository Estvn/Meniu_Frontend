import { CreditCard, ShoppingCart } from "lucide-react";

interface MenuHeaderProps {
  totalItems: number;
}

export default function MenuHeader({ totalItems }: MenuHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-white shadow-sm px-4 py-3 flex items-center justify-between z-50 max-w-screen overflow-hidden">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-gray-900">Meniu</span>
      </div>

      <div className="flex items-center gap-3">
        <button className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
          Mesa 1
        </button>
        <button className="p-2 relative">
          <CreditCard className="w-6 h-6 text-gray-600" />
        </button>
        <button className="p-2 relative">
          <ShoppingCart className="w-6 h-6 text-gray-600" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
