import { GOOGLE_CONFIG } from '../values/googleConfig';

interface TokenResponse {
  access_token?: string;
  error?: string;
}

// Función para subir imagen a Google Drive
export const uploadImageToDrive = async (file: File, fileName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Verificar si Google Identity Services está disponible
    if (typeof window !== 'undefined' && window.google && window.google.accounts && window.google.accounts.oauth2) {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CONFIG.CLIENT_ID,
        scope: GOOGLE_CONFIG.SCOPES[0],
        callback: async (tokenResponse: TokenResponse) => {
          if (tokenResponse.error) {
            reject(new Error(`Error de autenticación: ${tokenResponse.error}`));
            return;
          }

          try {
            const accessToken = tokenResponse.access_token;
            
            // Crear el archivo en Google Drive
            const metadata = {
              name: fileName,
              parents: ['13tscN0JPd1dxU1zQ1x_EDFKxeloTzl1n'], // Usar la misma carpeta que las mesas por ahora
              mimeType: file.type
            };

            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', file);

            const uploadResponse = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`
              },
              body: form
            });

            if (!uploadResponse.ok) {
              throw new Error(`Error al subir archivo: ${uploadResponse.status}`);
            }

            const uploadResult = await uploadResponse.json();
            const fileId = uploadResult.id;

            // Hacer el archivo público
            const permissionResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                role: 'reader',
                type: 'anyone'
              })
            });

            if (!permissionResponse.ok) {
              console.warn('No se pudo hacer público el archivo:', permissionResponse.status);
            }

            // Construir la URL de descarga
            const downloadUrl = `https://drive.usercontent.google.com/download?id=${fileId}&authuser=0`;
            
            console.log('Imagen subida exitosamente:', downloadUrl);
            resolve(downloadUrl);

          } catch (error) {
            console.error('Error al subir imagen:', error);
            reject(error);
          }
        }
      });

      tokenClient.requestAccessToken();
    } else {
      reject(new Error('Google Identity Services no está disponible'));
    }
  });
};

// Función para eliminar imagen de Google Drive
export const deleteImageFromDrive = async (imageUrl: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Verificar si Google Identity Services está disponible
    if (typeof window !== 'undefined' && window.google && window.google.accounts && window.google.accounts.oauth2) {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CONFIG.CLIENT_ID,
        scope: GOOGLE_CONFIG.SCOPES[0],
        callback: async (tokenResponse: TokenResponse) => {
          if (tokenResponse.error) {
            reject(new Error(`Error de autenticación: ${tokenResponse.error}`));
            return;
          }

          try {
            const accessToken = tokenResponse.access_token;
            
            // Extraer el ID del archivo de la URL
            let fileId: string;
            if (imageUrl.includes('drive.usercontent.google.com')) {
              const match = imageUrl.match(/[?&]id=([^&]+)/);
              fileId = match ? match[1] : '';
            } else if (imageUrl.includes('drive.google.com')) {
              const match = imageUrl.match(/[-\w]{25,}/);
              fileId = match ? match[0] : '';
            } else {
              throw new Error('URL de imagen no válida');
            }

            if (!fileId) {
              throw new Error('No se pudo extraer el ID del archivo');
            }

            // Eliminar el archivo
            const deleteResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            });

            if (!deleteResponse.ok) {
              // Si el archivo ya no existe (404), no es un error crítico
              if (deleteResponse.status === 404) {
                console.log('El archivo ya no existe en Drive (posiblemente ya fue eliminado)');
                resolve();
                return;
              }
              throw new Error(`Error al eliminar archivo: ${deleteResponse.status}`);
            }

            console.log('Imagen eliminada exitosamente de Drive');
            resolve();

          } catch (error) {
            console.error('Error al eliminar imagen:', error);
            reject(error);
          }
        }
      });

      tokenClient.requestAccessToken();
    } else {
      reject(new Error('Google Identity Services no está disponible'));
    }
  });
}; 