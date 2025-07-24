//Pagina para detalles de productos en la vista del cliente osea seccion de complementos, etc

import { useState, useEffect } from "react";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import type { MenuItem, Complement } from "../../components/cliente/shared/restaurant-types.ts";
import { toast } from "sonner";
import { fetchComplementos } from "../../components/cliente/fetch/products.ts";

interface ProductDetailPageProps {
  item: MenuItem;
  onBack: () => void;
  onAddToCart: (
    item: MenuItem,
    complements: Complement[],
    instructions: string,
    quantity: number,
  ) => void;
}

export default function ProductDetailPage({
  item,
  onBack,
  onAddToCart,
}: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");
  const [complements, setComplements] = useState<Complement[]>([]);
  const [loadingComplements, setLoadingComplements] = useState(true);

  useEffect(() => {
    setLoadingComplements(true);
    fetchComplementos(item.id)
      .then((data) => {
        const comps = Array.isArray(data.complementos) ? data.complementos.map((c: any) => ({
          id: c.id,
          name: c.nombre || c.name || "Complemento",
          price: Number(c.precio ?? c.price ?? 0),
          selected: false,
        })) : [];
        setComplements(comps);
      })
      .catch(() => setComplements([]))
      .finally(() => setLoadingComplements(false));
  }, [item.id]);

  // FUncion que Permite alterar el estado selected de un complemento especfico
  const toggleComplement = (complementId: number) => {
    setComplements((prev) =>
      prev.map((comp) =>
        comp.id === complementId ? { ...comp, selected: !comp.selected } : comp,
      ),
    );
  };

  // Calculo del total del precio del producto con complementos y cantidad
  const selectedComplements = complements.filter((comp) => comp.selected);
  const complementsTotal = selectedComplements.reduce(
    (sum, comp) => sum + comp.price,
    0,
  );
  const totalPrice = (item.price + complementsTotal) * quantity;


  // Maneja la accion de agregar el producto al carrito
  const handleAddToCart = () => {
    onAddToCart(item, selectedComplements, instructions, quantity);

    toast("Producto agregado al carrito", {
      description: `${item.name} x${quantity}`,
      duration: 3000,
      style: {
        backgroundColor: "#fb3260",
        color: "white",
        fontWeight: "500",
      },
    });

    onBack();
  };

  // Asegura que la pagina se desplace al inicio al cargar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-32">
        {/* Product image with back button overlay */}
        <div className="h-64 bg-gray-300 relative overflow-hidden mx-4 mt-4 rounded-lg">
          {item.image ? (
            <img
              src={`https://corsproxy.io/?${encodeURIComponent(item.image)}`}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`absolute inset-0 bg-gray-400 flex items-center justify-center ${item.image ? 'hidden' : ''}`}>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-400 rounded"></div>
            </div>
          </div>

          {/* Back button overlay */}
          <button
            onClick={onBack}
            className="absolute top-4 left-4 p-3 bg-white bg-opacity-90 rounded-full shadow-lg hover:bg-opacity-100 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Product info */}
        <div className="px-4 mt-6">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            {item.name}
          </h1>
          <p className="text-gray-600 text-center leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Complements section */}
        {!loadingComplements && complements.length > 0 && (
          <div className="mx-4 mt-8">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Complementos
              </h2>
              <div className="space-y-4">
                {complements.map((complement) => (
                  <div
                    key={complement.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-gray-900">
                        {complement.name}
                      </div>
                      <div className="text-gray-600">
                        +L{complement.price.toFixed(2)}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleComplement(complement.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${complement.selected
                          ? "border-orange-500 bg-orange-500"
                          : "border-orange-500 bg-white"
                        }`}
                    >
                      {complement.selected && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Special instructions */}
        <div className="mx-4 mt-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Instrucciones Especiales
            </h2>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Ej: Sin cebolla, extra picante, bien cocido..."
              className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Fixed bottom section */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        {/* Quantity and total */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="font-medium text-gray-900">Cantidad:</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-orange-500 text-white rounded-lg flex items-center justify-center"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="font-bold text-lg min-w-[30px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 bg-orange-500 text-white rounded-lg flex items-center justify-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="text-right">
            <div className="font-medium text-gray-900">Total:</div>
            <div className="text-2xl font-bold text-orange-600">
              L{totalPrice.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}
