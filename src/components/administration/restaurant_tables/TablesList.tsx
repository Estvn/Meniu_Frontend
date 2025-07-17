"use client";
import { TableCard } from "./TableCard";

interface Table {
  id: string;
  qr_code?: string;
  numero_mesa?: number;
  estado_mesa?: string;
}

interface TablesListProps {
  tables: Table[];
  onDeactivateTable?: (tableId: string) => void;
  onViewQR?: (tableId: string) => void;
}

export const TablesList = ({
  tables,
  onDeactivateTable,
  onViewQR,
}: TablesListProps) => {
  return (
    <section className="flex flex-col gap-3 items-start px-3 pt-0 pb-16 w-full sm:px-4 sm:pb-24">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex flex-col items-start w-full">
          <h2 className="self-stretch text-base font-bold leading-6 text-gray-900 sm:text-lg sm:leading-7">
            Mesas del Restaurante
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {tables.map((table) => (
            <TableCard
              key={table.id}
              tableId={table.id}
              numeroMesa={table.numero_mesa}
              estadoMesa={table.estado_mesa}
              onDeactivate={() => onDeactivateTable?.(table.id)}
              onViewQR={() => onViewQR?.(table.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
