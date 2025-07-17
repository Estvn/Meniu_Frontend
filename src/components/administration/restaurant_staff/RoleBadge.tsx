import React from "react";

interface RoleBadgeProps {
  role: "cashier" | "cook" | "manager";
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const getRoleConfig = (role: string) => {
    switch (role) {
      case "cashier":
        return {
          bgColor: "bg-violet-100",
          textColor: "text-violet-800",
          text: "Cajero"
        };
      case "cook":
        return {
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          text: "Cocinero"
        };
      case "manager":
        return {
          bgColor: "bg-orange-100",
          textColor: "text-orange-800",
          text: "Gerente"
        };
      default:
        return {
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          text: "Usuario"
        };
    }
  };

  const config = getRoleConfig(role);

  return (
    <div
      className={`flex items-center px-2 sm:px-3 py-1 rounded-full ${config.bgColor}`}
    >
      <span
        className={`text-xs sm:text-sm font-bold leading-4 ${config.textColor}`}
      >
        {config.text}
      </span>
    </div>
  );
};
