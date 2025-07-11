import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center px-4 py-3 shadow-sm bg-orange-500 bg-opacity-90 min-h-[68px] w-full">
      <div className="flex items-center w-full max-w-7xl mx-auto">
        <div className="flex items-center flex-1">
          <div className="flex justify-center items-center w-8 h-8 rounded-full">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="header-icon" style="width: 20px; height: 20px; flex-shrink: 0; position: relative"> <path d="M4.99998 11.5583C4.15495 11.3769 3.41343 10.8743 2.93185 10.1566C2.45027 9.43889 2.26629 8.5622 2.41871 7.71145C2.57113 6.8607 3.04804 6.10241 3.74883 5.59654C4.44963 5.09068 5.31951 4.87679 6.17498 5C6.3855 4.5222 6.6821 4.08719 7.04998 3.71667C7.43703 3.32864 7.89682 3.02078 8.40303 2.81073C8.90924 2.60068 9.45192 2.49255 9.99998 2.49255C10.548 2.49255 11.0907 2.60068 11.5969 2.81073C12.1031 3.02078 12.5629 3.32864 12.95 3.71667C13.3179 4.08719 13.6145 4.5222 13.825 5C14.6805 4.87679 15.5503 5.09068 16.2511 5.59654C16.9519 6.10241 17.4288 6.8607 17.5812 7.71145C17.7337 8.5622 17.5497 9.43889 17.0681 10.1566C16.5865 10.8743 15.845 11.3769 15 11.5583V17.5H4.99998V11.5583Z" stroke="#FF6D00" stroke-opacity="0.866667" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M5 14.1667H15" stroke="#FF6D00" stroke-opacity="0.866667" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path> </svg>',
              }}
            />
          </div>
          <div className="flex flex-col items-start pl-3 flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold leading-7 text-white truncate">
              Usuarios
            </h1>
            <p className="text-xs sm:text-sm leading-4 text-white opacity-90">
              Gestión de usuarios
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/cb1fecd33d28d3d66f71fad82d739245aab3dcc9?width=56"
            alt=""
            className="w-7 h-7 shadow-sm rounded-full"
          />
        </div>
      </div>
    </header>
  );
};
