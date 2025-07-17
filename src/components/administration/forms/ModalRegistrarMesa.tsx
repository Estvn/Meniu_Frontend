"use client";
import * as React from "react";
import { Modal } from "./Modal";
import { FormField } from "./FormField";
import { Button } from "./Button";
import QRCode from 'qrcode';
import { useEffect, useRef, useState } from 'react';

interface ModalRegistrarMesaProps {
  onClose?: () => void;
  onSubmit?: (mesaNo: string) => void;
  onCancel?: () => void;
}

const CLIENT_ID = "504411421738-uqlfmcqb14js595ut8p3rvq6nt7ceb3u.apps.googleusercontent.com";
const SCOPE = 'https://www.googleapis.com/auth/drive.file';

// Cargar el script de GIS solo una vez
function useGoogleAccessToken() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const tokenClient = useRef<any>(null);
  const [gisLoaded, setGisLoaded] = useState(false);

  useEffect(() => {
    if (window.google && window.google.accounts && window.google.accounts.oauth2) {
      setGisLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGisLoaded(true);
    document.body.appendChild(script);
  }, []);

  const getToken = async () => {
    return new Promise<string>((resolve, reject) => {
      if (!gisLoaded) {
        reject(new Error('Google Identity Services no cargado'));
        return;
      }
      if (accessToken) {
        resolve(accessToken);
        return;
      }
      if (!tokenClient.current) {
        tokenClient.current = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPE,
          callback: (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              setAccessToken(tokenResponse.access_token);
              resolve(tokenResponse.access_token);
            } else {
              reject(new Error('No se pudo obtener el token de Google.'));
            }
          },
        });
      }
      tokenClient.current.requestAccessToken();
    });
  };

  return { getToken, gisLoaded };
}

async function uploadQRToDrive(dataUrl: string, fileName = 'qr_mesa.png', accessToken: string) {
  const contentType = 'image/png';
  const byteString = atob(dataUrl.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
  const blob = new Blob([ab], { type: contentType });

  const metadata = {
    name: fileName,
    mimeType: contentType,
    parents: ['13tscN0JPd1dxU1zQ1x_EDFKxeloTzl1n'], // ID de la carpeta qr_codes
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', blob);

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
    method: 'POST',
    headers: new Headers({ Authorization: 'Bearer ' + accessToken }),
    body: form,
  });
  const result = await response.json();
  console.log('Resultado de subida a Drive:', result); // <-- log para depuración
  return result.id;
}

async function setDriveFilePublic(fileId: string, accessToken: string) {
  console.log('🔧 Intentando hacer público el archivo:', fileId);
  console.log('🔧 Token de acceso disponible:', !!accessToken);
  
  try {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone',
      }),
    });
    
    console.log('🔧 Respuesta del servidor Drive:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error al establecer permisos:', response.status, errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ Permisos establecidos correctamente:', data);
    
    // Verificar que el archivo sea realmente público
    const verifyResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,webViewLink,webContentLink`, {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    });
    
    if (verifyResponse.ok) {
      const fileInfo = await verifyResponse.json();
      console.log('📁 Información del archivo:', fileInfo);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error completo al establecer permisos:', error);
    throw error;
  }
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
  const { getToken, gisLoaded } = useGoogleAccessToken();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mesaNo) return;
    setLoading(true);
    try {
      if (!gisLoaded) throw new Error('Google Identity Services no cargado');
      // 1. Generar QR con número de mesa y restaurante_id
      const restauranteId = getRestauranteIdFromToken();
      if (!restauranteId) throw new Error('No se pudo obtener el restaurante_id del token');
      const qrPayload = JSON.stringify({ numero_mesa: mesaNo, restaurante_id: restauranteId });
      const QRCode = (await import('qrcode')).default;
      const qrDataUrl = await QRCode.toDataURL(qrPayload, { width: 200, margin: 1 });
      // 2. Obtener token de Google
      const accessToken = await getToken();
      // 3. Subir a Google Drive
      const qrId = await uploadQRToDrive(qrDataUrl, `qr_mesa_${mesaNo}.png`, accessToken);
      console.log('ID del archivo QR subido a Drive:', qrId); // <-- log para depuración
      if (!qrId) {
        throw new Error('No se pudo obtener el ID del archivo subido a Drive');
      }
      // 4. Hacer el archivo público
      await setDriveFilePublic(qrId, accessToken);
      // 5. Enviar a backend como JSON
      const token = sessionStorage.getItem('access_token');
      const payload = {
        numero_mesa: Number(mesaNo),
        estado_mesa: 'Activa',
        qr_code: qrId
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