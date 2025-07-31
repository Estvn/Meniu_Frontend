// Función centralizada para obtener la URL de imagen pública de Google Drive con proxy CORS
export const getImageUrl = (imageRef: string): string => {
  if (!imageRef) return "";
  
  // Si es una URL completa de Google Drive, extraer el id
  if (imageRef.includes('drive.usercontent.google.com') || imageRef.includes('drive.google.com')) {
    const match = imageRef.match(/[?&]id=([^&]+)/);
    if (match) {
      const driveId = match[1];
      return `https://corsproxy.io/?${encodeURIComponent(`https://drive.usercontent.google.com/download?id=${driveId}&authuser=0`)}`;
    }
  }
  
  // Si es una URL directa, usarla con proxy
  if (imageRef.startsWith("http")) {
    return `https://corsproxy.io/?${encodeURIComponent(imageRef)}`;
  }
  
  // Si es una ruta relativa del backend
  if (imageRef.startsWith("/")) {
    return import.meta.env.VITE_API_URL + imageRef;
  }
  
  return "";
}; 