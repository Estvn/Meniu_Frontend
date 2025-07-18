"use client";

interface StatCardProps {
  value: string;
  label: string;
  isEmpty?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export function StatCard({ value, label, isEmpty = false, isActive = false, onClick }: StatCardProps) {
  if (isEmpty) {
    return (
      <div className="flex flex-col items-start justify-center p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-100 w-full min-h-[80px] sm:min-h-[100px] transition-all duration-200 hover:shadow-md" />
    );
  }

  return (
    <article 
      className={`flex flex-col items-start justify-center p-3 sm:p-4 rounded-lg shadow-sm border w-full min-h-[80px] sm:min-h-[100px] transition-all duration-200 cursor-pointer ${
        isActive 
          ? 'bg-orange-50 border-orange-200 shadow-md' 
          : 'bg-white border-gray-100 hover:shadow-md hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col items-start w-full">
        <h3 className={`w-full text-xl sm:text-2xl lg:text-3xl font-bold leading-tight sm:leading-8 break-words ${
          isActive ? 'text-orange-600' : 'text-gray-900'
        }`}>
          {value}
        </h3>
      </div>
      <div className="flex flex-col items-start w-full mt-1 sm:mt-2">
        <p className={`w-full text-xs sm:text-sm lg:text-base leading-4 sm:leading-5 break-words ${
          isActive ? 'text-orange-500' : 'text-gray-600'
        }`}>
          {label}
        </p>
      </div>
    </article>
  );
}
