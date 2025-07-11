"use client";

interface SearchBarProps {
  placeholder?: string;
}

export const SearchBar = ({
  placeholder = "Buscar mesa...",
}: SearchBarProps) => {
  return (
    <section className="flex flex-col gap-3 justify-end items-start px-3 pt-6 pb-0 bg-white border-b border-solid w-full sm:px-4 sm:pt-8">
      <div className="flex flex-col items-start w-full">
        <div className="flex relative justify-center items-start self-stretch py-3 pr-3 pl-9 bg-white rounded-lg border border-gray-300 border-solid sm:py-4 sm:pr-4 sm:pl-10">
          <div className="flex flex-col items-start pb-px flex-[1_0_0]">
            <input
              type="text"
              placeholder={placeholder}
              className="self-stretch text-sm text-gray-400 bg-transparent border-none outline-none sm:text-base"
            />
          </div>
        </div>
        <div className="absolute left-9 top-3 sm:left-12 sm:top-4">
          <div
            dangerouslySetInnerHTML={{
              __html:
                '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="search-icon" style="width: 14px; height: 14px; @media (min-width: 640px) { width: 16px; height: 16px; }"> <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#9CA3AF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 14L11.1 11.1" stroke="#9CA3AF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> </svg>',
            }}
          />
        </div>
      </div>
    </section>
  );
};
