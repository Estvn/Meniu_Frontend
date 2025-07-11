import React from "react";

interface StatusBadgeProps {
  status: "active" | "inactive";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const isActive = status === "active";

  return (
    <div
      className={`flex items-center px-2 sm:px-3 py-1 rounded-full ${
        isActive ? "bg-emerald-100" : "bg-red-100"
      }`}
    >
      <span
        className={`text-xs sm:text-sm font-bold leading-4 ${
          isActive ? "text-emerald-800" : "text-red-800"
        }`}
      >
        {isActive ? "Activo" : "Inactivo"}
      </span>
    </div>
  );
};
