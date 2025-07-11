"use client";
import React from "react";
import { UserCard } from "./UserCard";

interface User {
  id: string;
  name: string;
  initials: string;
  role: "cashier" | "cook";
  status: "active" | "inactive";
}

interface UserListProps {
  users: User[];
  onEditUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  onEditUser,
  onDeleteUser,
}) => {
  return (
    <section className="w-full flex-1">
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-bold leading-7 text-gray-900">
          Usuarios del Personal
        </h2>
      </div>
      <div className="space-y-4">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={onEditUser}
            onDelete={onDeleteUser}
          />
        ))}
      </div>
      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron usuarios
        </div>
      )}
    </section>
  );
};
