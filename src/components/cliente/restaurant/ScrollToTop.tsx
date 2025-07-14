//Proporciona boton flotante

import { ArrowUp } from "lucide-react";

//isVisible: Indica si el botón debe ser visible
// onClick: Función que se ejecuta al hacer clic en el botón

interface ScrollToTopProps {
  isVisible: boolean;
  onClick: () => void;
}

export function ScrollToTop({ isVisible, onClick }: ScrollToTopProps) {
  if (!isVisible) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-all z-40"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
