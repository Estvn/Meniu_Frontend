"use client";
import React from "react";

interface AddUserButtonProps {
  onClick: () => void;
}

export const AddUserButton: React.FC<AddUserButtonProps> = ({ onClick }) => {
  return (
    <div className="w-full mb-6">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-center p-4 sm:p-5 rounded-lg shadow-sm bg-orange-500 bg-opacity-90 hover:bg-orange-600 transition-colors duration-200"
      >
        <span className="text-sm sm:text-base leading-5 text-center text-white font-medium">
          Agregar nuevo usuario de personal
        </span>
      </button>
    </div>
  );
};
