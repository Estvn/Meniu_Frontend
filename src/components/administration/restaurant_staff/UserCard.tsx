"use client";
import React from "react";
import { StatusBadge } from "./StatusBadge";
import { RoleBadge } from "./RoleBadge";
import { ActionButtons } from "./ActionButtons";
import type { User } from "../../../types/User";

interface UserCardProps {
  user: User;
  onEdit: (userId: number) => void;
  onDelete: (userId: number) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
}) => {
  // Generar iniciales desde nombre y apellidos
  const getInitials = (nombre: string, apellidos: string) => {
    const firstInitial = nombre.charAt(0).toUpperCase();
    const lastInitial = apellidos.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  const initials = getInitials(user.nombre, user.apellidos);
  
  // Determinar color del avatar basado en el rol
  const avatarBgColor = user.rol === "Cajero" ? "bg-violet-100" : "bg-gray-100";
  const avatarTextColor = user.rol === "Cajero" ? "text-violet-600" : "text-gray-600";

  // Convertir rol de la API al formato esperado por RoleBadge
  const getRoleForBadge = (rol: string) => {
    switch (rol) {
      case "Cajero":
        return "cashier";
      case "Cocinero":
        return "cook";
      case "Gerente":
        return "manager";
      default:
        return "cashier";
    }
  };

  // Convertir estado activo (1/0) al formato esperado por StatusBadge
  const getStatusForBadge = (activo: number) => {
    return activo === 1 ? "active" : "inactive";
  };

  return (
    <article className="flex flex-col gap-4 p-4 sm:p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex justify-center items-center w-12 h-12 ${avatarBgColor} rounded-full flex-shrink-0`}
          >
            <span
              className={`text-lg font-bold leading-7 ${avatarTextColor}`}
            >
              {initials}
            </span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold leading-6 text-gray-900 truncate">
              {user.nombreUsuario}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {user.nombre} {user.apellidos}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <RoleBadge role={getRoleForBadge(user.rol)} />
            <StatusBadge status={getStatusForBadge(user.activo)} />
          </div>
          <ActionButtons
            onEdit={() => onEdit(user.id_usuario)}
            onDelete={() => onDelete(user.id_usuario)}
          />
        </div>
      </div>
    </article>
  );
};
