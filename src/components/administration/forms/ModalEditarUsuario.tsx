"use client";
import * as React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { useRoles } from "../../../endpoints/administration/roles";
import { useUpdateUser } from "../../../endpoints/administration/updateUser";
import type { User } from "../../../types/User";

interface ModalEditarUsuarioProps {
  onClose?: () => void;
  onCancel?: () => void;
  user: User;
}

export function ModalEditarUsuario({
  onClose,
  onCancel,
  user,
}: ModalEditarUsuarioProps) {
  const [nombre, setNombre] = React.useState(user.nombre);
  const [apellidos, setApellidos] = React.useState(user.apellidos);
  const [email, setEmail] = React.useState(user.email);
  const [password, setPassword] = React.useState("");
  const [activo, setActivo] = React.useState(user.activo);
  const [idRol, setIdRol] = React.useState<number | null>(null);
  
  const { data: roles, isLoading } = useRoles();
  const { mutate: updateUser, isPending } = useUpdateUser();

  // Mapear el rol actual al id_rol correspondiente
  React.useEffect(() => {
    if (roles && user.rol) {
      const currentRole = roles.find((role: { nombreRol: string }) => role.nombreRol === user.rol);
      if (currentRole) {
        setIdRol(currentRole.id_rol);
      }
    }
  }, [roles, user.rol]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!idRol) {
      alert('Por favor seleccione un rol');
      return;
    }

    const updateData = {
      password: password || undefined, // Solo enviar si se cambió
      activo,
      nombre,
      apellidos,
      email,
      id_rol: idRol
    };

    // Filtrar campos undefined
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => value !== undefined)
    );

    updateUser({
      userId: user.id_usuario,
      data: filteredData as {
        password?: string;
        activo: number;
        nombre: string;
        apellidos: string;
        email: string;
        id_rol: number;
      }
    }, {
      onSuccess: () => {
        onClose?.();
      },
      onError: (error) => {
        alert(`Error al actualizar usuario: ${error.message}`);
      }
    });
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const isFormValid = nombre && apellidos && email && idRol;

  return (
    <Modal onClose={onClose}>
      <form
        className="flex relative flex-col shrink-0 gap-3.5 items-start self-stretch"
        onSubmit={handleSubmit}
      >
        <header className="flex relative flex-col items-start self-stretch">
          <h1 className="relative text-base font-bold leading-6 text-gray-900 max-sm:text-sm">
            Editar usuario: {user.nombreUsuario}
          </h1>
        </header>
        
        {/* Campo Nombre */}
        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            placeholder="Ingrese el nombre"
          />
        </div>

        {/* Campo Apellidos */}
        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-gray-700">Apellidos</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={apellidos}
            onChange={e => setApellidos(e.target.value)}
            required
            placeholder="Ingrese los apellidos"
          />
        </div>

        {/* Campo Email */}
        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Ingrese el email"
          />
        </div>

        {/* Campo Contraseña */}
        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-gray-700">Nueva Contraseña (opcional)</label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Dejar vacío para mantener la actual"
          />
        </div>

        {/* Campo Estado */}
        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-gray-700">Estado</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={activo}
            onChange={e => setActivo(Number(e.target.value))}
            required
          >
            <option value={1}>Activo</option>
            <option value={0}>Inactivo</option>
          </select>
        </div>

        {/* Campo Rol */}
        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-gray-700">Rol</label>
          {isLoading ? (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500">
              Cargando roles...
            </div>
          ) : (
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={idRol || ""}
              onChange={e => setIdRol(Number(e.target.value))}
              required
            >
              <option value="">Seleccione un rol</option>
              {roles?.map((role: { id_rol: number; nombreRol: string }) => (
                <option key={role.id_rol} value={role.id_rol}>
                  {role.nombreRol}
                </option>
              ))}
            </select>
          )}
        </div>
        
        <div className="flex gap-2 justify-end w-full pt-4">
          <Button
            variant="secondary"
            onClick={handleCancel}
            type="button"
            className="max-sm:w-full"
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            className="max-sm:w-full"
            disabled={isPending || !isFormValid}
          >
            {isPending ? "Actualizando..." : "Actualizar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ModalEditarUsuario; 