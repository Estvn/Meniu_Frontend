"use client";
import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Buscar usuario...",
}) => {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <section className="w-full mb-6">
      <div className="relative">
        <div className="flex justify-center items-start w-full py-4 pr-4 pl-10 bg-white rounded-lg border border-gray-300 border-solid">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full text-base text-gray-900 bg-transparent border-none outline-none placeholder-gray-400"
          />
        </div>
        <div
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
          dangerouslySetInnerHTML={{
            __html:
              '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="search-icon" style="width: 16px; height: 16px;"> <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#9CA3AF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 14L11.1 11.1" stroke="#9CA3AF" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path> </svg>',
          }}
        />
      </div>
    </section>
  );
};
