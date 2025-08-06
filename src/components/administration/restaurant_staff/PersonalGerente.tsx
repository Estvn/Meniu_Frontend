"use client";
import React, { useState, useEffect } from "react";
import { HeaderNavBar } from "../navbar/HeaderNavBar";
import { SearchSection } from "./SearchSection";
import { StatsCards } from "./StatsCards";
import { AddUserButton } from "./AddUserButton";
import { UserList } from "./UserList";
import { ModalCrearUsuario } from "../forms/ModalCrearUsuario";
import { ModalEditarUsuario } from "../forms/ModalEditarUsuario";
import { ModalEliminarUsuario } from "../forms/ModalEliminarUsuario";
import { useCreateUser } from "../../../endpoints/administration/createUser";
import { useUsers } from "../../../endpoints/administration/users";
import { Modal } from "../forms/Modal";
import type { User } from "../../../types/User";

export const PersonalGerente: React.FC = () => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showCrearUsuario, setShowCrearUsuario] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState<User | null>(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<User | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRoleFilter, setActiveRoleFilter] = useState<"todos" | "cajeros" | "cocineros">("todos");

  const { mutate: createUser } = useCreateUser();
  const { data: users, isLoading, error, refetch } = useUsers();

  // Función para filtrar usuarios por búsqueda y rol
  const filterUsers = React.useCallback((users: User[], query: string, roleFilter: string) => {
    let filtered = users;

    // Filtrar por rol
    if (roleFilter !== "todos") {
      filtered = filtered.filter((user) => {
        if (roleFilter === "cajeros") {
          return user.rol === "Cajero";
        } else if (roleFilter === "cocineros") {
          return user.rol === "Cocinero";
        }
        return true;
      });
    }

    // Filtrar por búsqueda
    if (query.trim()) {
      filtered = filtered.filter((user) =>
        user.nombreUsuario.toLowerCase().includes(query.toLowerCase()) ||
        user.nombre.toLowerCase().includes(query.toLowerCase()) ||
        user.apellidos.toLowerCase().includes(query.toLowerCase())
      );
    }

    return filtered;
  }, []);

  // Actualizar usuarios filtrados cuando cambian los datos, búsqueda o filtro
  useEffect(() => {
    if (users) {
      const filtered = filterUsers(users, searchQuery, activeRoleFilter);
      setFilteredUsers(filtered);
    }
  }, [users, searchQuery, activeRoleFilter, filterUsers]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRoleFilter = (role: "todos" | "cajeros" | "cocineros") => {
    setActiveRoleFilter(role);
  };

  const handleAddUser = () => {
    setShowCrearUsuario(true);
  };
  
  const handleCloseCrearUsuario = () => {
    setShowCrearUsuario(false);
  };
  
  const handleSubmitCrearUsuario = (userData: {
    nombre: string;
    apellidos: string;
    email: string;
    id_rol: number;
    id_restaurante: number;
  }) => {
    console.log('handleSubmitCrearUsuario called with:', userData);
    createUser(userData, {
      onSuccess: (response) => {
        console.log("Usuario creado exitosamente:", response);
        setSuccessMessage(`Usuario creado: ${userData.nombre} ${userData.apellidos}.         Contraseña: ${response.password || 'No disponible'}`);
        setShowSuccessModal(true);
        setShowCrearUsuario(false);
        
        // Recargar la lista de usuarios
        refetch();
      },
      onError: (error) => {
        console.error("Error al crear usuario:", error);
        setErrorMessage(error.message || 'Error al crear usuario');
        setShowErrorModal(true);
      }
    });
  };

  const handleEditUser = (userId: number) => {
    const user = users?.find(u => u.id_usuario === userId) || null;
    setUsuarioAEditar(user);
  };
  
  const handleCloseEditarUsuario = () => {
    setUsuarioAEditar(null);
  };

  const handleDeleteUser = (userId: number) => {
    const user = users?.find(u => u.id_usuario === userId) || null;
    setUsuarioAEliminar(user);
  };

  const handleCloseEliminarUsuario = () => {
    setUsuarioAEliminar(null);
  };

  // Calcular estadísticas basadas en los roles
  const cashierCount = users?.filter((user) => user.rol === "Cajero").length || 0;
  const cookCount = users?.filter((user) => user.rol === "Cocinero").length || 0;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderNavBar title="Personal" subtitle="Gestión de Personal" />
        <div className="flex-1 flex flex-col pt-16 sm:pt-18 md:pt-20 px-3 sm:px-6 md:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Cargando usuarios...</div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col">
        <HeaderNavBar title="Personal" subtitle="Gestión de Personal" />
        <div className="flex-1 flex flex-col pt-16 sm:pt-18 md:pt-20 px-3 sm:px-6 md:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-600">Error al cargar usuarios: {error.message}</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderNavBar title="Personal" subtitle="Gestión de Personal" />
      <div className="flex-1 flex flex-col pt-16 sm:pt-18 md:pt-20 px-3 sm:px-6 md:px-8">
        <SearchSection 
          onSearch={handleSearch} 
          onRoleFilter={handleRoleFilter}
          activeRoleFilter={activeRoleFilter}
        />
        <StatsCards cashierCount={cashierCount} cookCount={cookCount} />
        <AddUserButton onClick={handleAddUser} />
        <UserList
          users={filteredUsers}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
      </div>
      
      {showCrearUsuario && (
        <ModalCrearUsuario
          onClose={handleCloseCrearUsuario}
          onCancel={handleCloseCrearUsuario}
          onSubmit={handleSubmitCrearUsuario}
        />
      )}
      
      {usuarioAEditar && (
        <ModalEditarUsuario
          onClose={handleCloseEditarUsuario}
          onCancel={handleCloseEditarUsuario}
          user={usuarioAEditar}
        />
      )}

      {usuarioAEliminar && (
        <ModalEliminarUsuario
          onClose={handleCloseEliminarUsuario}
          onCancel={handleCloseEliminarUsuario}
          user={usuarioAEliminar}
        />
      )}

      {/* Modal de éxito */}
      {showSuccessModal && (
        <Modal onClose={() => setShowSuccessModal(false)}>
          <div className="flex flex-col items-center justify-center p-4">
            <h2 className="text-xl font-bold mb-2 text-center text-green-600">¡Usuario Creado!</h2>
            <p className="text-center mb-4">{successMessage}</p>
            <button 
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              onClick={() => setShowSuccessModal(false)}
            >
              Aceptar
            </button>
          </div>
        </Modal>
      )}

      {/* Modal de error */}
      {showErrorModal && (
        <Modal onClose={() => setShowErrorModal(false)}>
          <div className="flex flex-col items-center justify-center p-4">
            <h2 className="text-xl font-bold mb-2 text-center text-red-600">Error</h2>
            <p className="text-center mb-4">{errorMessage}</p>
            <button 
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              onClick={() => setShowErrorModal(false)}
            >
              Cerrar
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
};

export default PersonalGerente;
