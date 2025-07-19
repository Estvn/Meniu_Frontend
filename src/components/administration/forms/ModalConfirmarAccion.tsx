"use client";
import * as React from "react";
import { Modal } from "./Modal";
import { FormField } from "./FormField";
import { Button } from "./Button";
import { useState } from "react";

interface ModalConfirmarAccionProps {
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  title: string;
  message: string;
  palabraConfirmacion: string;
  placeholder: string;
}

export function ModalConfirmarAccion({ 
  onClose, 
  onConfirm, 
  onCancel, 
  title, 
  message, 
  palabraConfirmacion, 
  placeholder 
}: ModalConfirmarAccionProps) {
  const [textoIngresado, setTextoIngresado] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (textoIngresado.toLowerCase() === palabraConfirmacion.toLowerCase()) {
      onConfirm?.();
    } else {
      setError(`Debe escribir exactamente "${palabraConfirmacion}" para confirmar`);
    }
  };

  const handleCancel = () => {
    setTextoIngresado("");
    setError("");
    onCancel?.();
  };

  return (
    <Modal onClose={onClose}>
      <form
        className="flex relative flex-col shrink-0 gap-3.5 items-start self-stretch"
        onSubmit={handleSubmit}
      >
        <header className="flex relative flex-col items-start self-stretch">
          <h1 className="relative text-base font-bold leading-6 text-gray-900 max-sm:text-sm">
            {title}
          </h1>
        </header>
        
        <div className="w-full">
          <p className="text-sm text-gray-600 mb-4">
            {message}
          </p>
          
          <FormField
            label={`Escriba "${palabraConfirmacion}" para confirmar:`}
            placeholder={placeholder}
            value={textoIngresado}
            onChange={setTextoIngresado}
            required
          />
          
          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
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
            disabled={textoIngresado.toLowerCase() !== palabraConfirmacion.toLowerCase()}
          >
            Confirmar
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ModalConfirmarAccion; 