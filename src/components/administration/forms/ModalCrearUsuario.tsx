"use client";
import * as React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { useRoles } from "../../../endpoints/administration/roles";
import { getStoredUserData } from "../../../assets/scripts/values/constValues";

interface ModalCrearUsuarioProps {
  onClose?: () => void;
  onSubmit?: (userData: {
    nombre: string;
    apellidos: string;
    email: string;
    id_rol: number;
    id_restaurante: number;
  }) => void;
  onCancel?: () => void;
}

export function ModalCrearUsuario({ onClose, onSubmit, onCancel }: ModalCrearUsuarioProps) {
  const [nombre, setNombre] = React.useState("");
  const [apellidos, setApellidos] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [idRol, setIdRol] = React.useState<number | null>(null);
  
  const { data: roles, isLoading, error } = useRoles();
  const userData = getStoredUserData();
  
  console.log('Decoded user data from JWT:', userData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', { nombre, apellidos, email, idRol, userData });
    
    if (nombre && apellidos && email && idRol && userData?.restaurante_id) {
      console.log('All validations passed, calling onSubmit');
      onSubmit?.({
        nombre,
        apellidos,
        email,
        id_rol: idRol,
        id_restaurante: userData.restaurante_id
      });
    } else {
      console.log('Validation failed:', {
        nombre: !!nombre,
        apellidos: !!apellidos,
        email: !!email,
        idRol: !!idRol,
        userData: !!userData,
        restaurante_id: !!userData?.restaurante_id
      });
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  // Verificar si hay token de autenticación
  const token = React.useMemo(() => {
    return sessionStorage.getItem('access_token');
  }, []);

  if (!token) {
    return (
      <Modal onClose={onClose}>
        <div className="flex relative flex-col shrink-0 gap-3.5 items-start self-stretch">
          <header className="flex relative flex-col items-start self-stretch">
            <h1 className="relative text-base font-bold leading-6 text-gray-900 max-sm:text-sm">
              Generar nuevo usuario
            </h1>
          </header>
          <div className="w-full px-3 py-2 border border-red-300 rounded-md text-sm text-red-600">
            Error: No hay sesión activa. Por favor, inicie sesión nuevamente.
          </div>
          <div className="flex gap-2 justify-end w-full pt-4">
            <Button
              variant="secondary"
              onClick={handleCancel}
              type="button"
              className="max-sm:w-full"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  const isFormValid = nombre && apellidos && email && idRol;
  
  console.log('Form validation state:', {
    nombre,
    apellidos,
    email,
    idRol,
    isFormValid,
    isLoading,
    userData: userData?.restaurante_id
  });

  return (
    <Modal onClose={onClose}>
      <form
        className="flex relative flex-col shrink-0 gap-3.5 items-start self-stretch"
        onSubmit={handleSubmit}
      >
        <header className="flex relative flex-col items-start self-stretch">
          <h1 className="relative text-base font-bold leading-6 text-gray-900 max-sm:text-sm">
            Generar nuevo usuario
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

        {/* Campo Categoría/Rol */}
        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-gray-700">Categoría</label>
          {isLoading ? (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-500">
              Cargando categorías...
            </div>
          ) : error ? (
            <div className="w-full px-3 py-2 border border-red-300 rounded-md text-sm text-red-600">
              Error al cargar categorías: {error.message}
            </div>
          ) : (
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={idRol || ""}
              onChange={e => setIdRol(Number(e.target.value))}
              required
            >
              <option value="">Seleccione una categoría</option>
              {roles?.map((role) => (
                <option key={role.id_rol} value={role.id_rol}>
                  {role.nombreRol}
                </option>
              ))}
            </select>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-2">
          Al presionar "Crear" se mostrará un nuevo usuario en la lista y podrá ver su contraseña en el apartado de edición.
        </p>
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
            disabled={isLoading || !isFormValid}
          >
            Crear
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ModalCrearUsuario; 