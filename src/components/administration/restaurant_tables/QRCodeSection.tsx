"use client";

interface QRCodeSectionProps {
  onViewQR?: () => void;
}

export const QRCodeSection = ({ onViewQR }: QRCodeSectionProps) => {
  return (
    <div className="flex flex-col items-start self-stretch p-3 bg-gray-50 rounded-lg">
      <div className="flex gap-2 items-center justify-between self-stretch w-full sm:gap-2.5">
        <div className="flex flex-col items-start flex-1 min-w-0">
          <p className="text-sm leading-5 text-gray-700 truncate w-full">
            Ver Código QR de la Mesa
          </p>
        </div>
        <button
          onClick={onViewQR}
          className="flex shrink-0 justify-center items-center p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow sm:p-2.5"
        >
          <div
            dangerouslySetInnerHTML={{
              __html:
                '<svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="qr-icon" style="width: 20px; height: 20px; @media (min-width: 640px) { width: 25.556px; height: 25.556px; }"> <path d="M20.4537 3.41667H5.54626C4.37009 3.41667 3.41663 4.37014 3.41663 5.5463V20.4537C3.41663 21.6299 4.37009 22.5833 5.54626 22.5833H20.4537C21.6298 22.5833 22.5833 21.6299 22.5833 20.4537V5.5463C22.5833 4.37014 21.6298 3.41667 20.4537 3.41667Z" stroke="#4B5563" stroke-width="2.12963" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M7.67603 7.67592H7.68667" stroke="#4B5563" stroke-width="2.12963" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M18.324 7.67592H18.3346" stroke="#4B5563" stroke-width="2.12963" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M7.67603 18.3241H7.68667" stroke="#4B5563" stroke-width="2.12963" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M18.324 18.3241H18.3346" stroke="#4B5563" stroke-width="2.12963" stroke-linecap="round" stroke-linejoin="round"></path> </svg>',
            }}
          />
        </button>
      </div>
    </div>
  );
};
