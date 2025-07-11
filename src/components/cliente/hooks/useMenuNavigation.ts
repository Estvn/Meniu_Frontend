import { useState } from "react";
import type { MenuItem, MenuCategories } from "../shared/restaurant-types";

export function useMenuNavigation(menuCategories: MenuCategories) {
  const [activeCategory, setActiveCategory] = useState("Alimentos");
  const [activeSubCategory, setActiveSubCategory] = useState("Ver todo");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const scrollToCategories = () => {
    // Calculate the height of fixed elements precisely to position at category title
    const headerHeight = 64; // header with pt-16
    const restaurantHeroHeight = 192; // h-48 for hero image
    const restaurantCardOffset = -64; // negative margin on card
    const restaurantCardHeight = 200; // restaurant info card height
    const menuNavigationHeight = 60; // menu/orders navigation (sticky top-16)
    const categoryNavigationHeight = 80; // category tabs navigation (sticky top-28)

    // Calculate total height to scroll to category title start
    const scrollTarget =
      headerHeight +
      restaurantHeroHeight +
      restaurantCardOffset +
      restaurantCardHeight +
      menuNavigationHeight +
      categoryNavigationHeight -
      10;

    window.scrollTo({
      top: scrollTarget,
      behavior: "smooth",
    });
  };

  const handleCategoryClick = (category: string) => {
    if (openDropdown === category) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(category);
      // Don't change category immediately, wait for subcategory selection
    }
  };

  const handleSubCategoryClick = (
    subCategory: string,
    categoryFromDropdown?: string,
  ) => {
    // Change category only when subcategory is selected
    if (categoryFromDropdown && categoryFromDropdown !== activeCategory) {
      setActiveCategory(categoryFromDropdown);
    }
    setActiveSubCategory(subCategory);
    setOpenDropdown(null);
    // Scroll to the beginning of the new subcategory
    setTimeout(() => {
      scrollToCategories();
    }, 100);
    
  };

  const getCurrentItems = (): MenuItem[] => {
    const categoryData = menuCategories[activeCategory];
    if (!categoryData) return [];

    if (activeSubCategory === "Ver todo") {
      return categoryData.reduce((allItems: MenuItem[], subCategory) => {
        return [...allItems, ...subCategory.items];
      }, []);
    }

    const subCategoryData = categoryData.find(
      (sub) => sub.name === activeSubCategory,
    );
    return subCategoryData ? subCategoryData.items : [];
  };

  return {
    activeCategory,
    activeSubCategory,
    openDropdown,
    handleCategoryClick,
    handleSubCategoryClick,
    setOpenDropdown,
    getCurrentItems,
  };
}
