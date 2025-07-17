"use client";
import * as React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { useUpdateUser, type DeleteUserRequest } from "../../../endpoints/administration/updateUser";
import type { User } from "../../../types/User";

interface ModalEliminarUsuarioProps {
  onClose?: () => void;
  onCancel?: () => void;
  user: User;
}

export function ModalEliminarUsuario({
  onClose,
  onCancel,
  user,
}: ModalEliminarUsuarioProps) {
  const [confirmText, setConfirmText] = React.useState("");
  const { mutate: updateUser, isPending } = useUpdateUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (confirmText.toLowerCase() !== "eliminar") {
      alert('Debe escribir exactamente "eliminar" para confirmar');
      return;
    }

    // Usar el endpoint de actualización para desactivar el usuario
    const deleteData: DeleteUserRequest = {
      activo: 0,
      id_rol: 2 // Mantener el rol actual o usar uno por defecto
    };
    
    updateUser({
      userId: user.id_usuario,
      data: deleteData
    }, {
      onSuccess: () => {
        onClose?.();
      },
      onError: (error) => {
        alert(`Error al eliminar usuario: ${error.message}`);
      }
    });
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const isFormValid = confirmText.toLowerCase() === "eliminar";

  return (
    <Modal onClose={onClose}>
      <form
        className="flex relative flex-col shrink-0 gap-3.5 items-start self-stretch"
        onSubmit={handleSubmit}
      >
        <header className="flex relative flex-col items-start self-stretch">
          <h1 className="relative text-base font-bold leading-6 text-red-600 max-sm:text-sm">
            Eliminar Usuario
          </h1>
        </header>
        
        <div className="w-full">
          <p className="text-sm text-gray-700 mb-4">
            Está a punto de eliminar al usuario <strong>{user.nombreUsuario}</strong> ({user.nombre} {user.apellidos}).
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Esta acción desactivará permanentemente la cuenta del usuario. Para confirmar, escriba <strong>"eliminar"</strong> en el campo de abajo.
          </p>
        </div>

        {/* Campo de confirmación */}
        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Escriba "eliminar" para confirmar
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            placeholder="eliminar"
            required
          />
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
            {isPending ? "Eliminando..." : "Eliminar Usuario"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ModalEliminarUsuario; 