"use client";
import { Header } from "./Header";
import { SearchBar } from "./SearchBar";
import { StatsSection } from "./StatsSection";
import { TablesList } from "./TablesList";

interface Table {
  id: string;
  capacity: number;
}

interface MesasGerenteProps {
  tables?: Table[];
  onRegisterNewTable?: () => void;
  onEditTable?: (tableId: string) => void;
  onDeleteTable?: (tableId: string) => void;
  onViewQR?: (tableId: string) => void;
}

const defaultTables: Table[] = [
  { id: "M001", capacity: 4 },
  { id: "M002", capacity: 4 },
  { id: "M003", capacity: 4 },
];

export const MesasGerente = ({
  tables = defaultTables,
  onRegisterNewTable,
  onEditTable,
  onDeleteTable,
  onViewQR,
}: MesasGerenteProps) => {
  return (
    <main className="relative bg-gray-50 min-h-screen w-full">
      <div className="flex flex-col w-full">
        <Header title="Mesas" subtitle="Gestión de Mesa" />
        
        <SearchBar placeholder="Buscar mesa..." />
        
        <StatsSection
          totalTables={tables.length}
          onRegisterNewTable={onRegisterNewTable}
        />
        
        <TablesList
          tables={tables}
          onEditTable={onEditTable}
          onDeleteTable={onDeleteTable}
          onViewQR={onViewQR}
        />
      </div>
    </main>
  );
};

export default MesasGerente;
