"use client";
import { HeaderNavBar } from "../navbar/HeaderNavBar";
import { SearchSection } from "./SearchSection";
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
  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderNavBar title="Mesas" subtitle="Gestión de Mesa" />
      <div className="flex-1 flex flex-col pt-16 sm:pt-18 md:pt-20">
        <SearchSection onSearch={handleSearch} />
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
