import { ArrowLeft } from "lucide-react";

interface CartHeaderProps {
  onBack: () => void;
}

export function CartHeader({ onBack }: CartHeaderProps) {
  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center z-50">
      <button
        onClick={onBack}
        className="p-2 hover:bg-gray-100 rounded-full mr-3"
      >
        <ArrowLeft className="w-6 h-6 text-gray-600" />
      </button>
      <h1 className="text-xl font-bold text-gray-900">Carrito</h1>
    </header>
  );
}
