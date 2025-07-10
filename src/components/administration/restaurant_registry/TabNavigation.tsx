"use client";

import { useState } from 'react';

interface TabNavigationProps {
  activeTab?: "login" | "register";
  onTabChange?: (tab: "login" | "register") => void;
}

function TabNavigation({
  activeTab: propActiveTab = "register",
  onTabChange,
}: TabNavigationProps) {
  const [internalActiveTab, setInternalActiveTab] = useState<"login" | "register">(propActiveTab);
  
  const isControlled = onTabChange !== undefined;
  const activeTab = isControlled ? propActiveTab : internalActiveTab;

  const handleTabChange = (tab: "login" | "register") => {
    if (isControlled) {
      onTabChange?.(tab);
    } else {
      setInternalActiveTab(tab);
    }
  };

  return (
    <div className="w-full flex justify-center px-4 sm:px-0">
      <div
        className="box-border inline-flex gap-1 sm:gap-2 justify-end items-center py-1 px-1 h-8 sm:h-10 rounded-md bg-zinc-100 w-full max-w-[303px] min-w-[280px] transition-colors duration-300"
        role="tablist"
        aria-label="Opciones de autenticación"
      >
        {/* LOGIN TAB */}
        <div className="relative flex-1 h-6 sm:h-8">
          {/* Fondo deslizante */}
          <div className={`absolute inset-0   transition-all duration-300 ease-in-out mx-1 sm:mx-0 ${activeTab === "login" ? "translate-x-0" : "translate-x-full"}`} />
          
          {/* Botón de Iniciar Sesión */}
          <button
            className={`relative z-10 w-full h-full text-xs sm:text-sm font-medium leading-5 text-center transition-colors duration-300 px-1 sm:px-0 ${activeTab === "login" ? "text-zinc-950" : "text-zinc-500"}`}
            onClick={() => handleTabChange("login")}
            role="tab"
            aria-selected={activeTab === "login"}
            type="button"
          >
            Iniciar Sesión
          </button>
        </div>

        {/* REGISTER TAB */}
        <div className="relative flex-1 h-6 sm:h-8">
          {/* Botón de Registrarse */}
          <button
            className={`relative z-10 w-full h-full text-xs sm:text-sm font-medium leading-5 text-center transition-colors duration-300 px-1 sm:px-0 ${activeTab === "register" ? "text-zinc-950" : "text-zinc-500"}`}
            onClick={() => handleTabChange("register")}
            role="tab"
            aria-selected={activeTab === "register"}
            type="button"
          >
            Registrarse
          </button>
          
          {/* Fondo deslizante (inverso) */}
          <div className={`absolute inset-0 bg-white rounded-sm shadow-sm transition-all duration-300 ease-in-out mx-1 sm:mx-0 ${activeTab === "register" ? "translate-x-0" : "-translate-x-full"}`} />
        </div>
      </div>
    </div>
  );
}

export default TabNavigation;