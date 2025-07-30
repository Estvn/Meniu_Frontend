"use client";

interface StatsCardsProps {
  stats: {
    totalOrders: number;
    preparingOrders: number;
    readyOrders: number;
    deliveredOrders: number;
    paidOrders: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Pedidos Realizados",
      value: stats.totalOrders,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pedidos en Preparación",
      value: stats.preparingOrders,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Pedidos Listos",
      value: stats.readyOrders,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Pedidos Entregados",
      value: stats.deliveredOrders,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Pedidos Pagados",
      value: stats.paidOrders,
      color: "bg-orange-500",
      textColor: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm sm:text-base font-medium text-gray-600 mb-1">
                {card.title}
              </p>
              <p className={`text-2xl sm:text-3xl font-bold ${card.textColor}`}>
                {card.value}
              </p>
            </div>
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${card.color} flex items-center justify-center`}>
              <svg 
                className="w-6 h-6 sm:w-7 sm:h-7 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {index === 0 && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                )}
                {index === 1 && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
                {index === 2 && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                )}
                {index === 3 && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                )}
                {index === 4 && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                )}
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 