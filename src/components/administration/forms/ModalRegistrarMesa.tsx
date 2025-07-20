"use client";
import * as React from "react";
import { Modal } from "./Modal";
import { FormField } from "./FormField";
import { Button } from "./Button";
import { useState } from 'react';

interface ModalRegistrarMesaProps {
  onClose?: () => void;
  onSubmit?: (mesaNo: string) => void;
  onCancel?: () => void;
}

function getRestauranteIdFromToken() {
  const token = sessionStorage.getItem('access_token');
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const payload = JSON.parse(jsonPayload);
    return payload.restaurante_id;
  } catch {
    return null;
  }
}

export function ModalRegistrarMesa({ onClose, onSubmit, onCancel }: ModalRegistrarMesaProps) {
  const [mesaNo, setMesaNo] = React.useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mesaNo) return;
    setLoading(true);
    try {
      // 1. Generar contenido del QR con número de mesa y restaurante_id
      const restauranteId = getRestauranteIdFromToken();
      if (!restauranteId) throw new Error('No se pudo obtener el restaurante_id del token');
      const qrContent = JSON.stringify({ numero_mesa: mesaNo, restaurante_id: restauranteId });
      
      // 2. Enviar a backend solo el contenido del QR (no imagen)
      const token = sessionStorage.getItem('access_token');
      const payload = {
        numero_mesa: Number(mesaNo),
        estado_mesa: 'Activa',
        qr_code: qrContent
      };
      await fetch('http://localhost:3000/mesas/crear-mesa-ln', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      setMesaNo("");
      if (onSubmit) onSubmit(mesaNo);
      if (onClose) onClose();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      alert('Error al registrar mesa: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <form
        className="flex relative flex-col shrink-0 gap-3.5 items-start self-stretch"
        onSubmit={handleSubmit}
      >
        <header className="flex relative flex-col items-start self-stretch">
          <h1 className="relative text-base font-bold leading-6 text-gray-900 max-sm:text-sm">
            Registrar mesa en el restaurante
          </h1>
        </header>
        <FormField
          label="Mesa No.:"
          placeholder="Digite un número"
          value={mesaNo}
          onChange={setMesaNo}
        />
        <div className="flex gap-2 justify-end w-full pt-4">
          <Button
            variant="secondary"
            onClick={onCancel}
            type="button"
            className="max-sm:w-full"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button variant="primary" type="submit" className="max-sm:w-full" disabled={loading}>
            {loading ? 'Agregando...' : 'Agregar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default ModalRegistrarMesa; 