"use client";

interface StatCardProps {
  value: string;
  label: string;
}

const StatCard = ({ value, label }: StatCardProps) => {
  return (
    <div className="flex flex-col items-start self-stretch p-3 bg-white rounded-lg shadow-sm w-full sm:p-4 sm:w-[185px]">
      <div className="flex flex-col items-start self-stretch">
        <div className="self-stretch text-xl font-bold leading-7 text-gray-900 sm:text-2xl sm:leading-8">
          {value}
        </div>
      </div>
      <div className="flex flex-col items-start self-stretch">
        <div className="self-stretch text-xs leading-4 text-gray-600 sm:text-sm sm:leading-5">
          {label}
        </div>
      </div>
    </div>
  );
};

interface StatsSectionProps {
  totalTables: number;
  onRegisterNewTable?: () => void;
}

export const StatsSection = ({
  totalTables,
  onRegisterNewTable,
}: StatsSectionProps) => {
  return (
    <section className="flex flex-col gap-6 items-start px-3 py-3 w-full sm:px-4 sm:gap-8 sm:py-3">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex my-5 gap-3 justify-center items-start self-stretch w-full sm:flex-row">
          <StatCard value={totalTables.toString()} label="Total Mesas" />
          <div className="flex flex-col items-start self-stretch p-3 rounded-lg shadow-sm w-full sm:p-4 sm:w-[185px]" />
        </div>
        <button
          onClick={onRegisterNewTable}
          className="flex flex-col items-start p-3 rounded-lg shadow-sm bg-orange-500 bg-opacity-90 w-full hover:bg-opacity-100 transition-all sm:p-4 sm:h-[53px]"
        >
          <div className="flex flex-col items-start self-stretch">
            <div className="self-stretch text-xs leading-4 text-center text-white sm:text-sm sm:leading-5">
              Registrar nueva mesa en el restaurante
            </div>
          </div>
        </button>
      </div>
    </section>
  );
};
