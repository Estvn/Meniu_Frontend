"use client";
import React from "react";
import { UserCard } from "./UserCard";
import type { User } from "../../../types/User";

interface UserListProps {
  users: User[];
  onEditUser: (userId: number) => void;
  onDeleteUser: (userId: number) => void;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  onEditUser,
  onDeleteUser,
}) => {
  return (
    <section className="w-full flex-1">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl font-bold leading-7 text-gray-900">
            Usuarios del Personal
          </h2>
        </div>
        <div className="space-y-4 mb-8">
          {users.map((user) => (
            <UserCard
              key={user.id_usuario}
              user={user}
              onEdit={onEditUser}
              onDelete={onDeleteUser}
            />
          ))}
        </div>
        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500 mb-8">
            No se encontraron usuarios
          </div>
        )}
      </div>
    </section>
  );
};
