"use client";
import React from "react";
import { StatusBadge } from "./StatusBadge";
import { RoleBadge } from "./RoleBadge";
import { ActionButtons } from "./ActionButtons";

interface User {
  id: string;
  name: string;
  initials: string;
  role: "cashier" | "cook";
  status: "active" | "inactive";
}

interface UserCardProps {
  user: User;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
}) => {
  const avatarBgColor =
    user.role === "cashier" ? "bg-violet-100" : "bg-gray-100";
  const avatarTextColor =
    user.role === "cashier" ? "text-violet-600" : "text-gray-600";

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
              {user.initials}
            </span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-bold leading-6 text-gray-900 truncate">
              {user.name}
            </h3>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <RoleBadge role={user.role} />
            <StatusBadge status={user.status} />
          </div>
          <ActionButtons
            onEdit={() => onEdit(user.id)}
            onDelete={() => onDelete(user.id)}
          />
        </div>
      </div>
    </article>
  );
};
