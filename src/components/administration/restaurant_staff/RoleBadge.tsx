import React from "react";

interface RoleBadgeProps {
  role: "cashier" | "cook";
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const isCashier = role === "cashier";

  return (
    <div
      className={`flex items-center px-2 sm:px-3 py-1 rounded-full ${
        isCashier ? "bg-violet-100" : "bg-blue-100"
      }`}
    >
      <span
        className={`text-xs sm:text-sm font-bold leading-4 ${
          isCashier ? "text-violet-800" : "text-blue-800"
        }`}
      >
        {isCashier ? "Cajero" : "Cocinero"}
      </span>
    </div>
  );
};
