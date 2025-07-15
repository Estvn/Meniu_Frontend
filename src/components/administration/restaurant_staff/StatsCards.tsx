import React from "react";

interface StatsCardsProps {
  cashierCount: number;
  cookCount: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  cashierCount,
  cookCount,
}) => {
  return (
    <section className="w-full mb-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
          <div className="flex flex-col items-start p-4 sm:p-6 bg-white rounded-lg shadow-sm">
            <span className="text-2xl sm:text-3xl font-bold leading-8 text-gray-900 mb-2">
              {cashierCount}
            </span>
            <span className="text-sm sm:text-base leading-5 text-gray-600">
              Cajeros
            </span>
          </div>
          <div className="flex flex-col items-start p-4 sm:p-6 bg-white rounded-lg shadow-sm">
            <span className="text-2xl sm:text-3xl font-bold leading-8 text-black mb-2">
              {cookCount}
            </span>
            <span className="text-sm sm:text-base leading-5 text-gray-600">
              Cocineros
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
