import { MenuItem as MenuItemComponent } from "./MenuItem";
import { type MenuItem as MenuItemType } from "./shared/restaurant-types";


interface MenuGridProps {
  items: MenuItemType[];
  activeCategory: string;
  activeSubCategory: string;
  onItemClick: (item: MenuItemType) => void;
}

export function MenuGrid({
  items,
  activeCategory,
  activeSubCategory,
  onItemClick,
}: MenuGridProps) {
  return (
    <>
      {/* Current Category/SubCategory Title */}
      <div className="mt-6 px-4">
        <h2 className="text-xl font-bold text-gray-900">
          {activeCategory}
          {activeSubCategory !== "Ver todo" && (
            <span className="text-gray-500 font-normal">
              {" "}
              → {activeSubCategory}
            </span>
          )}
        </h2>
      </div>

      {/* Menu Items */}
      <div className="mt-4 px-4 pb-6">
        <div className="space-y-4">
          {items.map((item) => (
            <MenuItemComponent
              key={item.id}
              item={item}
              onDetailsClick={onItemClick}
            />
          ))}
        </div>
      </div>
    </>
  );
}
