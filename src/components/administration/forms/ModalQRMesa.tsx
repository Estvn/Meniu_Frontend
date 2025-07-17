"use client";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { QRCodeSVG } from "qrcode.react";

interface ModalQRMesaProps {
  mesaId: string;
  qrValue: string;
  onClose?: () => void;
}

export function ModalQRMesa({ mesaId, qrValue, onClose }: ModalQRMesaProps) {
  // Determinar el contenido del QR
  let qrContent = '';
  if (qrValue) {
    if (qrValue.startsWith('/uploads')) {
      qrContent = qrValue;
    } else if (qrValue.startsWith('{') && qrValue.endsWith('}')) {
      // Si es un JSON string, usarlo directamente
      qrContent = qrValue;
    } else if (qrValue.startsWith('http')) {
      qrContent = qrValue;
    } else {
      // Si no es ninguno de los anteriores, usar el valor tal como está
      qrContent = qrValue;
    }
  }
  
  console.log('🔍 ModalQRMesa - qrValue recibido:', qrValue);
  console.log('🔍 ModalQRMesa - qrContent para generar:', qrContent);

  // Generar PDF con jsPDF y qrcode
  const handleGeneratePDF = async () => {
    try {
      const jsPDF = (await import("jspdf")).jsPDF;
      const doc = new jsPDF();
      
      // Generar el QR directamente para el PDF
      const QRCode = (await import('qrcode')).default;
      const qrDataUrl = await QRCode.toDataURL(qrContent, { width: 200, margin: 1 });
      
      // Crear imagen desde el data URL
      const img = new Image();
      img.src = qrDataUrl;
      await new Promise((resolve) => { img.onload = resolve; });
      
      doc.text(`Código QR de Mesa ${mesaId}`, 10, 20);
      doc.addImage(img, "PNG", 35, 30, 140, 140);
      window.open(doc.output("bloburl"), "_blank");
    } catch (error) {
      console.error('❌ Error generando PDF:', error);
      alert('Error al generar el PDF del QR.');
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col items-center w-full">
        <h1 className="text-base font-bold leading-6 text-gray-900 mb-4 text-center">
          Código QR de Mesa {mesaId}
        </h1>
        {qrContent ? (
          <div className="mb-4 flex justify-center">
            <QRCodeSVG
              value={qrContent}
              size={200}
              level="M"
              includeMargin={true}
            />
          </div>
        ) : (
          <div className="mb-4 text-red-500">No hay QR disponible</div>
        )}
        <div className="flex gap-2 w-full justify-center mt-2">
          {qrContent && (
            <Button
              variant="secondary"
              type="button"
              onClick={handleGeneratePDF}
              className="max-sm:w-full"
            >
              Generar QR en PDF
            </Button>
          )}
          <Button
            variant="primary"
            type="button"
            onClick={onClose}
            className="max-sm:w-full"
          >
            Ok
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ModalQRMesa; 