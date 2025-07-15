import React from "react";

interface NavigationItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  textClass?: string;
  itemClass?: string;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  icon,
  label,
  isActive = false,
  onClick,
  textClass,
  itemClass,
}) => {
  const baseClasses =
    "flex flex-col items-center justify-center gap-1 px-2 py-1 transition-colors duration-200";
  const textClasses = textClass ? textClass : (isActive ? "text-white font-bold" : "text-white opacity-80");
  const iconGlow = isActive ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" : "";

  return (
    <button className={itemClass ? itemClass : baseClasses} onClick={onClick} style={{background: 'transparent'}}>
      <div className={iconGlow}>{icon}</div>
      <span className={`text-base ${textClasses}`}>{label}</span>
    </button>
  );
};
