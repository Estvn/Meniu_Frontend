import React from "react";

interface ActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        className="flex items-center justify-center p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
        aria-label="Editar usuario"
      >
        <div
          dangerouslySetInnerHTML={{
            __html:
              '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="edit-icon" style="width: 16px; height: 16px;"> <path d="M7.33337 2.66663H2.66671C2.31309 2.66663 1.97395 2.8071 1.7239 3.05715C1.47385 3.3072 1.33337 3.64634 1.33337 3.99996V13.3333C1.33337 13.6869 1.47385 14.0261 1.7239 14.2761C1.97395 14.5262 2.31309 14.6666 2.66671 14.6666H12C12.3537 14.6666 12.6928 14.5262 12.9428 14.2761C13.1929 14.0261 13.3334 13.6869 13.3334 13.3333V8.66663" stroke="#4B5563" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12.3334 1.66665C12.5986 1.40144 12.9583 1.25244 13.3334 1.25244C13.7084 1.25244 14.0682 1.40144 14.3334 1.66665C14.5986 1.93187 14.7476 2.29158 14.7476 2.66665C14.7476 3.04173 14.5986 3.40144 14.3334 3.66665L8.00004 9.99999L5.33337 10.6667L6.00004 7.99999L12.3334 1.66665Z" stroke="#4B5563" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> </svg>',
          }}
        />
      </button>
      <button
        onClick={onDelete}
        className="flex items-center justify-center p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
        aria-label="Eliminar usuario"
      >
        <div
          dangerouslySetInnerHTML={{
            __html:
              '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="delete-icon" style="width: 16px; height: 16px;"> <path d="M2 4H3.33333H14" stroke="#DC2626" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12.6667 4.00004V13.3334C12.6667 13.687 12.5262 14.0261 12.2762 14.2762C12.0261 14.5262 11.687 14.6667 11.3334 14.6667H4.66671C4.31309 14.6667 3.97395 14.5262 3.7239 14.2762C3.47385 14.0261 3.33337 13.687 3.33337 13.3334V4.00004M5.33337 4.00004V2.66671C5.33337 2.31309 5.47385 1.97395 5.7239 1.7239C5.97395 1.47385 6.31309 1.33337 6.66671 1.33337H9.33337C9.687 1.33337 10.0261 1.47385 10.2762 1.7239C10.5262 1.97395 10.6667 2.31309 10.6667 2.66671V4.00004" stroke="#DC2626" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6.66663 7.33337V11.3334" stroke="#DC2626" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9.33337 7.33337V11.3334" stroke="#DC2626" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> </svg>',
          }}
        />
      </button>
    </div>
  );
};
