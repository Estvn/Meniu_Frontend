"use client";
import { TableCard } from "./TableCard";

interface Table {
  id: string;
  capacity: number;
}

interface TablesListProps {
  tables: Table[];
  onEditTable?: (tableId: string) => void;
  onDeleteTable?: (tableId: string) => void;
  onViewQR?: (tableId: string) => void;
}

export const TablesList = ({
  tables,
  onEditTable,
  onDeleteTable,
  onViewQR,
}: TablesListProps) => {
  return (
    <section className="flex flex-col gap-3 items-start px-3 pt-0 pb-16 w-full sm:px-4 sm:pb-24">
      <div className="flex flex-col items-start w-full">
        <h2 className="self-stretch text-base font-bold leading-6 text-gray-900 sm:text-lg sm:leading-7">
          Mesas del Restaurante
        </h2>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            tableId={table.id}
            capacity={table.capacity}
            onEdit={() => onEditTable?.(table.id)}
            onDelete={() => onDeleteTable?.(table.id)}
            onViewQR={() => onViewQR?.(table.id)}
          />
        ))}
      </div>
    </section>
  );
};
