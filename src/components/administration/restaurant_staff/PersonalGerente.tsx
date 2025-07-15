"use client";
import React, { useState } from "react";
import { HeaderNavBar } from "../navbar/HeaderNavBar";
import { SearchSection } from "./SearchSection";
import { StatsCards } from "./StatsCards";
import { AddUserButton } from "./AddUserButton";
import { UserList } from "./UserList";

interface User {
  id: string;
  name: string;
  initials: string;
  role: "cashier" | "cook";
  status: "active" | "inactive";
}

const initialUsers: User[] = [
  {
    id: "1",
    name: "cajero01",
    initials: "CA1",
    role: "cashier",
    status: "active",
  },
  {
    id: "2",
    name: "Carlos López",
    initials: "CO1",
    role: "cook",
    status: "inactive",
  },
];

export const PersonalGerente: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(initialUsers);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredUsers(filtered);
    }
  };

  const handleAddUser = () => {
    console.log("Add new user");
  };

  const handleEditUser = (userId: string) => {
    console.log("Edit user:", userId);
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  const cashierCount = users.filter((user) => user.role === "cashier").length;
  const cookCount = users.filter((user) => user.role === "cook").length;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderNavBar title="Personal" subtitle="Gestión de Personal" />
      <div className="flex-1 flex flex-col pt-16 sm:pt-18 md:pt-20 px-3 sm:px-6 md:px-8">
        <SearchSection onSearch={handleSearch} />
        <StatsCards cashierCount={cashierCount} cookCount={cookCount} />
        <AddUserButton onClick={handleAddUser} />
        <UserList
          users={filteredUsers}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      </div>
    </main>
  );
};

export default PersonalGerente;
