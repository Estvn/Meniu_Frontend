import { CartItem as CartItemComponent } from "./CartItem.tsx";
import type { CartItem as CartItemType } from "../../cliente/shared/restaurant-types.ts";

interface CartItemsListProps {
  items: CartItemType[];
  onUpdateQuantity: (uid: string, newQuantity: number) => void;
  onRemoveItem: (uid: string) => void;
}

export function CartItemsList({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemsListProps) {
  return (
    <div className="space-y-4 mb-8">
      {items.map((item) => (
        <CartItemComponent
          key={item.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemoveItem}
        />
      ))}
    </div>
  );
}
