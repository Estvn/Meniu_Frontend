"use client";
import { QRCodeSection } from "./QRCodeSection";

interface TableCardProps {
  tableId: string;
  onDeactivate?: () => void;
  onViewQR?: () => void;
  numeroMesa?: number;
  estadoMesa?: string;
}

export const TableCard = ({
  tableId,
  onDeactivate,
  onViewQR,
  numeroMesa,
  estadoMesa,
}: TableCardProps) => {
  return (
    <article className="flex flex-col gap-3 items-start p-3 bg-white rounded-lg shadow-sm w-full sm:p-4 sm:gap-2.5">
      <div className="flex items-start justify-between self-stretch w-full">
        <div className="flex items-center flex-1 min-w-0">
          <div className="flex justify-center items-center w-10 h-10 bg-red-50 rounded-full shrink-0 sm:w-12 sm:h-12">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="table-icon" style="width: 20px; height: 20px; flex-shrink: 0; @media (min-width: 640px) { width: 24px; height: 24px; }"> <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#FF6D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M3 9H21" stroke="#FF6D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M3 15H21" stroke="#FF6D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 3V21" stroke="#FF6D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15 3V21" stroke="#FF6D00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </svg>',
              }}
            />
          </div>
          <div className="flex flex-col items-start pl-2 sm:pl-3 flex-1 min-w-0">
            <div className="flex flex-col items-start w-full">
              <div className="flex flex-col items-start self-stretch w-full">
                <h3 className="text-sm font-bold leading-5 text-gray-900 truncate sm:text-base sm:leading-6">
                  Mesa {numeroMesa ?? tableId}
                </h3>
              </div>
            </div>
          </div>
        </div>
        {estadoMesa && (
          <span
            className={`text-xs font-bold ml-2 mt-1 ${estadoMesa === 'Activa' ? 'text-green-600' : 'text-red-600'}`}
            style={{ alignSelf: 'flex-start' }}
          >
            {estadoMesa === 'Activa' ? 'Activa' : 'Inactiva'}
          </span>
        )}
      </div>

      <QRCodeSection onViewQR={onViewQR} />

      <div className="flex items-start gap-2 self-stretch w-full sm:gap-2 sm:pt-1">
        <button
          onClick={onDeactivate}
          className={`flex flex-1 justify-center items-center py-2 px-4 rounded-lg transition-colors sm:py-2 sm:px-14 ${
            estadoMesa === 'Inactiva' 
              ? 'bg-green-50 hover:bg-green-100' 
              : 'bg-red-50 hover:bg-red-100'
          }`}
        >
          <span className={`text-xs font-medium leading-4 text-center sm:text-sm sm:leading-5 ${
            estadoMesa === 'Inactiva' ? 'text-green-600' : 'text-red-600'
          }`}>
            {estadoMesa === 'Inactiva' ? 'Activar' : 'Desactivar'}
          </span>
        </button>
      </div>
    </article>
  );
};
