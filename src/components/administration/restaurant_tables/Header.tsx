"use client";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between px-3 py-2 shadow-sm bg-orange-500 bg-opacity-90 min-h-[60px] w-full sm:px-4 sm:py-3 sm:min-h-[68px]">
      <div className="flex items-center flex-1 min-w-0">
        <div className="flex shrink-0 justify-center items-center w-6 h-6 rounded-full sm:w-8 sm:h-8">
          <div
            dangerouslySetInnerHTML={{
              __html:
                '<svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="header-icon" style="width: 16px; height: 16px; flex-shrink: 0; @media (min-width: 640px) { width: 20px; height: 20px; }"> <path d="M4.99998 11.5583C4.15495 11.3769 3.41343 10.8743 2.93185 10.1566C2.45027 9.43889 2.26629 8.5622 2.41871 7.71145C2.57113 6.8607 3.04804 6.10241 3.74883 5.59654C4.44963 5.09068 5.31951 4.87679 6.17498 5C6.3855 4.5222 6.6821 4.08719 7.04998 3.71667C7.43703 3.32864 7.89682 3.02078 8.40303 2.81073C8.90924 2.60068 9.45192 2.49255 9.99998 2.49255C10.548 2.49255 11.0907 2.60068 11.5969 2.81073C12.1031 3.02078 12.5629 3.32864 12.95 3.71667C13.3179 4.08719 13.6145 4.5222 13.825 5C14.6805 4.87679 15.5503 5.09068 16.2511 5.59654C16.9519 6.10241 17.4288 6.8607 17.5812 7.71145C17.7337 8.5622 17.5497 9.43889 17.0681 10.1566C16.5865 10.8743 15.845 11.3769 15 11.5583V17.5H4.99998V11.5583Z" stroke="#FF6D00" stroke-opacity="0.866667" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M5 14.1667H15" stroke="#FF6D00" stroke-opacity="0.866667" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"></path> </svg>',
            }}
          />
        </div>
        <div className="flex flex-col shrink-0 items-start pl-2 sm:pl-3 flex-1 min-w-0">
          <div className="flex flex-col items-start w-full">
            <div className="flex flex-col items-start self-stretch w-full">
              <h1 className="self-stretch text-base font-bold leading-5 text-white truncate sm:text-lg sm:leading-7">
                {title}
              </h1>
            </div>
            <div className="flex flex-col items-start self-stretch w-full">
              <p className="text-xs leading-3 text-white truncate sm:leading-4 max-w-full">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Espacio para balancear el layout en pantallas más grandes */}
      <div className="hidden sm:flex flex-col shrink-0 items-start p-2 w-9 h-9 rounded-full bg-orange-500 bg-opacity-0" />
    </header>
  );
};
