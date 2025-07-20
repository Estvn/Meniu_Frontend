"use client";
import * as React from "react";
import { Modal } from "./Modal";
import { FormField } from "./FormField";
import { Button } from "./Button";

interface ModalEliminarMesaProps {
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  actionType?: 'activate' | 'deactivate';
}

export function ModalEliminarMesa({ onClose, onConfirm, onCancel, actionType = 'deactivate' }: ModalEliminarMesaProps) {
  const [confirmText, setConfirmText] = React.useState("");
  const [touched, setTouched] = React.useState(false);

  const isActivate = actionType === 'activate';
  const requiredText = isActivate ? 'activar' : 'desactivar';
  const title = isActivate ? 'Activar Mesa' : 'Desactivar Mesa';
  const description = isActivate 
    ? "Escriba 'activar' para activar la mesa"
    : "Escriba 'desactivar' para desactivar la mesa";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (confirmText === requiredText) {
      onConfirm?.();
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const showError = touched && confirmText !== requiredText;

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
        <p className="text-sm text-gray-600 mb-2">
          {description}
        </p>
        <FormField
          label="Confirmación"
          placeholder={requiredText}
          value={confirmText}
          onChange={setConfirmText}
        />
        {showError && (
          <span className="mt-1 text-xs text-red-500">Debe escribir exactamente '{requiredText}'</span>
        )}
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
          >
            {isActivate ? 'Activar' : 'Desactivar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ModalEliminarMesa; 