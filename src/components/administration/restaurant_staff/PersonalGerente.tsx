"use client";
import React, { useState } from "react";
import { Header } from "./Header";
import { SearchBar } from "./SearchBar";
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
      <Header />
      <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 pt-4 pb-6">
        <SearchBar onSearch={handleSearch} />
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
