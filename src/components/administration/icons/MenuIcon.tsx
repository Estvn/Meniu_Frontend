import React from "react";

interface MenuIconProps {
  className?: string;
}

export const MenuIcon: React.FC<MenuIconProps> = ({
  className = "",
}) => {
  const strokeColor = "#fff";
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <line x1="4" y1="6" x2="20" y2="6" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="12" x2="20" y2="12" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="18" x2="20" y2="18" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};
