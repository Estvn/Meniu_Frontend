import React from "react";
import { LogoutIcon } from "../icons/LogoutIcon";

interface LogoutButtonProps {
  onClick?: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick }) => {
  return (
    <button
      className="flex relative gap-1.5 items-start pt-3 pr-20 pb-3 pl-3 h-11 rounded-lg w-[209px] max-md:py-2.5 max-md:pr-16 max-md:pl-3 max-md:h-10 max-md:w-[180px] max-sm:px-3 max-sm:py-2 max-sm:w-auto max-sm:h-9"
      onClick={onClick}
    >
      <div className="absolute left-3 top-3 max-md:top-2.5 max-sm:relative max-sm:left-0 max-sm:top-0">
        <LogoutIcon className="w-5 h-5 flex-shrink-0" />
      </div>
      <span className="absolute shrink-0 h-5 text-sm font-medium leading-5 text-center text-gray-600 left-[37px] top-[11px] w-[91px] max-md:top-2.5 max-md:w-20 max-md:text-sm max-md:left-[35px] max-sm:relative max-sm:top-0 max-sm:left-0 max-sm:w-auto max-sm:text-xs max-sm:text-center">
        Cerrar Sesión
      </span>
    </button>
  );
};
